const { Events, PermissionsBitField } = require('discord.js');
const profanity = require('./words.json')
module.exports = {
  name: Events.MessageCreate,
  client: null,
  async createWebhook(msg, text) {
    // get avatar url
    const avatarUrl = (msg.member.displayAvatarURL({ dynamic: true }) || msg.author.avatarURL({ dynamic: true }))
    const checkperm = msg.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)
    const objwebhook = {
      name: msg.member.displayName,
      avatar: avatarUrl
    }
    if (!checkperm) return msg.channel.send(text);
    let webhook = await msg.channel.fetchWebhooks();

    webhook = webhook.find(x => x.channelId === msg.channel.id) || null

    if (!webhook) {
      webhook = await msg.channel.createWebhook(objwebhook);
    }
    else {
      webhook = await webhook.edit(objwebhook);
    }
    webhook.send(text)

  },

  replaceBad(msg) {
    let parsemsg = msg.content
    let bad = false;
    const re = new RegExp(`\\b(${profanity.join("|")})\\b`, "gi");
    const switchTo = "#";
    const parsed = (parsemsg.match(re))
    if (!parsed) return;
    parsed.forEach(bd => {
      parsemsg = parsemsg.replace(bd, switchTo.repeat(bd.length));
      bad = true
    })


    if (bad) {
      msg.delete().catch(() => { null });
      this.createWebhook(msg, parsemsg).catch(err => console.log(err));
    }
  },

  commandHandler(msg) {
    const prefix = "!!"
    if (!(msg.content.startsWith(prefix) || msg.content.startsWith(msg.author.bot))) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const cmd = this.client.commands
    if (!cmd.has(command)) return msg.channel.send(`${command} not found!`);
    if ((cmd.get(command).devsOnly && !this.client.conf.devs.includes(msg.author.id))) return msg.channel.send("not permitted.")
    this.client.logger.verbose("command args", "%j by %j", args, msg.author.tag)
    try {
	this.client.logger.verbose("command", "command %j ran by %j", command, msg.author.tag)
        cmd.get(command).exc(msg, ...args);
    } catch (err) {
	this.client.logger.info("command", "caught an error in command %j: %j", command, err)
    }
  },

  exc(msg) {
    const inviteLink = /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm
    if (msg.content === '') return;
    if (msg.author.bot) return;
    if (inviteLink.test(msg.content)) return;
    // if (msg.guild.id !== "866693685159395361") return;
    if (msg.webhookId) return;
    this.replaceBad(msg);
    this.commandHandler(msg)
  }
}

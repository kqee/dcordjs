const { readdirSync } = require("fs");

module.exports = {
  name: 'reload',
  client: null,
  devsOnly: true,
  async exc(msg, type) {
    const eventsFile = readdirSync(`${process.cwd()}/event`).filter(
      (file) => (file.endsWith('.js')));
    const commandFile = readdirSync(`${process.cwd()}/commands`).filter(
      (file) => (file.endsWith('.js')));

    if (type === 'events') {
      for (const event of eventsFile) {
        try {
          evt = require(`${process.cwd()}/event/${file}`);
          delete require.cache[`${process.cwd()}/event/${event}`]
          this.client.commands.set(evt.name, evt);
        } catch (error) {
          console.log(error);
        }
      }
    }
    else if (type === "commands") {
      for (const file of commandFile) {
        try {
          cmd = require(`${process.cwd()}/commands/${file}`);
          delete require[`${process.cwd()}/commands/${file}`]
          this.client.commands.set(cmd.name, cmd);
        } catch (error) {
          console.log(error);
        }
      }
    }
    else {
      msg.reply("events, commands")
    }
    msg.reply("command ran")
  }
}


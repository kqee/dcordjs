module.exports = {
  name: "ping",
  client: null,
  async exc(msg, ...args) {
    await msg.reply(`ping ${args.join(" ")}! ${this.client.user.tag}`);
  }
}

module.exports = {
    name: "help",
    client: null,
    async exc(msg) {
        let helpString = this.client.commands
        let helpBlock = ""
        helpString.forEach((_,key)=>helpBlock+=`${key}\n`)
        msg.reply('```\n' + helpBlock + '\n```')
    }
}

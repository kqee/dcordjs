const { readdirSync } = require("fs");

module.exports = {
    name: 'reload',
    client: null,
    devsOnly: true,
    async exc(msg, type) {
        const eventsFile = readdirSync(`${__dirname}/../event`).filter(
            (file) => (file.endsWith('.js')));
        const commandFile = readdirSync(`${__dirname}/../commands`).filter(
            (file) => (file.endsWith('.js')));

        if (type === 'events') {
            for (const event of eventsFile) {
                try {
                    evt = require(`${__dirname}/../event/${event}`);
                    delete require.cache[`${__dirname}/../event/${event}`]
                    this.client.commands.set(evt.name, evt);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        else if (type === "commands") {
            for (const file of commandFile) {
                try {
                    cmd = require(`${__dirname}/../commands/${file}`);
                    delete require[`${__dirname}/../commands/${file}`]
                    this.client.commands.set(cmd.name, cmd);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            msg.reply("I accept two args, that is; events, commands");
            return;

        }
        msg.reply("command ran, error checking not yet implemented for now.");
    }
}


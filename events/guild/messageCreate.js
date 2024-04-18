const fs = require('fs');

module.exports = (Discord, client, message) =>{
    fs.appendFile("text.txt", message.content + " ", function (err) {
        if (err) throw err;
    });
    const prefix = '>>';
    if(message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if(message.content.startsWith(prefix)){
        if(message.content[1] != ' ' && message.content.length > 1){
            try {
                command.execute(message, args, cmd, client, Discord);
            } catch (err) {
                console.log(message.content);
                console.log(err);
            }
        }
    }
}
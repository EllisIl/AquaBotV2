module.exports = {
    name: "commands",
    description: "shows a list of all available commands",
    execute(message, args, cmd, client, Discord) {
        const fs = require('fs');

        // Load the JSON file
        const responses = JSON.parse(fs.readFileSync('messageCommands/responses.json'));

        // Collect all command names
        const commandNames = [];
        for (const commandName in responses) {
            commandNames.push(commandName);
        }

        // Create an embed message with all command names
        const embed = new Discord.EmbedBuilder()
            .setTitle('Available Commands')
            .setDescription(commandNames.join('\n'))
            .setColor('#0099ff');

        // Now you can send the embed message to the channel
        message.channel.send({ embeds: [embed]});
    },
  };
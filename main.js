/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const Discord = require('discord.js'); // itnitializes Discord.js
const { GatewayIntentBits } = require('discord.js'); // initializes GatewayIntentBits
const config = require("./config.json") // gets the bot token from config.json
const variables = require("./variables.json") // gets assorted variables from variables.json
const fs = require('fs');

const responses = JSON.parse(fs.readFileSync('messageCommands/responses.json'));

const client = new Discord.Client({
  intents: [ // list of intents
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Discord.Collection(); // creates handler for commands
client.events = new Discord.Collection(); // creates handler for events

/* -------------------------------------------------------------------------- */
/*                               command handler                              */
/* -------------------------------------------------------------------------- */
["command_handler", "event_handler"].forEach((handler) => { // creates a require statement for every command and event
  require(`./handlers/${handler}`)(client, Discord);
});

/* -------------------------------------------------------------------------- */
/*                               message events                               */
/* -------------------------------------------------------------------------- */
client.on('messageCreate', (message) => { // when a message is created
  if (message.author.bot) return;// check to prevent the bot from looping

  const content = message.content.toLowerCase();
  
  if (responses.hasOwnProperty(content)) {
    const response = responses[content];
    if (response.file) {
      if (Array.isArray(response.file)) {
        response.file.forEach(file => {
          message.channel.send({ files: [file] });
        });
      } else {
        message.channel.send({ files: [response.file] });
      }
    } else if (response.variable) {
      message.channel.send(variables[response.variable]);
    } else if (response.cutie) {
      if (message.author.id === variables[response.cutie.author]) {
        message.channel.send(response.cutie.content);
      } else {
        const randomIndex = Math.floor(Math.random() * response.random.length);
        message.channel.send(variables[response.random[randomIndex].variable]);
      }
    } else if (response.mention) {
      message.channel.send(`<@${variables[response.mention]}> ${response.content}`);
    }
  } else if (content == variables.saber){
    message.react("<a:saberburger:982806522314772562>");
    
  }
});

/* -------------------------------------------------------------------------- */
/*                                  login bot                                 */
/* -------------------------------------------------------------------------- */

client.login(config.token); // logs the bot into discord and brings it online

setInterval(function () {
  client.login(config.token);
}, 1827600) // logs in every few minutes to make sure the bot stays online (this is bad as it can have Discord reset the token)

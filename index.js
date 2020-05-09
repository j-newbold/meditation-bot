require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('message', (message) => {
    if (message.content == 'ping') {
        message.channel.send('pong');
    }
});

//console.log(process.env.TOKEN);
bot.login(process.env.TOKEN);
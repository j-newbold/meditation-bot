require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const cmdDir = './cmds';
bot.commands = new Discord.Collection();
let cooldown = new Set();
const cdseconds = 5;

fs.readdir('./cmds/', (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
        console.log('No commands to load!');
        return;
    }
    console.log(`loading ${jsfiles.length} commands!`);
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}: ${f} loaded!`);
        bot.commands.set(f, props);
    });
});

bot.on('message', async (message) => {
    if (message.author.bot) return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(process.env.PREFIX)) return;
    if(cooldown.has(message.author.id)) {
        message.delete();
        return message.reply("please wait "+cdseconds+" seconds between commands.");
    } else {
        cooldown.add(message.author.id);
    }

    let cmd = bot.commands.get(command.slice(process.env.PREFIX.length)+'.js');
    if (cmd) cmd.run(bot, message, args);

    setTimeout(() => {
        cooldown.delete(message.author.id);
    }, cdseconds * 1000)
});

bot.login(process.env.TOKEN);
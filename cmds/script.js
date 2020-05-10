var wordDelay = 280;
var baseDelay = 2300;
const discord = require('discord.js');
const fs = require('fs');
module.exports.run = async(bot, message, args) => {
    var convoChannel = message.channel;
    let filter = () => true;
    var text = fs.readFileSync('./scripts/script1.txt','utf8');
    text = text.split('\r\n');
    let exitHandler = new discord.MessageCollector(convoChannel, filter);
    let ret = false;
    exitHandler.on('collect', (message, col) => {
        if (message.content === 'exit') {
            ret = true;
            console.log('received "exit"');
            exitHandler.stop();
        }
    });

    let i = 0;
    await lineWait(1000);
    var x;
    let txtCmd = '';
    let txtArgs = '';
    let totalDelay = 0;
    while (!ret) {
        if (text[i].length >= 2 && text[i].slice(0,1)+text[i].slice(-1) == '{}') {
            console.log('found a command');
            x = text[i].slice(1,-1).split(':');
            txtCmd = x[0];
            txtArgs = x.slice(1);
            switch (txtCmd) {
                case 'SPEED':
                    baseDelay = Number(txtArgs[0]);
                    wordDelay = Number(txtArgs[1]);
                    console.log('changed speed to: '+baseDelay+', '+wordDelay);
                    break;
            }
            x = await lineWait(10);
        } else {
            x = await convoChannel.send(text[i]);
            console.log('wait time: '+baseDelay+wordDelay*text[i].split(' ').length);
            totalDelay = baseDelay + wordDelay*text[i].split(' ').length;
            x = await lineWait(totalDelay);
        }
        console.log(i);
        i+=1;
        if (i >= text.length) {
            return;
        }
    }
    return;
}

const lineWait = delay => {
    return new Promise(resolve => setTimeout(resolve, delay)).then(v => 1);
}
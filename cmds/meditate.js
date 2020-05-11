const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const bellSound = 'https://www.youtube.com/watch?v=dIDQoRSJM9I';

module.exports.run = async (bot, message, args) => {
    let mins = Number(args[0]);
    const { channel } = message.member.voice;

    if (channel && Number(mins) > 0) {      //&& Number.isInteger(mins) 
        channel.join()
        .then(connection => {
            playBell(connection, message, channel, false);
        })
        .catch();
        setTimeout(() => {
            channel.join()
            .then(connection=> {
                playBell(connection,message,channel, true);
            })
            .catch();
        }, 60000*mins+5000, message, channel);

    } else {
        message.channel.send("Improper use of command. Join a voice channel and then type !meditate 3 to meditate for 3 minutes");
        
    }
    
    function playBell(connection, message, channel, dcFlag) {
        let stream = ytdl(bellSound, { filter : 'audioonly' });
        let dispatcher = connection.play(stream, streamOptions);
        dispatcher.on('finish', function() {
            if (dcFlag == true) {
                connection.disconnect();
                channel.leave();
            }
        })
    }
}
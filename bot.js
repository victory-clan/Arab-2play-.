const Discord = require('discord.js')
const ytdl = require("ytdl-core");
const { Client, Util } = require('discord.js');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
const client = new Discord.Client();

client.on('ready', function(){
 console.log(`Logged in as ${client.user.tag}!`);
    
   // var s = ['483063515981283354','483063446376677386','483063378726879232','483063354332545045','483063463179190293'];
   var s = ['483055660209012736','480169573530861578','483055655800930315'];
    setInterval(function (){
    client.user.setPresence({
 game: { 
    type: 1,
     url: 'https://www.twitch.tv/skwadraa',
    name: 'Arab || 2play',
    application_id: '541681966404075520',
     assets: {
         large_image:   `${s[Math.floor(Math.random() * s.length)]}`,
  
    }
  }
    });
    }, 5000);
});

const prefix = "2"

client.on('message', async msg => {
    if (msg.author.bot) return undefined;
   
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
   
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
 
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
 
 } if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('يجب توآجد حضرتك بروم صوتي .').then(message =>{message.delete(2000)})
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم').then(message =>{message.delete(2000)})
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم').then(message =>{message.delete(2000)})
        }
 
       
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, msg, voiceChannel, true);
            }
            return msg.channel.send(` **${playlist.title}** تم الإضآفة إلى قأئمة التشغيل`).then(message =>{message.delete(2000)})
        } else {
            try {
 
                var video = await youtube.getVideo(url);
 
            } catch (error) {
                try {
                                            var fast = {};
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                   
                    msg.channel.send(`**
${videos.map(video2 => `[\`${++index}\`]${video2.title}`).join('\n')}**`).then(message =>{
 
                        message.delete(15000)
 
 
                    });
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 5, {
                            maxMatches: 1,
                            time: 20000,
                            errors: ['time']
                        })
 
                        }catch(err) {
                        console.error(err);
                        return msg.channel.send('لم يتم إختيآر مقطع صوتي').then(message =>{message.delete(2000)})
                        }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(':x: لا يتوفر نتآئج بحث ').then(message =>{message.delete(2000)})
                }
        }
 
            return handleVideo(video, msg, voiceChannel);
        }
        }
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لتجآوزه').then(message =>{message.delete(2000)})
        serverQueue.connection.dispatcher.end('تم تجآوز هذآ المقطع').then(message =>{message.delete(2000)})
        return undefined;
    } else if (command === `leave`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لإيقآفه');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('تم إيقآف هذآ المقطع');
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يوجد شيء شغآل.').then(message =>{message.delete(2000)})
        if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`).then(message =>{message.delete(2000)})
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`).then(message =>{message.delete(2000)})
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`).then(message =>{message.delete(2000)})
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `queue`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        let index = 0;
        const embedqu = new Discord.RichEmbed()
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`).then(message =>{message.delete(2000)})
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `pause`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('تم إيقاف الموسيقى مؤقتا!').then(message =>{message.delete(2000)})
        }
        return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
    } else if (command === `stop`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لإيقآفه');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('تم إيقآف هذآ المقطع').then(message =>{message.delete(2000)})
        return undefined;
    } else if (command === `replay`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        const embedNP = new Discord.RichEmbed()
    .setDescription(`سيتم اعاده تشغيل الفديو :**${serverQueue.songs[0].title}**`)
    msg.channel.send({embed: embedNP})
     return handleVideo(video, msg, msg.member.voiceChannel);
         } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('استأنفت الموسيقى بالنسبة لك !').then(message =>{message.delete(2000)})
        }
        return msg.channel.send('لا يوجد شيء حالي في العمل.').then(message =>{message.delete(2000)})
    }
 
    return undefined;
});
 
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
   

    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);
 
        queueConstruct.songs.push(song);
 
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);
    }
    return undefined;
}
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
 
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
 
    serverQueue.textChannel.send(`بدء تشغيل : **${song.title}**`);
}
 
const adminprefix = "$vip";
const devs = ["541681966404075520","413597534187945986"];
client.on('message', message => {
  var argresult = message.content.split(` `).slice(1).join(' ');
    if (!devs.includes(message.author.id)) return;
   
if (message.content.startsWith(adminprefix + 'setgdame')) {
  client.user.setGame(argresult);
    message.channel.sendMessage(`**${argresult} تم تغيير بلاينق البوت إلى **`)
} else
  if (message.content.startsWith(adminprefix + 'setname')) {
client.user.setUsername(argresult).then
    message.channel.sendMessage(`**${argresult}** : تم تغيير أسم البوت إلى`)
return message.reply("**لا يمكنك تغيير الاسم يجب عليك الانتظآر لمدة ساعتين . **");
} else
  if (message.content.startsWith(adminprefix + 'setavatar')) {
client.user.setAvatar(argresult);
  message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
      } else    
if (message.content.startsWith(adminprefix + 'setT')) {
  client.user.setGame(argresult, "https://www.twitch.tv/idk");
    message.channel.sendMessage(`**تم تغيير تويتش البوت إلى  ${argresult}**`)
}
 
});

client.on("message", message => {
    if (message.content === (prefix + "help")) {
     const embed = new Discord.RichEmbed() 
         .setColor("#580e6b")
         .setThumbnail(message.author.avatarURL)
         .setDescription(`**
         ------------------------------
         1play ⇏ لتشغيل أغنية برآبط أو بأسم
         1skip ⇏ لتجآوز الأغنية الحآلية
         1stop ⇏ إيقآف الأغنية مؤقتا
         1replay ⇏ لموآصلة الإغنية بعد إيقآفهآ مؤقتا
         1vol ⇏ لتغيير درجة الصوت 100 - 0
         1leave⇏ لإخرآج البوت من الروم
         1np ⇏ لمعرفة الأغنية المشغلة حآليا
         1queue ⇏ لمعرفة قآئمة التشغيل
         1resume ⇏ لتشغيل الاغنية مرة اخرة 
         1inv  ⇏ اضافة البوت فى سيرفرك
         ------------------------------
         "By 413597534187945986"
         
       **  `)
   message.author.sendEmbed(embed)
   
   }
   });

client.on('message', message => {
     if (message.content === (prefix + "help")) {
     let embed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#8650a7")
  .addField("Done" , " تــــم ارســالك في الخــاص")
  message.channel.sendEmbed(embed);
    }
});

client.on('message' , message => {
    if (message.content === (prefix + "inv")) {
        if(!message.channel.guild) return message.reply('This Command is Only For Servers');
     const embed = new Discord.RichEmbed()
 .setColor("RANDOM")
 .setThumbnail(client.user.avatarURL)
 .setAuthor(message.author.username, message.author.avatarURL)
 .setTitle('Click here to be redirected to Sarcasm System.')//رسالة
 .setURL('https://discordapp.com/oauth2/authorize?client_id=591480680807137301&permissions=8&scope=bot')//حط رابط اضافة البوت
  message.channel.sendEmbed(embed);

   }
});

client.on('message', message => {
     if (message.content === "2inv") {
     let embed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#9B59B6")
  .addField(" Done | تــــم" , " |  تــــم ارســالك في الخــاص")
     
     
     
  message.channel.sendEmbed(embed);
    }
});

client.login(process.env.BOT_TOKEN);

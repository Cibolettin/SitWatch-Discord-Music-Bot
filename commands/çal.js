const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { getVideoSource, downloadVideo, getVoiceConnection } = require('../utils');

module.exports = {
    name: 'çal',
    async execute(message, args, queue) {
        if (!args[0]) return message.reply('Lütfen bir URL belirtin.');

        const videoPageUrl = args[0];
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            const queueConstruct = {
                voiceChannel: message.member.voice.channel,
                connection: null,
                songs: [],
                player: createAudioPlayer(),
            };

            queue.set(message.guild.id, queueConstruct);

            try {
                const videoPath = await getVideoSource(videoPageUrl);
                const videoUrl = `https://sitwatch.net${videoPath}`;
                const filePath = await downloadVideo(videoUrl);

                queueConstruct.songs.push(filePath);

                const connection = getVoiceConnection(message.guild.id, queueConstruct.voiceChannel);
                queueConstruct.connection = connection;

                playSong(message.guild.id, queueConstruct);
                message.reply('Şarkı eklendi ve çalıyor!');
            } catch (err) {
                queue.delete(message.guild.id);
                console.error(err);
                message.reply('Şarkıyı eklerken bir hata oluştu.');
            }
        } else {
            try {
                const videoPath = await getVideoSource(videoPageUrl);
                const videoUrl = `https://sitwatch.net${videoPath}`;
                const filePath = await downloadVideo(videoUrl);

                serverQueue.songs.push(filePath);
                message.reply('Şarkı sıraya eklendi!');
            } catch (err) {
                console.error(err);
                message.reply('Şarkıyı sıraya eklerken bir hata oluştu.');
            }
        }
    },
};

function playSong(guildId, queueConstruct) {
    if (!queueConstruct.songs.length) {
        queueConstruct.connection.destroy();
        queue.delete(guildId);
        queueConstruct.voiceChannel.send('Sıra bitti, çıkış yapıyorum.');
        return;
    }

    const song = queueConstruct.songs.shift();
    const resource = createAudioResource(song);
    queueConstruct.player.play(resource);

    queueConstruct.player.once('idle', () => {
        playSong(guildId, queueConstruct);
    });

    queueConstruct.connection.subscribe(queueConstruct.player);
}

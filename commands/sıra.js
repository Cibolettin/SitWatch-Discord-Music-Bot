const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sıra',
    async execute(message, args, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs.length) return message.reply('Sırada şarkı yok.');

        const songList = serverQueue.songs.map((song, index) => `${index + 1}. ${song}`).join('\n');
        const embed = new EmbedBuilder()
            .setTitle('Sıradaki Şarkılar')
            .setDescription(songList)
            .setColor('#FF0000');
        message.reply({ embeds: [embed] });
    },
};

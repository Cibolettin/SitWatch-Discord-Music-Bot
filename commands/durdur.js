module.exports = {
    name: 'durdur',
    async execute(message, args, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) return message.reply('Çalan bir şarkı yok.');

        serverQueue.player.pause();
        message.reply('Şarkı duraklatıldı.');
    },
};

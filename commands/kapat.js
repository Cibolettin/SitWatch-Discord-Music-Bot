module.exports = {
    name: 'kapat',
    async execute(message, args, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) return message.reply('Çalan bir şarkı yok.');

        serverQueue.songs = [];
        serverQueue.player.stop();
        serverQueue.connection.destroy();
        queue.delete(message.guild.id);

        message.reply('Şarkı çalma durduruldu ve çıkış yapıldı.');
    },
};

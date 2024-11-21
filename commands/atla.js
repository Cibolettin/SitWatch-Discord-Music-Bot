module.exports = {
    name: 'atla',
    execute(message, args, queue) {
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply('Şu anda çalan bir şarkı yok.');
        }

        serverQueue.player.stop();
        message.reply('Şarkı atlandı! 🎶');
    },
};

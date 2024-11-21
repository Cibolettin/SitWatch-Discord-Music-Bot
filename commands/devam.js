module.exports = {
    name: 'devam',
    async execute(message, args, queue) {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) return message.reply('Duraklatılmış bir şarkı yok.');

        serverQueue.player.unpause();
        message.reply('Şarkı devam ediyor.');
    },
};

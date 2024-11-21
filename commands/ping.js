module.exports = {
    name: 'ping',
    execute(message) {
        const ping = message.createdTimestamp - Date.now();
        message.reply(`Ping: ${ping}ms.`);
    },
};

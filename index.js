const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const queue = new Map(); // Şarkı sırası

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.once('ready', () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    const downloadsDir = path.join(__dirname, 'downloads');
    fs.readdir(downloadsDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(downloadsDir, file), err => {
                if (err) throw err;
            });
        }
    });
    console.log('Dosyalar temizlendi.');
});

client.on('ready', () => {
    client.user.setActivity(config.activity.name, { type: config.activity.type });
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, queue);
    } catch (error) {
        console.error(error);
        message.reply('Komut çalıştırılırken bir hata oluştu.');
    }
});

client.login(config.token);

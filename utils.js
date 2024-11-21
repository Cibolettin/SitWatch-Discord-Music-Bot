const { joinVoiceChannel } = require('@discordjs/voice');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function getVideoSource(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('video#video-player').attr('data-video-url');
}

async function downloadVideo(url) {
    const fileName = path.basename(url);
    const filePath = path.join('./downloads', fileName);

    if (fs.existsSync(filePath)) {
        console.log(`${fileName} zaten yüklü. Şarkı yüklenmesi atlandı.`);
        return filePath;
    }

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
}

function getVoiceConnection(guildId, voiceChannel) {
    return joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
}

module.exports = { getVideoSource, downloadVideo, getVoiceConnection };


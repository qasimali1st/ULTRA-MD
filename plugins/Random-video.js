import fetch from 'node-fetch';

const videoUrls = {
    tiktokgirl: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/tiktokgirl.json',
    tiktokghea: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/gheayubi.json',
    tiktokbocil: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/bocil.json',
    tiktoknukhty: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/ukhty.json',
    tiktoksantuy: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/santuy.json',
    tiktokkayes: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/kayes.json',
    tiktokpanrika: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/panrika.json',
    tiktoknotnot: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/notnot.json',
};

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.ok) return response;
        console.log(`Retrying... (${i + 1})`);
    }
    throw new Error('Failed to fetch media content after retries');
};

let handler = async (m, { command, conn }) => {
    const selectedUrl = videoUrls[command];
    if (!selectedUrl) return m.reply('Command not found.');

    // React with a loading emoji
    await m.react('⏳');

    try {
        const response = await fetchWithRetry(selectedUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const videoData = await response.json();
        const video = pickRandom(videoData);

        // Send the video to WhatsApp
        await conn.sendFile(m.chat, video.url, '', '*Here is your video!*\n*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝚄𝙻𝚃𝚁𝙰-𝙼𝙳*', m);

        // Change reaction to a tick mark
        await m.react('✅');
    } catch (error) {
        console.error('Error:', error);
        await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
        await m.react('❌');
    }
};

handler.help = ['tiktokgirl', 'tiktokghea', 'tiktokbocil', 'tiktoknukhty', 'tiktoksantuy', 'tiktokkayes', 'tiktokpanrika', 'tiktoknotnot'];
handler.tags = ['video'];
handler.command = ['tiktokgirl', 'tiktokghea', 'tiktokbocil', 'tiktoknukhty', 'tiktoksantuy', 'tiktokkayes', 'tiktokpanrika', 'tiktoknotnot'];

export default handler;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

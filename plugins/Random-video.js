import fetch from 'node-fetch';

const videoUrls = [
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/tiktokgirl.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/gheayubi.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/bocil.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/ukhty.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/santuy.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/kayes.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/panrika.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokvids/notnot.json',
];

let handler = async (m, { command, conn }) => {
    // Show waiting reaction
    await conn.sendReaction('⏳', m.chat, m.key);
    
    let apiUrl;

    // Randomly select a video source from the list
    const randomUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

    try {
        const response = await fetch(randomUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const videoData = await response.json();
        const video = pickRandom(videoData);

        // Send the video to WhatsApp
        await conn.sendFile(m.chat, video.url, '', 'Here is your video!', m);

        // Change reaction to tick mark
        await conn.sendReaction('✅', m.chat, m.key);
    } catch (error) {
        console.error('Error:', error);
        throw `*ERROR*: ${error.message}`;
    }
};

handler.help = ['tiktokgirl', 'tiktokghea', 'tiktokbocil', 'tiktoknukhty', 'tiktoksantuy', 'tiktokkayes', 'tiktokpanrika', 'tiktoknotnot'];
handler.tags = ['video'];
handler.command = ['tiktokgirl', 'tiktokghea', 'tiktokbocil', 'tiktoknukhty', 'tiktoksantuy', 'tiktokkayes', 'tiktokpanrika', 'tiktoknotnot'];

export default handler;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

import fs from 'fs';

let handler = async (m, { command, conn }) => {
    // Define the TikTok video JSON file mapping based on the command
    const videoFiles = {
        'tiktokgirl': './src/media/tiktokvids/tiktokgirl.json',
        'tiktokghea': './src/media/tiktokvids/gheayubi.json',
        'tiktokbocil': './src/media/tiktokvids/bocil.json',
        'tiktoknukhty': './src/media/tiktokvids/ukhty.json',
        'tiktoksantuy': './src/media/tiktokvids/santuy.json',
        'tiktokkayes': './src/media/tiktokvids/kayes.json',
        'tiktokpanrika': './src/media/tiktokvids/panrika.json',
        'tiktoknotnot': './src/media/tiktokvids/notnot.json'
    };

    // Check if the command exists in the mapping
    if (!(command in videoFiles)) {
        throw 'Command not recognized.';
    }

    // Read the corresponding JSON file
    let videoData;
    try {
        videoData = JSON.parse(fs.readFileSync(videoFiles[command]));
    } catch (error) {
        throw `Failed to read video data: ${error.message}`;
    }

    // Pick a random video URL from the data
    const hasil = pickRandom(videoData);
    if (!hasil || !hasil.url) throw 'No video URL found.';

    // Send a waiting reaction
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Construct the message to send
    const messageText = `Here is your video:`;

    // Send the video file to WhatsApp
    await conn.sendFile(m.chat, hasil.url, '', messageText, m);
    
    // Change reaction to a tick mark
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

const pickRandom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

handler.help = ['tiktokgirl', 'tiktokghea', 'tiktokbocil', 'tiktoknukhty', 'tiktoksantuy', 'tiktokkayes', 'tiktokpanrika', 'tiktoknotnot'];
handler.tags = ['media'];
handler.command = ['tiktokgirl', 'tiktokghea', 'tiktokbocil', 'tiktoknukhty', 'tiktoksantuy', 'tiktokkayes', 'tiktokpanrika', 'tiktoknotnot'];

export default handler;
  

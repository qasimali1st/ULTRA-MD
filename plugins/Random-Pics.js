import fetch from 'node-fetch';

const imageUrls = [
    // Existing URLs
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/china.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/hijab.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/japan.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/korea.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/malaysia.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/random.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/random2.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/thailand.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/vietnam.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/indonesia.json',
    // New URLs from randompics directory
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/boneka.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/blackpink.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/bike.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/antiwork.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/aesthetic.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/justina.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/doggo.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cosplay.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cat.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/car.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/profile.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ppcouple.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/notnot.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/kpop.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/kayes.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ulzzanggirl.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ulzzangboy.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ryujin.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/rose.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/pubg.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/wallml.json',
    'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/wallhp.json',
];

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.ok) return response;
        console.log(`Retrying... (${i + 1})`);
    }
    throw new Error('Failed to fetch media content after retries');
};

let handler = async (m, { command, conn }) => {
    const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    // React with a loading emoji
    await m.react('⏳');

    try {
        const response = await fetchWithRetry(randomUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const imageData = await response.json();
        const image = pickRandom(imageData);

        // Send the image to WhatsApp
        await conn.sendFile(m.chat, image.url, '', `Hi ${m.pushName}, here is the result of: ${command}`, m);

        // Change reaction to a tick mark
        await m.react('✅');
    } catch (error) {
        console.error('Error:', error);
        await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
        await m.react('❌');
    }
};

// Updated help and command lists to include new types
handler.help = ['chinese', 'hijab', 'japanese', 'korean', 'malay', 'randomgirl', 'randomboy', 'thai', 'vietnamese', 'indo', 'boneka', 'blackpink', 'bike', 'antiwork', 'aesthetic', 'justina', 'doggo', 'cosplay', 'cat', 'car', 'profile', 'ppcouple', 'notnot', 'kpop', 'kayes', 'ulzzanggirl', 'ulzzangboy', 'ryujin', 'rose', 'pubg', 'wallml', 'wallhp'];
handler.tags = ['image'];
handler.command = ['chinese', 'hijab', 'japanese', 'korean', 'malay', 'randomgirl', 'randomboy', 'thai', 'vietnamese', 'indo', 'boneka', 'blackpink', 'bike', 'antiwork', 'aesthetic', 'justina', 'doggo', 'cosplay', 'cat', 'car', 'profile', 'ppcouple', 'notnot', 'kpop', 'kayes', 'ulzzanggirl', 'ulzzangboy', 'ryujin', 'rose', 'pubg', 'wallml', 'wallhp'];

export default handler;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
                }

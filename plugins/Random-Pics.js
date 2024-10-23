import fetch from 'node-fetch';

const imageUrls = {
    chinese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/china.json',
    hijab: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/hijab.json',
    malaysia: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/malaysia.json',
    japanese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/japan.json',
    korean: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/korea.json',
    malay: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/malaysia.json',
    random: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/random.json',
    random2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/random2.json',
    thai: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/thailand.json',
    vietnamese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/vietnam.json',
    indo: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/indonesia.json',
    boneka: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/boneka.json',
    blackpink: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/blackpink.json',
    bike: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/bike.json',
    antiwork: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/antiwork.json',
    aesthetic: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/aesthetic.json',
    justina: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/justina.json',
    doggo: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/doggo.json',
    cosplay2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cosplay.json',
    cat: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cat.json',
    car: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/car.json',
    profile2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/profile.json',
    ppcouple2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ppcouple.json',
    notnot: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/notnot.json',
    kpop: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/kpop.json',
    kayes: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/kayes.json',
    ulzzanggirl: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ulzzanggirl.json',
    ulzzangboy: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ulzzangboy.json',
    ryujin: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ryujin.json',
    rose: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/rose.json',
    pubg: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/pubg.json',
    wallml: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/wallml.json',
    wallhp: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/wallhp.json',
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
    const selectedUrl = imageUrls[command];
    if (!selectedUrl) return m.reply('Command not found.');

    // React with a loading emoji
    await m.react('⏳');

    try {
        const response = await fetchWithRetry(selectedUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const imageData = await response.json();
        const image = pickRandom(imageData);

        // Send the image to WhatsApp
        await conn.sendFile(m.chat, image.url, '', `here is the result of: ${command}`, m);

        // Change reaction to a tick mark
        await m.react('✅');
    } catch (error) {
        console.error('Error:', error);
        await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
        await m.react('❌');
    }
};

handler.help = ['chinese', 'malaysia', 'hijab', 'japanese', 'korean', 'malay', 'random', 'random2', 'thai', 'vietnamese', 'indo', 'boneka', 'blackpink', 'bike', 'antiwork', 'aesthetic', 'justina', 'doggo', 'cosplay2', 'cat', 'car', 'profile2', 'ppcouple2', 'notnot', 'kpop', 'kayes', 'ulzzanggirl', 'ulzzangboy', 'ryujin', 'rose', 'pubg', 'wallml', 'wallhp'];
handler.tags = ['image'];
handler.command = ['chinese', 'malaysia', 'hijab', 'japanese', 'korean', 'malay', 'random', 'random2', 'thai', 'vietnamese', 'indo', 'boneka', 'blackpink', 'bike', 'antiwork', 'aesthetic', 'justina', 'doggo', 'cosplay2', 'cat', 'car', 'profile2', 'ppcouple2', 'notnot', 'kpop', 'kayes', 'ulzzanggirl', 'ulzzangboy', 'ryujin', 'rose', 'pubg', 'wallml', 'wallhp'];

export default handler;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

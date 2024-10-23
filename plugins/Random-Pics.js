import fetch from 'node-fetch';

const tiktokImageUrls = {
    chinese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/chinese.json',
    hijab: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/hijab.json',
    japanese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/japanese.json',
    korean: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/korean.json',
    malay: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/malay.json',
    thai: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/thai.json',
    vietnamese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/vietnamese.json',
    indo: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/indo.json',
};

const randomImageUrls = {
    boneka: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/boneka.json',
    blackpink: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/blackpink.json',
    bike: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/bike.json',
    antiwork: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/antiwork.json',
    aesthetic: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/aesthetic.json',
    justina: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/justina.json',
    doggo: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/doggo.json',
    cosplay: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cosplay.json',
    cat: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cat.json',
    car: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/car.json',
    profile: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/profile.json',
    ppcouple: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ppcouple.json',
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
    let url;
    
    // Check if the command corresponds to tiktok images
    if (tiktokImageUrls[command]) {
        url = tiktokImageUrls[command];
    } 
    // Check if the command corresponds to random images
    else if (randomImageUrls[command]) {
        url = randomImageUrls[command];
    } 
    else {
        await m.reply('⚠️ Command not found.');
        return;
    }

    // React with a loading emoji
    await m.react('⏳');

    try {
        const response = await fetchWithRetry(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const imageData = await response.json();
        const image = pickRandom(imageData);

        // Send the image to WhatsApp
        await conn.sendFile(m.chat, image.url, '', 'Here is your image!', m);

        // Change reaction to a tick mark
        await m.react('✅');
    } catch (error) {
        console.error('Error:', error);
        await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
        await m.react('❌');
    }
};

handler.help = [
    'chinese', 'hijab', 'japanese', 'korean', 'malay', 'thai', 'vietnamese', 'indo', 
    'boneka', 'blackpink', 'bike', 'antiwork', 'aesthetic', 'justina', 'doggo', 
    'cosplay', 'cat', 'car', 'profile', 'ppcouple', 'notnot', 'kpop', 'kayes', 
    'ulzzanggirl', 'ulzzangboy', 'ryujin', 'rose', 'pubg', 'wallml', 'wallhp'
];
handler.tags = ['image'];
handler.command = [
    'chinese', 'hijab', 'japanese', 'korean', 'malay', 'thai', 'vietnamese', 'indo', 
    'boneka', 'blackpink', 'bike', 'antiwork', 'aesthetic', 'justina', 'doggo', 
    'cosplay', 'cat', 'car', 'profile', 'ppcouple', 'notnot', 'kpop', 'kayes', 
    'ulzzanggirl', 'ulzzangboy', 'ryujin', 'rose', 'pubg', 'wallml', 'wallhp'
];

export default handler;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
    

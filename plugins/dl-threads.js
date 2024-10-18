import axios from 'axios';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    const { data } = await axios.get(url); // Scraping the URL content
    
    // Use nayan-media-downloader to get the media info
    let mediaData = await threads(url);
    const { downloadUrl, fileName, mimetype } = mediaData;

    const caption = `❥ HERE IS YOUR VIDEO \n\n☆ *VIDEO TITLE:* ${fileName}\n\n❥ THANKS FOR CHOOSING GLOBAL-MD`;
    
    await conn.sendFile(m.chat, downloadUrl, fileName, caption, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Instagram Threads:', error);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = ['threads'];

export default handler;

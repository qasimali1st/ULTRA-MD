import axios from 'axios';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    let data = await threads(url);
    const { downloadUrl, fileName, mimetype } = data;

    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    const arrayBuffer = response.data;
    const mediaBuffer = Buffer.from(arrayBuffer);

    await conn.sendFile(m.chat, mediaBuffer, fileName || 'media', `Here is your media`, m, false, { mimetype });
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

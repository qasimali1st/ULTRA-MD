import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    let data = await threads(url);
    const downloadUrl = data?.downloadUrl;

    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    const response = await fetch(downloadUrl);
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    await conn.sendFile(m.chat, mediaBuffer, 'media', 'Here is your media', m);
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

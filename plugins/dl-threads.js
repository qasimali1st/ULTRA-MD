import axios from 'axios';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;
import mime from 'mime-types';  // For MIME type validation

async function downloadContent(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    // Use nayan-media-downloader to get the media info
    const mediaData = await threads(url);
    const { downloadUrl, fileName, mimetype } = mediaData;

    // Validate MIME type
    const supportedTypes = ['video/', 'image/', 'audio/'];
    if (!supportedTypes.some(type => mimetype.startsWith(type))) {
      throw new Error('Unsupported media type');
    }

    const caption = `❥ HERE IS YOUR ${mimetype.split('/')[0]} \n\n☆ *${mimetype.split('/')[0].toUpperCase()} TITLE:* ${fileName}\n\n❥ THANKS FOR CHOOSING GLOBAL-MD`;

    await conn.sendFile(m.chat, downloadUrl, fileName, caption, m, false, { mimetype });
    return true;
  } catch (error) {
    console.error('Error downloading from Instagram Threads:', error);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    return false;
  }
}

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  const success = await downloadContent(args[0]);
  if (success) {
    m.react('✅');
  } else {
    m.react('❌');
  }
};

handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = ['threads'];

export default handler;

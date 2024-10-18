import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { pintarest } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Pinterest link next to the command`;
  if (!args[0].match(/pin\.it\/[^\s]+/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await pintarest(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    // Extract the download URL from mediaData
    const downloadUrl = mediaData.url;
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    const fileName = 'media.jpg';
    const mimetype = 'image/jpeg';
    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Pinterest:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['pinterest <url>'];
handler.tags = ['downloader'];
handler.command = ['pinterest'];

export default handler;

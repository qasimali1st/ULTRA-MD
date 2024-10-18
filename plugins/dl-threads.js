import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    // Extract the video and image URLs based on the structure
    const downloadUrl = mediaData.data.video || mediaData.data.image;
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');

    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    // Determine filename and mimetype based on the content
    const fileName = downloadUrl.endsWith('.mp4') ? 'media.mp4' : 'media.jpg';
    const mimetype = downloadUrl.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg';

    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Instagram Threads:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = ['threads'];

export default handler;

import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { twitterdown } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Twitter link next to the command`;
  if (!args[0].match(/x\.com\/([^\s\/]+\/status\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await twitterdown(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    const { video, image } = mediaData; // Correctly extract the video or image URL
    const downloadUrl = video || image; // Use video if available, else use image
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    const fileName = video ? 'media.mp4' : 'media.jpg';
    const mimetype = video ? 'video/mp4' : 'image/jpeg';
    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Twitter:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.`);
    m.react('❌');
  }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = ['twitter', 'x'];

export default handler;

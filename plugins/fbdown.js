import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { fbdown2 } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Facebook link next to the command`;
  if (!args[0].match(/(facebook\.com\/share\/[^\/]+\/[^\/]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    const key = "Nayan"; // Don't change key
    let mediaData = await fbdown2(url, key);
    console.log('Media Data:', mediaData); // Debug log for media data

    const { hd, sd } = mediaData.media; // Correctly extract the HD or SD URL
    const downloadUrl = hd || sd; // Use HD if available, else use SD
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    const fileName = downloadUrl.endsWith('.mp4') ? 'media_hd.mp4' : 'media_sd.mp4';
    const mimetype = 'video/mp4';
    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Facebook:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.`);
    m.react('❌');
  }
};

handler.help = ['facebook2 <url>', 'fb2 <url>', 'fbdl2 <url>'];
handler.tags = ['downloader'];
handler.command = ['facebook2', 'fb2', 'fbdl2'];

export default handler;

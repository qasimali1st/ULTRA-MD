import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { twitterdown } = pkg;

const handler = async (m, { conn, args }) => {
  // Check for missing arguments
  if (!args[0]) throw `✳️ Please enter the Twitter link next to the command.`;

  // Validate link format
  if (!args[0].match(/x\.com\/([^\s\/]+\/status\/[^\s?]+)/gi)) {
    throw `❌ The provided link is incorrect. Please enter a valid Twitter link.`;
  }

  // Show a "working" reaction
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Check if media exists before fetching data
    if (!await hasMedia(url)) {
      throw new Error('No media found in the provided Twitter link');
    }

    // Fetch media data using nayan-media-downloader
    let mediaData;
    try {
      mediaData = await twitterdown(url);
      console.log('Media Data:', mediaData); // Debug log for media data
    } catch (error) {
      console.error('Error fetching media data:', error.message);
      throw new Error('Could not fetch media information');
    }

    // Handle different media types
    let downloadUrl;
    if (mediaData.hasOwnProperty('download')) {
      downloadUrl = mediaData.download; // Single media download URL
    } else if (mediaData.hasOwnProperty('variants')) {
      // Choose the best quality video variant (modify based on preference)
      downloadUrl = mediaData.variants.find(v => v.format === 'best').url;
    } else {
      throw new Error('Unsupported media type');
    }

    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    // Adjust filename and mimetype based on media type (if necessary)
    const fileName = 'media.mp4';
    const mimetype = 'video/mp4';

    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Twitter:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = ['twitterdl', 'xtdl'];

export default handler;

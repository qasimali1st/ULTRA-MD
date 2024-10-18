import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { likee } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Likee video link next to the command`;
  
  // Updated regex to include various Likee URL patterns
  const likeeRegex = /(likee\.app|likee\.com|likee\.tv|lite\.likeevideo\.com)/;
  if (!args[0].match(likeeRegex)) {
    throw `❌ Link incorrect`;
  }
  
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await likee(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    if (!mediaData.status) {
      throw new Error(`Error: ${mediaData.msg}`);
    }

    const downloadUrl = mediaData.data; // Assuming data contains the download URL
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');

    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    // Determine filename and mimetype
    const fileName = mediaData.name || 'media.mp4'; // Default name
    const mimetype = mediaData.mimetype || 'video/mp4'; // Default mimetype

    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your Likee video`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Likee:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['likee <url>'];
handler.tags = ['downloader'];
handler.command = ['likee'];

export default handler;

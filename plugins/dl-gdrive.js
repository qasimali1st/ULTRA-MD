import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { GDLink } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Google Drive link next to the command`;
  if (!args[0].match(/drive\.google\.com\/(file|open)\/d\/([a-zA-Z0-9_-]+)/)) {
    // Adjust regex to allow both file and document links
    throw `❌ Link incorrect`;
  }
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await GDLink(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    // Check if the media data returned a valid download URL
    const downloadUrl = mediaData.data; // Access the data directly
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl); // Debug log for download URL

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');

    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    // Determine file type and set filename
    const fileName = mediaData.name || 'media.file'; // Use the name from mediaData if available
    const mimetype = mediaData.mimetype || 'application/octet-stream'; // Default mimetype

    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Google Drive:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['gdrive <url>'];
handler.tags = ['downloader'];
handler.command = ['gdrive'];

export default handler;

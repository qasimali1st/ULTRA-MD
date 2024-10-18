import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { GDLink } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Google Drive link next to the command`;
  
  // Updated regex to match both Google Drive and Google Docs links
  if (!args[0].match(/(drive\.google\.com\/file\/d\/|drive\.google\.com\/open\/d\/|docs\.google\.com\/document\/d\/)/)) {
    throw `❌ Link incorrect`;
  }
  
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await GDLink(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    // Check if it's a document or file
    let downloadUrl;
    if (mediaData.data) {
      downloadUrl = mediaData.data; // Handle file downloads
    } else if (mediaData.url) {
      downloadUrl = mediaData.url; // Handle document downloads
    } else {
      throw new Error('Could not fetch the download URL');
    }

    console.log('Download URL:', downloadUrl); // Debug log for download URL

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');

    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    // Determine filename based on type
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

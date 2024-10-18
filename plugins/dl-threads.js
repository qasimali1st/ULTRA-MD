import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url);

    // Fetch media data using nayan-media-downloader
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData);

    // Extract the video or image URL
    const downloadUrl = mediaData.data?.video || mediaData.data?.image;
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl);

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    const fileName = downloadUrl.match(/\.mp4|\.jpg|\.jpeg|\.png/i) ? 'media' + downloadUrl.match(/\.mp4|\.jpg|\.jpeg|\.png/i)[0] : 'media';
    const mimetype = downloadUrl.match(/\.mp4/i) ? 'video/mp4' : downloadUrl.match(/\.jpg|\.jpeg|\.png/i) ? 'image/jpeg' : 'application/octet-stream';

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

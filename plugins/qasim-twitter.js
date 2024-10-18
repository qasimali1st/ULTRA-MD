import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { twitterdown } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Twitter link next to the command`;
  if (!args[0].match(/(twitter\.com|x\.com)\/[^\s]+\/status\/\d+/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await twitterdown(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    const { HD, SD } = mediaData.data; // Destructure HD and SD URLs
    if (!HD && !SD) throw new Error('Could not fetch the download URL');

    // Create buttons for HD and SD options
    const buttons = [
      { buttonId: 'download_hd', buttonText: { displayText: 'Download HD' }, type: 1 },
      { buttonId: 'download_sd', buttonText: { displayText: 'Download SD' }, type: 1 }
    ];

    const message = 'Choose the quality of the video to download:';
    await conn.sendButtons(m.chat, message, buttons, m);

    // Listen for button responses
    conn.on('buttonClick', async (button) => {
      let downloadUrl;
      if (button.id === 'download_hd') {
        downloadUrl = HD;
      } else if (button.id === 'download_sd') {
        downloadUrl = SD;
      }

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to fetch the media content');

      const arrayBuffer = await response.arrayBuffer();
      const mediaBuffer = Buffer.from(arrayBuffer);
      const fileName = downloadUrl.endsWith('.mp4') ? 'media.mp4' : 'media.jpg';
      const mimetype = downloadUrl.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg';

      await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
      m.react('✅');
    });

  } catch (error) {
    console.error('Error downloading from Twitter:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = ['twitter'];

export default handler;

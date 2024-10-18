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

    const { data } = mediaData;
    if (!data) throw new Error('No media data available');

    const { HD, SD } = data; // Safely destructure HD and SD
    if (!HD && !SD) throw new Error('No HD or SD media available');

    // Prepare buttons for HD and SD
    const buttons = [
      { buttonId: 'download_hd', buttonText: { displayText: 'Download HD' }, type: 1 },
      { buttonId: 'download_sd', buttonText: { displayText: 'Download SD' }, type: 1 }
    ];

    const message = 'Choose the quality of the video to download:';
    await conn.sendButton(m.chat, message, buttons, m);

    // Handle button clicks
    conn.on('buttonClick', async (button) => {
      let downloadUrl;
      if (button.id === 'download_hd') {
        downloadUrl = HD;
      } else if (button.id === 'download_sd') {
        downloadUrl = SD;
      } else {
        return; // Ignore if not a valid button
      }

      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Failed to fetch the media content');

        const arrayBuffer = await response.arrayBuffer();
        const mediaBuffer = Buffer.from(arrayBuffer);
        const fileName = downloadUrl.split('/').pop(); // Extract filename from URL

        await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m);
        m.react('✅');
      } catch (error) {
        console.error('Error downloading media:', error.message, error.stack);
        await m.reply('⚠️ An error occurred while fetching the media. Please try again.');
      }
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

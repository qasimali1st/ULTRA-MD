import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { twitterdown } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Twitter link next to the command`;
  if (!args[0].match(/(x\.com\/|twitter\.com\/)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await twitterdown(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    const { HD, SD } = mediaData.data;
    if (!HD && !SD) throw new Error('No media available');

    const buttons = [
      { buttonId: `downloadHD`, buttonText: { displayText: 'Download HD' }, type: 1 },
      { buttonId: `downloadSD`, buttonText: { displayText: 'Download SD' }, type: 1 }
    ];

    await conn.sendButton(m.chat, 'Choose the video quality:', buttons, m);
    
    // Button response handling
    conn.on('buttonResponse', async (buttonResponse) => {
      const buttonId = buttonResponse.buttonId;
      let downloadUrl;

      if (buttonId === 'downloadHD') {
        downloadUrl = HD;
      } else if (buttonId === 'downloadSD') {
        downloadUrl = SD;
      }

      if (downloadUrl) {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Failed to fetch the media content');

        const arrayBuffer = await response.arrayBuffer();
        const mediaBuffer = Buffer.from(arrayBuffer);
        const fileName = buttonId === 'downloadHD' ? 'media_hd.mp4' : 'media_sd.mp4';
        const mimetype = 'video/mp4';

        await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your video`, m, false, { mimetype });
        m.react('✅');
      } else {
        await buttonResponse.reply('⚠️ An error occurred while processing your request.');
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

import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { twitterdown } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Twitter link next to the command`;
  if (!args[0].match(/(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/)) throw `❌ Link incorrect`;
  
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url);

    // Fetch media data using nayan-media-downloader
    let mediaData = await twitterdown(url);
    console.log('Media Data:', mediaData);

    if (!mediaData.status || !mediaData.data) {
      throw new Error('No media data found');
    }

    const { HD, SD } = mediaData.data;

    if (!HD && !SD) {
      throw new Error('No HD or SD links available');
    }

    // Prepare buttons for HD and SD downloads
    let buttons = [
      { buttonId: 'downloadHD', buttonText: { displayText: 'Download HD' }, type: 1 },
      { buttonId: 'downloadSD', buttonText: { displayText: 'Download SD' }, type: 1 }
    ];

    await conn.sendButton(m.chat, 'Choose a quality to download:', buttons, m);

    // Handle button clicks
    conn.on('buttonResponse', async (buttonId, buttonMessage) => {
      let downloadUrl;
      if (buttonId === 'downloadHD') {
        downloadUrl = HD;
      } else if (buttonId === 'downloadSD') {
        downloadUrl = SD;
      }

      if (downloadUrl) {
        try {
          const response = await fetch(downloadUrl);
          if (!response.ok) throw new Error('Failed to fetch media content');
          
          const arrayBuffer = await response.arrayBuffer();
          const mediaBuffer = Buffer.from(arrayBuffer);
          
          const fileName = buttonId === 'downloadHD' ? 'media_hd.mp4' : 'media_sd.mp4';
          const mimetype = 'video/mp4';
          
          await conn.sendFile(m.chat, mediaBuffer, fileName, 'Here is your media', m, false, { mimetype });
        } catch (error) {
          console.error('Error fetching media:', error.message);
          await m.reply('⚠️ An error occurred while fetching the media. Please try again later.');
        }
      }
    });
  } catch (error) {
    console.error('Error downloading from Twitter:', error.message);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = ['twitter'];

export default handler;

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

    // Fetch media data
    let mediaData = await twitterdown(url);
    console.log('Media Data:', mediaData);

    if (!mediaData.status) throw new Error('No media available');

    const { HD, SD } = mediaData.data;

    // Create button options for HD and SD
    const buttons = [
      { buttonId: `downloadHD`, buttonText: { displayText: 'Download HD' }, type: 1 },
      { buttonId: `downloadSD`, buttonText: { displayText: 'Download SD' }, type: 1 }
    ];

    const buttonMessage = {
      text: 'Choose the quality to download:',
      footer: 'Twitter Media Downloader',
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    
    // Wait for the user to click a button
    conn.on('button_click', async (buttonEvent) => {
      const buttonId = buttonEvent.selectedButtonId;

      let downloadUrl;
      if (buttonId === 'downloadHD') {
        downloadUrl = HD;
      } else if (buttonId === 'downloadSD') {
        downloadUrl = SD;
      } else {
        return;
      }

      // Download the media
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to fetch the media content');
      const arrayBuffer = await response.arrayBuffer();
      const mediaBuffer = Buffer.from(arrayBuffer);
      
      const fileName = buttonId === 'downloadHD' ? 'media_hd.mp4' : 'media_sd.mp4';
      const mimetype = 'video/mp4';
      
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
handler.command = ['twitter5'];

export default handler;

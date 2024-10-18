import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { twitterdown } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Twitter link next to the command`;
  if (!args[0].match(/(twitter\.com|x\.com)\/\w+\/status\/\d+/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await twitterdown(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    if (!mediaData.status) throw new Error('Could not fetch media data');

    const { HD, SD } = mediaData.data;
    const buttons = [];

    if (HD) buttons.push(['🎥 HD Video', HD]);
    if (SD) buttons.push(['🎥 SD Video', SD]);

    if (buttons.length === 0) throw new Error('No media available for download');

    // Prepare button message
    const buttonMessage = `Select a video quality to download:`;
    await conn.sendButton(m.chat, buttonMessage, mssg.ig, null, buttons, m);
    m.react('✅');
    
    // Wait for the button response
    conn.on('buttonResponse', async (buttonMsg) => {
      const selectedUrl = buttonMsg.body; // Get the button response URL

      if (!selectedUrl) return;

      try {
        const response = await fetch(selectedUrl);
        if (!response.ok) throw new Error('Failed to fetch the media content');
        const arrayBuffer = await response.arrayBuffer();
        const mediaBuffer = Buffer.from(arrayBuffer);

        const fileName = selectedUrl.includes('HD') ? 'media_hd.mp4' : 'media_sd.mp4';
        const mimetype = 'video/mp4';

        await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
      } catch (error) {
        console.error('Error downloading media:', error.message);
        await buttonMsg.reply('⚠️ An error occurred while downloading the media.');
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

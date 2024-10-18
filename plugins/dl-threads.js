import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  const url = args[0];
  console.log('URL:', url);

  try {
    // Fetch media data using nayan-media-downloader
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData);

    const { video, image } = mediaData.data;
    if (!video && !image) throw new Error('Could not fetch the download URL');

    // Send buttons for SD and HD options
    const buttons = [
      { buttonId: `dl|${url}|sd`, buttonText: { displayText: 'SD' }, type: 1 },
      { buttonId: `dl|${url}|hd`, buttonText: { displayText: 'HD' }, type: 1 }
    ];
    const buttonMessage = {
      text: 'Choose the format to download:',
      footer: 'Instagram Threads Downloader',
      buttons: buttons,
      headerType: 1
    };
    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  } catch (error) {
    console.error('Error:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

const downloadMedia = async (m, { conn, args }) => {
  const [prefix, url, quality] = args[0].split('|');
  console.log('URL:', url, 'Quality:', quality);

  try {
    // Fetch media data using nayan-media-downloader
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData);

    const downloadUrl = quality === 'hd' ? mediaData.data.video : mediaData.data.image;
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl);

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    const fileName = quality === 'hd' ? 'media_hd' : 'media_sd';
    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype: 'application/octet-stream' });
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
handler.button = downloadMedia;

export default handler;

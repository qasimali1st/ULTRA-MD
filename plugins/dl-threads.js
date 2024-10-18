import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  const url = args[0];
  console.log('URL:', url);

  try {
    // Fetch media data using nayan-media-downloader
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData);

    const { video, image } = mediaData.data;
    if (!video && !image) throw new Error('Could not fetch the download URL');

    const buttons = [
      { buttonId: `${usedPrefix}dl ${url}|sd`, buttonText: { displayText: 'SD' }, type: 1 },
      { buttonId: `${usedPrefix}dl ${url}|hd`, buttonText: { displayText: 'HD' }, type: 1 }
    ];
    const buttonMessage = {
      text: 'Choose the format to download:',
      footer: 'Instagram Threads Downloader',
      buttons: buttons,
      headerType: 1
    };
    await conn.sendButton(m.chat, buttonMessage.text, buttonMessage.footer, buttonMessage.buttons, m);
  } catch (error) {
    console.error('Error:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

const downloadMedia = async (m, { conn, args }) => {
  const [url, quality] = args[0].split('|');
  m.react('⏳');

  try {
    let mediaData = await threads(url);
    const downloadUrl = quality === 'hd' ? mediaData.data.video : mediaData.data.image;
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    const fileName = quality === 'hd' ? 'media_hd.mp4' : 'media_sd.jpg';
    const mimetype = quality === 'hd' ? 'video/mp4' : 'image/jpeg';

    await conn.sendFile(m.chat, mediaBuffer, fileName, 'Here is your media', m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Instagram Threads:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.button = downloadMedia;

handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = ['threads'];

export default handler;

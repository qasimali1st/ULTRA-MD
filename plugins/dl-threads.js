import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url);

    // Fetch media data
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData);

    const videoUrls = mediaData.data?.videoUrls; // Assuming this holds HD and SD URLs
    const imageUrl = mediaData.data?.image;

    if (videoUrls) {
      // Prepare message and buttons for HD and SD options
      let play = `
≡ *Video Download Options*
┌──────────────
▢ 📌 *Choose your video quality:*
└──────────────`;
      
      await conn.sendButton2(m.chat, play, null, null, [
        ['🎥 HD Video', `${usedPrefix}download_hd ${url}`],
        ['🎥 SD Video', `${usedPrefix}download_sd ${url}`]
      ], null, m);
      
      conn.mediaData = mediaData; // Store media data for later use
    } else if (imageUrl) {
      // Directly handle image download
      await downloadAndSendMedia(m, imageUrl, 'media.jpg', 'image/jpeg');
    } else {
      throw new Error('No media available');
    }
  } catch (error) {
    console.error('Error:', error.message);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
  }
};

// Function to handle HD video download
const downloadHDVideo = async (m, url) => {
  const mediaData = conn.mediaData; // Retrieve stored media data
  const hdUrl = mediaData.data.videoUrls.hd;
  await downloadAndSendMedia(m, hdUrl, 'media_hd.mp4', 'video/mp4');
};

// Function to handle SD video download
const downloadSDVideo = async (m, url) => {
  const mediaData = conn.mediaData; // Retrieve stored media data
  const sdUrl = mediaData.data.videoUrls.sd;
  await downloadAndSendMedia(m, sdUrl, 'media_sd.mp4', 'video/mp4');
};

// Function to download and send media
const downloadAndSendMedia = async (m, downloadUrl, fileName, mimetype) => {
  const response = await fetch(downloadUrl);
  if (!response.ok) throw new Error('Failed to fetch the media content');

  const arrayBuffer = await response.arrayBuffer();
  const mediaBuffer = Buffer.from(arrayBuffer);

  await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
};

// Export handler
handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = ['threads', 'download_hd', 'download_sd'];

export default handler;

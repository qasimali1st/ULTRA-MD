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

    const videoUrl = mediaData.data?.video; // Use the single video URL
    const imageUrl = mediaData.data?.image;

    if (videoUrl) {
      // Prepare message and buttons for video options
      let play = `
≡ *Video Download Options*
┌──────────────
▢ 📌 *Download Video:*
└──────────────`;
      
      await conn.sendButton2(m.chat, play, null, null, [
        ['🎥 Download Video', `${usedPrefix}download_video ${videoUrl}`]
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

// Function to handle video download
const downloadVideo = async (m, videoUrl) => {
  await downloadAndSendMedia(m, videoUrl, 'media.mp4', 'video/mp4');
};

// Function to download and send media
const downloadAndSendMedia = async (m, downloadUrl, fileName, mimetype) => {
  const response = await fetch(downloadUrl);
  if (!response.ok) throw new Error('Failed to fetch the media content');

  const arrayBuffer = await response.arrayBuffer();
  const mediaBuffer = Buffer.from(arrayBuffer);

  await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
};

// Command to handle download requests
handler.command = ['download_video'];
handler.handler = downloadVideo;

// Export handler
handler.help = ['threads <url>'];
handler.tags = ['downloader'];

export default handler;

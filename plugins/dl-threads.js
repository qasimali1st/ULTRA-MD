import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { threads } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Instagram Threads link next to the command`;
  if (!args[0].match(/threads\.net\/(@[^\s\/]+\/post\/[^\s?]+)/gi)) throw `❌ Link incorrect`;
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url); // Debug log for URL

    // Fetch media data using nayan-media-downloader
    let mediaData = await threads(url);
    console.log('Media Data:', mediaData); // Debug log for media data

    const videoUrls = mediaData.data?.videoUrls; // Assuming this structure holds HD and SD URLs
    const imageUrl = mediaData.data?.image;

    if (videoUrls && videoUrls.length > 0) {
      // Prepare buttons for HD and SD options
      const buttons = [
        { buttonId: 'hd_video', buttonText: { displayText: 'Download HD Video' }, type: 1 },
        { buttonId: 'sd_video', buttonText: { displayText: 'Download SD Video' }, type: 1 }
      ];

      await conn.sendButtons(m.chat, buttons, `Choose the video quality to download:`, m);
      // Store the media data in a temporary variable or a session
      conn.mediaData = mediaData; // Store it to access later
      return; // Exit the function after sending buttons
    } else if (imageUrl) {
      // Handle image download directly
      await downloadAndSendMedia(m, imageUrl, 'media.jpg', 'image/jpeg');
    } else {
      throw new Error('Could not fetch media content');
    }
  } catch (error) {
    console.error('Error downloading from Instagram Threads:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

// Function to handle media download and sending
const downloadAndSendMedia = async (m, downloadUrl, fileName, mimetype) => {
  const response = await fetch(downloadUrl);
  if (!response.ok) throw new Error('Failed to fetch the media content');

  const arrayBuffer = await response.arrayBuffer();
  const mediaBuffer = Buffer.from(arrayBuffer);

  await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your media`, m, false, { mimetype });
  m.react('✅');
};

// Handle button clicks
handler.on('buttonResponse', async (m) => {
  const mediaData = conn.mediaData; // Retrieve stored media data
  const { videoUrls } = mediaData.data;

  if (m.selectedButtonId === 'hd_video') {
    await downloadAndSendMedia(m, videoUrls.hd, 'media_hd.mp4', 'video/mp4');
  } else if (m.selectedButtonId === 'sd_video') {
    await downloadAndSendMedia(m, videoUrls.sd, 'media_sd.mp4', 'video/mp4');
  }
});

// Export handler
handler.help = ['threads <url>'];
handler.tags = ['downloader'];
handler.command = ['threads'];

export default handler;

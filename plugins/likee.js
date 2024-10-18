import fetch from 'node-fetch';
import pkg from 'nayan-media-downloader';
const { likee } = pkg;

const handler = async (m, { conn, args }) => {
  if (!args[0]) throw `✳️ Enter the Likee video link next to the command`;
  
  const likeeRegex = /(likee\.app|likee\.com|likee\.tv|lite\.likeevideo\.com|l\.likee\.video)/;
  if (!args[0].match(likeeRegex)) {
    throw `❌ Link incorrect`;
  }
  
  m.react('⏳');

  try {
    const url = args[0];
    console.log('URL:', url);

    let mediaData = await likee(url);
    console.log('Media Data:', mediaData);

    if (!mediaData.status || mediaData.status !== 200) {
      throw new Error(`Error: ${mediaData.msg}`);
    }

    const downloadUrl = mediaData.data.withoutwatermark;
    if (!downloadUrl) throw new Error('Could not fetch the download URL');

    console.log('Download URL:', downloadUrl);

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Failed to fetch the media content');

    // Check Content-Type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('video')) {
      throw new Error('Invalid content type received');
    }

    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    if (mediaBuffer.length === 0) throw new Error('Downloaded file is empty');

    const fileName = mediaData.data.title ? `${mediaData.data.title}.mp4` : 'media.mp4';
    const mimetype = 'video/mp4';

    await conn.sendFile(m.chat, mediaBuffer, fileName, `Here is your Likee video`, m, false, { mimetype });
    m.react('✅');
  } catch (error) {
    console.error('Error downloading from Likee:', error.message, error.stack);
    await m.reply('⚠️ An error occurred while processing the request. Please try again later.');
    m.react('❌');
  }
};

handler.help = ['likee <url>'];
handler.tags = ['downloader'];
handler.command = ['likee'];

export default handler;

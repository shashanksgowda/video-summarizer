const { google } = require('googleapis');
const { summarizeVideo } = require("../../services/gemini");

const VIDEO_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([^&]+)/;
const PLAYLIST_REGEX =
  /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=([^&]+)/;

const processPlaylistLink = async (playlistId) => {
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_API, // Replace with your API key
  });
  const response = await youtube.playlistItems.list({
    part: "snippet",
    playlistId: playlistId,
    maxResults: 20,
  });
  const videos = [];
  response.data.items.forEach((item) => {
    const videoId = item.snippet.resourceId.videoId;
    const videoTitle = item.snippet.title;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    videos.push({ title: videoTitle, url: videoUrl });
  });

  return videos;
};

const processVideoLink = async (link) => {
  const videoId = link.match(VIDEO_REGEX)[3];
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_API, // Replace with your API key
  });

  const response = await youtube.videos.list({
    part: "snippet",
    id: videoId,
  });
  const video = response.data.items[0];
  const videoTitle = video.snippet.title;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  return { title: videoTitle, url: videoUrl };
};
// returns video summay in a string
const formatSummary = (videoObjects) => {
  // array to string
  const summary = videoObjects
    .map((video) => {
      return `- ${video.title} \n- ${video.summary}`;
    })
    .join("\n");
  return summary.replace(/\n/g, "<br>");
}

const processLinks = async (links) => {
  const data = await Promise.all(
    links.map(async (link) => {
      try {
        if (PLAYLIST_REGEX.test(link)) {
          const playlistId = link.split("playlist?list=")[1]?.trim();
          const videos = await processPlaylistLink(playlistId);
          const promises = Promise.all(
            videos.map(async (video) => {
              const response = await summarizeVideo(video.videoUrl);
              return { title: video.title, summary: response };
            })
          )
          const summaries = await promises;
          return formatSummary(summaries);
        } else if (VIDEO_REGEX.test(link)) {
          const video = await processVideoLink(link);
          const response = await summarizeVideo(video.url);
          return formatSummary([{ title: video.title, summary: response }]);
        } else {
          return Error("invalid link");
        }
      } catch (error) {
        console.error(error);
        return Error("something went wrong");
      }
    })
  );
  return data[0];
};

module.exports = { processLinks };

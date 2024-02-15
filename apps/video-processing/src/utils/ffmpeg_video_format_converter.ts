import { Readable, Stream } from 'stream';
import { spawn } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('fluent-ffmpeg');
// Set the default path to the FFmpeg executable
const ffmpegPath = require('ffmpeg-static');
const ffprobe = require('ffprobe');
import { mkdtemp, writeFile, unlink, readFile, mkdir } from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { RedisRepository, UtilsService } from 'y/common';
import { isAsyncFunction } from 'util/types';
import { createReadStream } from 'fs';
// Set the FFmpeg paconst fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const updateProgressToQueue = (
  message: string,
  redis: RedisRepository,
  videoId: string,
) => {
  redis.setWithExpiry('video-processing', videoId, message, 60 * 60 * 24);
};

// Create a temporary directory

ffmpeg.setFfmpegPath(ffmpegPath);
// ffprobe.setFfprobePath(ffprobe_path);
export const convertVideoFormat = async (
  videoStream: Express.Multer.File,
  format: string,
  videoName: string,
  uniqueVideoName: string,
  redis: RedisRepository,
  utils: UtilsService,
): Promise<{ success: boolean }> => {
  try {
    // Create a temporary file to store the video data
    const tempDir = await mkdtemp(__dirname + 'temp' + 'video-convert');

    updateProgressToQueue('Stored in Server', redis, uniqueVideoName);
    // Create a temporary file name with appropriate extension
    const tempFile = path.join(tempDir, 'video.mp4'); // Ensure appropriate extension
    const videoData = Buffer.from(videoStream.buffer);
    await writeFile(tempFile, videoData);
    // Create the temporary directory if it doesn't exist

    updateProgressToQueue('Stored in Server', redis, uniqueVideoName);
    // Create a temporary file name with appropriate extension

    updateProgressToQueue('Conversion Started', redis, uniqueVideoName);

    const cloudinaryStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id: uniqueVideoName,
        folder: 'processed_videos',
        overwrite: true,
        format: 'mp4',
        eager: [{ format: 'mp4' }],
        timeout: 60000, // Adjust timeout duration (in milliseconds)
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error.message);
          updateProgressToQueue(
            'Error Uploading to Cloudinary',
            redis,
            uniqueVideoName,
          );
          return;
        }
        console.log('Uploaded to Cloudinary:', result);
        updateProgressToQueue('Uploaded to Cloudinary', redis, uniqueVideoName);
      },
    );

    // Pass the video stream directly to ffmpeg
    ffmpeg()
      .input(tempFile)
      // .inputFormat('mp4')
      .videoCodec('libx264')
      .output(cloudinaryStream)
      .outputOptions('-movflags frag_keyframe+empty_moov')
      .outputFormat('mp4')
      .on('start', () => console.log('Conversion and Upload started'))
      .on('progress', (progress: { percent: number }) => {
        updateProgressToQueue(
          `Conversion and Upload Progress: ${progress.percent}`,
          redis,
          uniqueVideoName,
        );
        console.log('Progress:', progress.percent);
      })
      .on('end', async () => {
        console.log('Conversion and Upload finished');
        updateProgressToQueue(
          'Conversion and Upload Finished',
          redis,
          uniqueVideoName,
        );
      })
      .on('error', async (err, stdout, stderr) => {
        console.error('Error during conversion and upload:', err);
        console.error('STD OUT', stdout);
        console.error('STD ERR', stderr);
        updateProgressToQueue(
          'Error during Conversion and Upload',
          redis,
          uniqueVideoName,
        );
      })
      .run();

    return { success: true };
  } catch (error) {
    console.log('An error occurred: ' + error.message);
    return { success: false };
  }
};

async function convertVideoWithBash(
  inputVideo: string,
  outputDir: string,
  redis: RedisRepository,
  videoId: string,
  utils: UtilsService,
): Promise<{ success: boolean }> {
  const scriptPath = 'video_processor.sh'; // Adjust the path if needed
  updateProgressToQueue('Video Processing Started', redis, videoId);
  const command = spawn('bash', [scriptPath, inputVideo, outputDir], {
    stdio: ['inherit', 'pipe', 'pipe'], // Redirect stdout and stderr separately
  });

  // Track progress by monitoring changes to the master playlist file
  let lastProgress = 0; // Initialize progress percentage
  const updateInterval = 1000; // Update progress every second

  const updateProgress = async () => {
    try {
      const masterPlaylist = await readFile(
        `${outputDir}/playlist.m3u8`,
        'utf8',
      );
      // Extract number of segments from the playlist
      const segmentCount = masterPlaylist.match(/\.ts/g).length;
      // Calculate estimated progress based on segment count
      const newProgress = Math.ceil((segmentCount / 10) * 10); // Assuming 10 segments per 10%

      if (newProgress !== lastProgress) {
        console.log(`Conversion progress: ${newProgress}%`);
        lastProgress = newProgress;
      }
    } catch (error) {
      console.error('Error reading master playlist:');
    }
  };

  const progressInterval = setInterval(updateProgress, updateInterval);

  // Handle stdout and stderr separately
  command.stdout.on('data', (data) => {
    updateProgressToQueue(`Video Processing : ${data}`, redis, videoId);
    console.log(`Script output: ${data}`);
  });

  command.stderr.on('data', (data) => {
    updateProgressToQueue(`Video Processing : ${data}`, redis, videoId);
    console.error(`Script error: ${data}`);
  });

  return new Promise((resolve, reject) => {
    command.on('close', (code) => {
      clearInterval(progressInterval); // Stop progress updates
      if (code === 0) {
        console.log('Conversion successful!');
        updateProgressToQueue('Video Processing Finished', redis, videoId);

        resolve({ success: true });
        return utils.uploadProcessedVideo(
          videoId,
          outputDir,
          redis,
          updateProgressToQueue,
        );
      } else {
        console.error(`Script exited with code ${code}`);
        return reject({ success: false });
      }
    });
  });
}

module.exports = {
  convertVideoFormat,
};

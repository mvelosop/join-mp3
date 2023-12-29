import { cp } from "fs";
import { audioFilePath, resultFilePath, videoFilePath } from "./file-params";

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


function mergeAudioWithVideo(audioPath: string, videoPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .addOption('-map', '0:v:0') // Select the video stream from the first input (video file)
            .addOption('-map', '1:a:0') // Select the audio stream from the second input (audio file)
            .addOption('-c:v', 'copy') // Copy the video stream as is
            .addOption('-c:a', 'aac') // Encode the audio stream to AAC
            .addOption('-shortest') // Trim to the shortest stream length
            .output(outputPath)
            .on('end', () => {
                console.log('Merging completed.');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            })
            .run();
    });
}

console.log('Merging audio and video...');
mergeAudioWithVideo(audioFilePath, videoFilePath, resultFilePath)
    .then(() => console.log('Concatenation completed.'))
    .catch((error) => console.error(error));




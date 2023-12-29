import { cp } from "fs";
import { audioFilePath, inputFolder, silenceDuration, silenceFilePath } from "./file-params";

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


// Function to create a silence audio file
async function createSilence(duration: number): Promise<string> {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input('anullsrc') // use anullsrc filter for generating silence
            .inputFormat('lavfi')
            .audioFrequency(44100)
            .audioChannels(2)
            .outputOptions(`-t ${duration}`)
            .save(silenceFilePath)
            .on('end', () => resolve(silenceFilePath))
            .on('error', (err) => reject(err));
    });
}

// Function to concatenate MP3 files with silence
async function concatenateMP3Files() {
    try {
        const silenceFile = await createSilence(silenceDuration);
        const files = fs.readdirSync(inputFolder).filter(file => file.endsWith('.mp3'));

        const merged = ffmpeg();

        files.forEach((file, index) => {
            console.log(`Adding ${file} to the merged file.`);
            merged.input(`${inputFolder}/${file}`);
            merged.input(silenceFile);
        });

        merged.mergeToFile(audioFilePath, './temp')
            .on('error', (err) => console.error(err))
            .on('end', () => {
            console.log('Audio merging completed.');
            });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

console.log('Concatenating MP3 files...');
// Example usage
concatenateMP3Files()
    .then(() => console.log('Concatenation completed.'))
    .catch((error) => console.error(error));




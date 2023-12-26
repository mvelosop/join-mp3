const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const inputFolder = '/Users/miguelveloso/Music/GarageBand/koans';
const outputFilePath = '/Users/miguelveloso/Music/GarageBand/koans.mp3';
const silenceFilePath = '/Users/miguelveloso/Music/GarageBand/silence.mp3';
const silenceDuration = 90; // seconds

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
            if (index < files.length - 1) {
                merged.input(silenceFile);
            }
        });

        merged.mergeToFile(outputFilePath, './temp')
              .on('error', (err) => console.error(err))
              .on('end', () => console.log('Merging completed.'));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

concatenateMP3Files()
.then(() => console.log('Done.'))
.catch((error) => console.error(error));

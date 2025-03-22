const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'songs.txt');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to open (or create) the file for appending
function openFile(callback) {
  fs.open(filePath, 'a', (err, fd) => {
    if (err) {
      console.error('Error opening file:', err);
      process.exit(1);
    }
    callback(fd);
  });
}

// Function to write a song record to the file
function writeSongRecord(fd, record, callback) {
  fs.write(fd, record + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      process.exit(1);
    }
    console.log('Record written:', record);
    callback();
  });
}

// Function to close the file
function closeFile(fd, callback) {
  fs.close(fd, (err) => {
    if (err) {
      console.error('Error closing file:', err);
      process.exit(1);
    }
    console.log('File closed successfully.');
    callback();
  });
}

// Function to prompt user for song details
function promptSongDetails(callback) {
  rl.question('Enter song title: ', (title) => {
    rl.question('Enter artist name: ', (artist) => {
      rl.question('Enter duration (in seconds): ', (duration) => {
        // Format the song record as text
        const record = `Title: ${title}, Artist: ${artist}, Duration: ${duration} sec`;
        callback(record);
      });
    });
  });
}

// Main function to add a song record
function addSongRecord() {
  promptSongDetails((record) => {
    openFile((fd) => {
      writeSongRecord(fd, record, () => {
        closeFile(fd, () => {
          console.log('Song record added successfully!');
          rl.question('Add another song? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
              addSongRecord(); // Recursively prompt for another song
            } else {
              console.log('Exiting...');
              rl.close();
            }
          });
        });
      });
    });
  });
}

// Start the process
addSongRecord();

// Get references to the DOM elements
const audioPlayer = document.getElementById('audio-player');
const playButton = document.getElementById('play');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('previous');
const repeatButton = document.getElementById('repeat');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const progressBar = document.querySelector('.progress');
const progressLine = progressBar.querySelector('.active-line');
const deactiveLine = progressBar.querySelector('.deactive-line');
const tooltip = document.createElement('div');  // Tooltip for showing the time
tooltip.classList.add('tooltip');
progressBar.appendChild(tooltip);

const songs = [
    { title: "Talwinder", artist: "All Time", file: "assets/audio/song2.mp3" },
    { title: "Talwinder", artist: "All Time", file: "assets/audio/song3.mp3" },
    { title: "Talwinder", artist: "All Time", file: "assets/audio/song4.mp3" },
    { title: "Talwinder", artist: "All Time", file: "assets/audio/song5.mp3" }
];

let currentSongIndex = 0;

// Load song into the player
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.file;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    audioPlayer.load();
}

// Play/Pause functionality
playButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.classList.replace('bx-play', 'bx-pause');
    } else {
        audioPlayer.pause();
        playButton.classList.replace('bx-pause', 'bx-play');
    }
});

// Next song functionality
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});

// Previous song functionality
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});

// Repeat functionality
repeatButton.addEventListener('click', () => {
    audioPlayer.loop = !audioPlayer.loop;
    repeatButton.classList.toggle('active', audioPlayer.loop);
});

// Update progress bar and time displays
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    // Format time as MM:SS
    const currentTimeFormatted = formatTime(currentTime);
    const durationFormatted = formatTime(duration);

    // Update UI elements
    currentTimeDisplay.textContent = currentTimeFormatted;
    durationDisplay.textContent = durationFormatted;

    // Update the progress bar
    const progressPercentage = (currentTime / duration) * 100;
    progressLine.style.width = `${progressPercentage}%`;
});

// Format time into MM:SS format
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Allow users to click on the progress bar to skip to that part of the song
progressBar.addEventListener('click', (event) => {
    const clickPosition = event.offsetX; // Position where the user clicked
    const totalWidth = progressBar.offsetWidth; // Total width of the progress bar
    const newTime = (clickPosition / totalWidth) * audioPlayer.duration; // Calculate new time
    audioPlayer.currentTime = newTime; // Set the new time of the audio
});

// Show the current time in the tooltip while hovering over the progress bar
progressBar.addEventListener('mousemove', (event) => {
    const totalWidth = progressBar.offsetWidth;
    const mouseX = event.offsetX; // Mouse position
    const mousePercentage = mouseX / totalWidth;
    const previewTime = mousePercentage * audioPlayer.duration;
    tooltip.textContent = formatTime(previewTime);
    
    // Tooltip will follow the mouse
    const tooltipPosition = mouseX - (tooltip.offsetWidth / 2); // Positioning the tooltip
    tooltip.style.left = `${tooltipPosition}px`;
    tooltip.style.opacity = '1'; // Make sure tooltip is visible during hover
});

// Hide tooltip when mouse is not hovering over progress bar
progressBar.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0'; // Hide tooltip when mouse leaves
});

// Load initial song
loadSong(currentSongIndex);

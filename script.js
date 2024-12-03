const menuOpen = document.getElementById('menu-open');
const menuClose = document.getElementById('menu-close');
const sidebar = document.querySelector('.container .sidebar');

menuOpen.addEventListener('click', () => sidebar.style.left = '0');

menuClose.addEventListener('click', () => sidebar.style.left = '-100%');

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

// Song list with titles, artists, and file paths
const songs = [
    { title: "Ripple Echoes", artist: "Kael Fischer", file: "assets/audio/song1.wav" },
    { title: "Voyage", artist: "Tyde Brennnan", file: "assets/audio/song1.wav" },
    { title: "Breeze", artist: "Sola Kim", file: "assets/audio/song1.wav" },
    { title: "Twilight", artist: "Jett Lawsonn", file: "assets/audio/song1.wav" }
];

let currentSongIndex = 0;

// Function to load a song
function loadSong(songIndex) {
    const song = songs[songIndex];
    audioPlayer.src = song.file;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
}

// Play or pause the song when the play button is clicked
playButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.classList.replace('bx-play', 'bx-pause');
    } else {
        audioPlayer.pause();
        playButton.classList.replace('bx-pause', 'bx-play');
    }
});

// Skip to the next song
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});

// Go back to the previous song
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
});

// Update the song's current time and progress
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    const currentTimeFormatted = formatTime(currentTime);
    const durationFormatted = formatTime(duration);
    
    currentTimeDisplay.textContent = currentTimeFormatted;
    durationDisplay.textContent = durationFormatted;
    
    const progressPercentage = (currentTime / duration) * 100;
    progressBar.querySelector('.active-line').style.width = progressPercentage + '%';
});

// Format time as MM:SS
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Initially load the first song
loadSong(currentSongIndex);

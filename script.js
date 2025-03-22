document.addEventListener('DOMContentLoaded', () => {
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
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    progressBar.appendChild(tooltip);
  
    // Base songs array (initial 4 songs)
    let songs = [
      { title: "Talwinder", artist: "All Time", file: "assets/audio/song2.mp3" },
      { title: "Talwinder", artist: "All Time", file: "assets/audio/song3.mp3" },
      { title: "Talwinder", artist: "All Time", file: "assets/audio/song4.mp3" },
      { title: "Talwinder", artist: "All Time", file: "assets/audio/song5.mp3" }
    ];
  
    // This container holds the rendered song list
    const musicListContainer = document.querySelector('.music-list .items');
    const seeAllLink = document.querySelector('.music-list .header a');
    let currentSongIndex = 0;
  
    // Render initial song list (using base array)
    function renderSongList() {
      musicListContainer.innerHTML = songs.map((song, index) => {
        return `
          <div class="item" data-index="${index}" data-name="${song.title}">
            <div class="info">
              <p>${index + 1}</p>
              <img src="assets/song-placeholder.jpg" alt="${song.title}">
              <div class="details">
                <h5>${song.title}</h5>
                <p>${song.artist}</p>
              </div>
            </div>
            <div class="actions">
              <p>04:00</p>
              <div class="icon"><i class='bx bxs-right-arrow'></i></div>
              <i class='bx bxs-plus-square'></i>
            </div>
          </div>
        `;
      }).join('');
    }
  
    // Load song into the player
    function loadSong(index) {
      const song = songs[index];
      audioPlayer.src = song.file;
      songTitle.textContent = song.title;
      songArtist.textContent = song.artist;
      audioPlayer.load();
    }
  
    // Click on a song item in the list to load and play that song
    musicListContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.item');
      if (item) {
        currentSongIndex = parseInt(item.getAttribute('data-index'), 10);
        loadSong(currentSongIndex);
        audioPlayer.play();
        playButton.classList.replace('bx-play', 'bx-pause');
      }
    });
  
    // Load more songs (simulate 100 songs)
    function loadAllSongs() {
      const totalSongs = 100;
      let newSongs = [];
      for (let i = 0; i < totalSongs; i++) {
        newSongs.push({
          title: `Song ${i + 1}`,
          artist: `Artist ${i + 1}`,
          // For simulation, using the same audio file; replace with unique paths as needed.
          file: "assets/audio/song2.mp3"
        });
      }
      songs = newSongs; // Replace the current songs array with the full list
      renderSongList();
    }
  
    // Button events for player controls
    playButton.addEventListener('click', () => {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.classList.replace('bx-play', 'bx-pause');
      } else {
        audioPlayer.pause();
        playButton.classList.replace('bx-pause', 'bx-play');
      }
    });
  
    nextButton.addEventListener('click', () => {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(currentSongIndex);
      audioPlayer.play();
    });
  
    prevButton.addEventListener('click', () => {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong(currentSongIndex);
      audioPlayer.play();
    });
  
    repeatButton.addEventListener('click', () => {
      audioPlayer.loop = !audioPlayer.loop;
      repeatButton.classList.toggle('active', audioPlayer.loop);
    });
  
    audioPlayer.addEventListener('timeupdate', () => {
      const currentTime = audioPlayer.currentTime;
      const duration = audioPlayer.duration;
      currentTimeDisplay.textContent = formatTime(currentTime);
      durationDisplay.textContent = formatTime(duration);
      const progressPercentage = (currentTime / duration) * 100;
      progressLine.style.width = `${progressPercentage}%`;
    });
  
    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  
    progressBar.addEventListener('click', (event) => {
      const clickPosition = event.offsetX;
      const totalWidth = progressBar.offsetWidth;
      audioPlayer.currentTime = (clickPosition / totalWidth) * audioPlayer.duration;
    });
  
    progressBar.addEventListener('mousemove', (event) => {
      const totalWidth = progressBar.offsetWidth;
      const mouseX = event.offsetX;
      const previewTime = (mouseX / totalWidth) * audioPlayer.duration;
      tooltip.textContent = formatTime(previewTime);
      tooltip.style.left = `${mouseX - (tooltip.offsetWidth / 2)}px`;
      tooltip.style.opacity = '1';
    });
  
    progressBar.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  
    // When "See all" is clicked, load the full list of songs.
    seeAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadAllSongs();
    });
  
    // Initial load
    renderSongList();
    loadSong(currentSongIndex);
  });
  
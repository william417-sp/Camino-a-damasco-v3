class DivineMusicPlayer {
    constructor() {
        this.currentSong = 0;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.playMode = 'normal'; // normal, repeat, shuffle
        this.totalPlays = 0;
        this.totalTime = 0;
        this.favoriteSong = null;
        this.songPlays = {};
        
        this.songs = [
            { title: 'Aleluya', artist: 'Coro de la Iglesia', duration: 225, plays: 0 },
            { title: 'Santo, Santo, Santo', artist: 'Ministerio de Música', duration: 260, plays: 0 },
            { title: 'Cristo Vive', artist: 'Grupo de Alabanza', duration: 210, plays: 0 },
            { title: 'Dios de Maravillas', artist: 'Ministerio de Adoración', duration: 315, plays: 0 },
            { title: 'Mi Refugio', artist: 'Coro de la Iglesia', duration: 240, plays: 0 }
        ];
        
        this.worshipQuotes = [
            { text: "La música es el lenguaje del espíritu", author: "San Agustín" },
            { text: "Cantad al Señor un cántico nuevo", author: "Salmo 96:1" },
            { text: "La música es una revelación más alta que toda la sabiduría y la filosofía", author: "Ludwig van Beethoven" },
            { text: "Alabad al Señor con arpa; cantadle con salterio y decacordio", author: "Salmo 33:2" },
            { text: "La música es el arte más directo, entra por el oído y va al corazón", author: "Magdalena Martínez" },
            { text: "Cantad alegres a Dios, habitantes de toda la tierra", author: "Salmo 100:1" },
            { text: "La música es el eco de la armonía celestial", author: "Anónimo" },
            { text: "Alabadle con címbalos resonantes; alabadle con címbalos de júbilo", author: "Salmo 150:5" }
        ];
        
        this.currentQuoteIndex = 0;
        this.init();
    }

    init() {
        this.loadStats();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateQuote();
        this.startProgressSimulation();
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowLeft') {
                this.previousSong();
            } else if (e.code === 'ArrowRight') {
                this.nextSong();
            }
        });
    }

    selectSong(index) {
        this.currentSong = index;
        this.currentTime = 0;
        this.duration = this.songs[index].duration;
        this.updateDisplay();
        this.updatePlaylist();
        this.play();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        // Update song plays
        this.songs[this.currentSong].plays++;
        this.totalPlays++;
        this.updateStats();
    }

    pause() {
        this.isPlaying = false;
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    previousSong() {
        if (this.playMode === 'shuffle') {
            this.currentSong = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentSong = (this.currentSong - 1 + this.songs.length) % this.songs.length;
        }
        this.selectSong(this.currentSong);
    }

    nextSong() {
        if (this.playMode === 'shuffle') {
            this.currentSong = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentSong = (this.currentSong + 1) % this.songs.length;
        }
        this.selectSong(this.currentSong);
    }

    setMode(mode) {
        this.playMode = mode;
        
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
    }

    seek(event) {
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.currentTime = this.duration * percentage;
        this.updateProgress();
    }

    setVolume(event) {
        const volumeBar = event.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.volume = Math.max(0, Math.min(1, percentage));
        this.updateVolume();
    }

    updateDisplay() {
        const currentSongTitle = document.getElementById('currentSongTitle');
        const currentSongArtist = document.getElementById('currentSongArtist');
        const duration = document.getElementById('duration');
        
        if (currentSongTitle) {
            currentSongTitle.textContent = this.songs[this.currentSong].title;
        }
        if (currentSongArtist) {
            currentSongArtist.textContent = this.songs[this.currentSong].artist;
        }
        if (duration) {
            duration.textContent = this.formatTime(this.duration);
        }
        
        this.updateProgress();
        this.updateVolume();
    }

    updateProgress() {
        const progress = document.getElementById('progress');
        const currentTime = document.getElementById('currentTime');
        
        if (progress) {
            const percentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
            progress.style.width = `${percentage}%`;
        }
        if (currentTime) {
            currentTime.textContent = this.formatTime(this.currentTime);
        }
    }

    updateVolume() {
        const volumeProgress = document.getElementById('volumeProgress');
        if (volumeProgress) {
            volumeProgress.style.width = `${this.volume * 100}%`;
        }
    }

    updatePlaylist() {
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.remove('active');
            if (index === this.currentSong) {
                item.classList.add('active');
            }
        });
    }

    updateStats() {
        const totalPlays = document.getElementById('totalPlays');
        const totalTime = document.getElementById('totalTime');
        const favoriteSong = document.getElementById('favoriteSong');
        
        if (totalPlays) {
            totalPlays.textContent = this.totalPlays;
        }
        if (totalTime) {
            totalTime.textContent = this.formatTime(this.totalTime);
        }
        if (favoriteSong) {
            const mostPlayed = this.songs.reduce((prev, current) => 
                (prev.plays > current.plays) ? prev : current
            );
            favoriteSong.textContent = mostPlayed.plays > 0 ? mostPlayed.title : '-';
        }
        
        this.saveStats();
    }

    updateQuote() {
        const worshipQuote = document.getElementById('worshipQuote');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (worshipQuote && quoteAuthor) {
            const quote = this.worshipQuotes[this.currentQuoteIndex];
            worshipQuote.textContent = quote.text;
            quoteAuthor.textContent = `- ${quote.author}`;
        }
    }

    nextQuote() {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.worshipQuotes.length;
        this.updateQuote();
    }

    startProgressSimulation() {
        setInterval(() => {
            if (this.isPlaying && this.currentTime < this.duration) {
                this.currentTime += 1;
                this.totalTime += 1;
                this.updateProgress();
                
                // Auto next song when finished
                if (this.currentTime >= this.duration) {
                    if (this.playMode === 'repeat') {
                        this.currentTime = 0;
                    } else {
                        this.nextSong();
                    }
                }
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    loadStats() {
        this.totalPlays = parseInt(localStorage.getItem('divineMusicTotalPlays')) || 0;
        this.totalTime = parseInt(localStorage.getItem('divineMusicTotalTime')) || 0;
        this.currentQuoteIndex = parseInt(localStorage.getItem('divineMusicQuoteIndex')) || 0;
        
        // Load individual song plays
        const savedPlays = localStorage.getItem('divineMusicSongPlays');
        if (savedPlays) {
            const plays = JSON.parse(savedPlays);
            this.songs.forEach((song, index) => {
                song.plays = plays[index] || 0;
            });
        }
    }

    saveStats() {
        localStorage.setItem('divineMusicTotalPlays', this.totalPlays);
        localStorage.setItem('divineMusicTotalTime', this.totalTime);
        localStorage.setItem('divineMusicQuoteIndex', this.currentQuoteIndex);
        
        // Save individual song plays
        const plays = this.songs.map(song => song.plays);
        localStorage.setItem('divineMusicSongPlays', JSON.stringify(plays));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.divineMusic = new DivineMusicPlayer();
});

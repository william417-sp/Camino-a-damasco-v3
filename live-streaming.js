// Live Streaming Integration for Iglesia Camino a Damasco
// Version 1.0.0

class LiveStreamingManager {
    constructor() {
        this.isLive = false;
        this.nextServiceTime = null;
        this.countdownInterval = null;
        this.streamingPlatform = 'facebook'; // facebook, youtube, twitch, custom
        this.streamUrl = null;
        this.embedUrl = null;
        
        this.init();
    }

    init() {
        this.setupNextServiceTime();
        this.startCountdown();
        this.checkLiveStatus();
        this.setupEventListeners();
    }

    setupNextServiceTime() {
        // Calculate next Sunday service (10:00 AM)
        const now = new Date();
        const nextSunday = new Date(now);
        
        // Find next Sunday
        const daysUntilSunday = (7 - now.getDay()) % 7;
        nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
        nextSunday.setHours(10, 0, 0, 0);
        
        // If it's Sunday and before 10 AM, use today
        if (now.getDay() === 0 && now.getHours() < 10) {
            nextSunday.setDate(now.getDate());
        }
        
        this.nextServiceTime = nextSunday;
    }

    startCountdown() {
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
        
        this.updateCountdown();
    }

    updateCountdown() {
        const now = new Date();
        const timeDiff = this.nextServiceTime - now;
        
        if (timeDiff <= 0) {
            this.handleServiceTime();
            return;
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        this.updateCountdownDisplay(days, hours, minutes, seconds);
    }

    updateCountdownDisplay(days, hours, minutes, seconds) {
        const countdownElement = document.querySelector('.countdown-timer');
        if (!countdownElement) return;
        
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <div class="countdown-number">${days}</div>
                <div class="countdown-label">Días</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-number">${hours}</div>
                <div class="countdown-label">Horas</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-number">${minutes}</div>
                <div class="countdown-label">Minutos</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-number">${seconds}</div>
                <div class="countdown-label">Segundos</div>
            </div>
        `;
    }

    handleServiceTime() {
        // Service time reached - check if live
        this.checkLiveStatus();
        
        // Update next service time (next Sunday)
        this.setupNextServiceTime();
    }

    async checkLiveStatus() {
        try {
            // This would typically check your streaming platform's API
            // For demo purposes, we'll simulate checking
            const isLive = await this.simulateLiveCheck();
            
            if (isLive !== this.isLive) {
                this.isLive = isLive;
                this.updateLiveStatus();
            }
        } catch (error) {
            console.error('Error checking live status:', error);
        }
    }

    async simulateLiveCheck() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo: randomly determine if live (you'd replace this with real API call)
        const now = new Date();
        const isSunday = now.getDay() === 0;
        const isServiceTime = now.getHours() >= 10 && now.getHours() < 12;
        
        return isSunday && isServiceTime && Math.random() > 0.3; // 70% chance of being live
    }

    updateLiveStatus() {
        const statusElement = document.querySelector('.streaming-status');
        const previewElement = document.querySelector('.streaming-preview');
        const actionsElement = document.querySelector('.streaming-actions');
        
        if (this.isLive) {
            this.showLiveContent(statusElement, previewElement, actionsElement);
        } else {
            this.showOfflineContent(statusElement, previewElement, actionsElement);
        }
    }

    showLiveContent(statusElement, previewElement, actionsElement) {
        if (statusElement) {
            statusElement.innerHTML = `
                <i class="fas fa-circle text-danger"></i>
                <span>EN VIVO AHORA</span>
            `;
        }
        
        if (previewElement) {
            previewElement.innerHTML = `
                <div class="streaming-placeholder">
                    <i class="fas fa-video"></i>
                    <h4>Servicio en Vivo</h4>
                    <p>Únete a nuestro servicio dominical</p>
                    <button class="btn btn-primary btn-lg" onclick="liveStreamingManager.joinLiveStream()">
                        <i class="fas fa-play"></i> Ver en Vivo
                    </button>
                </div>
            `;
        }
        
        if (actionsElement) {
            actionsElement.innerHTML = `
                <a href="#" class="btn btn-primary" onclick="liveStreamingManager.joinLiveStream()">
                    <i class="fas fa-play"></i> Ver en Vivo
                </a>
                <a href="#" class="btn btn-outline-primary" onclick="liveStreamingManager.shareStream()">
                    <i class="fas fa-share"></i> Compartir
                </a>
            `;
        }
    }

    showOfflineContent(statusElement, previewElement, actionsElement) {
        if (statusElement) {
            statusElement.innerHTML = `
                <i class="fas fa-clock text-primary"></i>
                <span>Próximo servicio en vivo</span>
            `;
        }
        
        if (previewElement) {
            previewElement.innerHTML = `
                <div class="streaming-placeholder">
                    <i class="fas fa-calendar-alt"></i>
                    <h4>Próximo Servicio</h4>
                    <p>Domingo 10:00 AM - 12:00 PM</p>
                    <button class="btn btn-outline-primary" onclick="liveStreamingManager.setReminder()">
                        <i class="fas fa-bell"></i> Recordarme
                    </button>
                </div>
            `;
        }
        
        if (actionsElement) {
            actionsElement.innerHTML = `
                <a href="#" class="btn btn-outline-primary" onclick="liveStreamingManager.setReminder()">
                    <i class="fas fa-bell"></i> Notificarme
                </a>
                <a href="#" class="btn btn-outline-primary" onclick="liveStreamingManager.viewPreviousStreams()">
                    <i class="fas fa-history"></i> Ver Anteriores
                </a>
            `;
        }
    }

    joinLiveStream() {
        // Open live stream in new window/tab
        const streamUrl = this.getStreamUrl();
        if (streamUrl) {
            window.open(streamUrl, '_blank');
        } else {
            alert('El enlace de transmisión no está disponible. Por favor, inténtalo más tarde.');
        }
    }

    getStreamUrl() {
        // Return the appropriate stream URL based on platform
        switch (this.streamingPlatform) {
            case 'facebook':
                return 'https://www.facebook.com/iglesiacaminoadamasco/live';
            case 'youtube':
                return 'https://www.youtube.com/c/iglesiacaminoadamasco/live';
            case 'twitch':
                return 'https://www.twitch.tv/iglesiacaminoadamasco';
            default:
                return null;
        }
    }

    shareStream() {
        if (navigator.share) {
            navigator.share({
                title: 'Servicio en Vivo - Iglesia Camino a Damasco',
                text: 'Únete a nuestro servicio dominical en vivo',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Enlace copiado al portapapeles');
            });
        }
    }

    setReminder() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    // Schedule notification for next service
                    const notification = new Notification('Recordatorio de Servicio', {
                        body: 'El servicio de la Iglesia Camino a Damasco comenzará en 30 minutos',
                        icon: '/Images/icon-192x192.png',
                        tag: 'service-reminder'
                    });
                    
                    setTimeout(() => notification.close(), 5000);
                }
            });
        } else {
            alert('Las notificaciones no están disponibles en este navegador.');
        }
    }

    viewPreviousStreams() {
        // Scroll to previous streams section
        const previousStreams = document.querySelector('.previous-streams');
        if (previousStreams) {
            previousStreams.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupEventListeners() {
        // Listen for visibility change to pause/resume countdown
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseCountdown();
            } else {
                this.resumeCountdown();
            }
        });
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.checkLiveStatus();
        });
        
        window.addEventListener('offline', () => {
            console.log('Connection lost - live status check paused');
        });
    }

    pauseCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    resumeCountdown() {
        this.startCountdown();
    }

    // Public methods for external use
    refreshStatus() {
        this.checkLiveStatus();
    }

    getStatus() {
        return {
            isLive: this.isLive,
            nextServiceTime: this.nextServiceTime,
            streamingPlatform: this.streamingPlatform
        };
    }
}

// Initialize live streaming manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.liveStreamingManager = new LiveStreamingManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiveStreamingManager;
}

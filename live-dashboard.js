class LiveDashboard {
    constructor() {
        this.isLive = true;
        this.onlineMembers = 127;
        this.totalMembers = 1247;
        this.newToday = 23;
        this.streamViewers = 1247;
        this.streamDuration = 0; // in seconds
        this.activities = [];
        this.prayerRequests = [];
        this.communityStats = {
            pageViews: 12547,
            interactions: 3421,
            downloads: 847,
            shares: 1234
        };
        
        this.init();
    }

    init() {
        this.startStreamTimer();
        this.simulateLiveActivity();
        this.updateDisplay();
        this.startRealTimeUpdates();
    }

    startStreamTimer() {
        setInterval(() => {
            this.streamDuration++;
            this.updateStreamDuration();
        }, 1000);
    }

    updateStreamDuration() {
        const hours = Math.floor(this.streamDuration / 3600);
        const minutes = Math.floor((this.streamDuration % 3600) / 60);
        const seconds = this.streamDuration % 60;
        
        const durationEl = document.getElementById('streamDuration');
        if (durationEl) {
            durationEl.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    simulateLiveActivity() {
        // Simulate member count changes
        setInterval(() => {
            const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
            this.onlineMembers = Math.max(50, this.onlineMembers + change);
            this.updateOnlineCount();
        }, 30000); // Every 30 seconds

        // Simulate new activities
        setInterval(() => {
            this.addNewActivity();
        }, 45000); // Every 45 seconds

        // Simulate prayer requests
        setInterval(() => {
            this.addNewPrayerRequest();
        }, 120000); // Every 2 minutes

        // Simulate community stats updates
        setInterval(() => {
            this.updateCommunityStats();
        }, 60000); // Every minute
    }

    addNewActivity() {
        const activities = [
            { type: 'prayer', name: 'María', action: 'compartió una petición de oración', icon: 'fas fa-pray' },
            { type: 'music', name: 'Carlos', action: 'está escuchando "Alabaré a mi Señor"', icon: 'fas fa-music' },
            { type: 'bible', name: 'Ana', action: 'leyó el versículo del día', icon: 'fas fa-book' },
            { type: 'share', name: 'Luis', action: 'compartió un testimonio', icon: 'fas fa-share' },
            { type: 'donation', name: 'Pedro', action: 'realizó una donación', icon: 'fas fa-heart' },
            { type: 'event', name: 'Sofía', action: 'se registró para el próximo evento', icon: 'fas fa-calendar' }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const activity = {
            ...randomActivity,
            time: new Date(),
            id: Date.now()
        };

        this.activities.unshift(activity);
        if (this.activities.length > 10) {
            this.activities.pop();
        }

        this.updateActivitiesFeed();
    }

    addNewPrayerRequest() {
        const prayerTypes = [
            { text: 'Oración por la familia de Juan - situación médica urgente', urgent: true },
            { text: 'Bendición para el nuevo trabajo de María', urgent: false },
            { text: 'Sanidad para la hermana Carmen', urgent: false },
            { text: 'Provisión para la familia Rodríguez', urgent: false },
            { text: 'Oración por los jóvenes de la iglesia', urgent: false }
        ];

        const randomPrayer = prayerTypes[Math.floor(Math.random() * prayerTypes.length)];
        const prayer = {
            ...randomPrayer,
            time: new Date(),
            id: Date.now()
        };

        this.prayerRequests.unshift(prayer);
        if (this.prayerRequests.length > 5) {
            this.prayerRequests.pop();
        }

        this.updatePrayerRequests();
    }

    updateCommunityStats() {
        // Simulate small increases in stats
        this.communityStats.pageViews += Math.floor(Math.random() * 50) + 10;
        this.communityStats.interactions += Math.floor(Math.random() * 20) + 5;
        this.communityStats.downloads += Math.floor(Math.random() * 10) + 2;
        this.communityStats.shares += Math.floor(Math.random() * 15) + 3;

        this.updateCommunityStatsDisplay();
    }

    updateDisplay() {
        this.updateOnlineCount();
        this.updateActivitiesFeed();
        this.updatePrayerRequests();
        this.updateCommunityStatsDisplay();
        this.updateStreamInfo();
    }

    updateOnlineCount() {
        const onlineCountEl = document.getElementById('onlineCount');
        const totalOnlineEl = document.getElementById('totalOnline');
        const totalMembersEl = document.getElementById('totalMembers');
        const newTodayEl = document.getElementById('newToday');

        if (onlineCountEl) {
            onlineCountEl.textContent = `${this.onlineMembers} personas en línea`;
        }
        if (totalOnlineEl) {
            totalOnlineEl.textContent = this.onlineMembers;
        }
        if (totalMembersEl) {
            totalMembersEl.textContent = this.totalMembers.toLocaleString();
        }
        if (newTodayEl) {
            newTodayEl.textContent = this.newToday;
        }
    }

    updateActivitiesFeed() {
        const activitiesFeed = document.getElementById('activitiesFeed');
        if (!activitiesFeed) return;

        activitiesFeed.innerHTML = '';
        
        this.activities.slice(0, 4).forEach(activity => {
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-item';
            
            const timeAgo = this.getTimeAgo(activity.time);
            
            activityEl.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.name}</strong> ${activity.action}</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            `;
            
            activitiesFeed.appendChild(activityEl);
        });
    }

    updatePrayerRequests() {
        const recentPrayers = document.getElementById('recentPrayers');
        const prayerCountEl = document.getElementById('prayerCount');
        const urgentPrayersEl = document.getElementById('urgentPrayers');

        if (!recentPrayers) return;

        recentPrayers.innerHTML = '';
        
        const urgentCount = this.prayerRequests.filter(p => p.urgent).length;
        
        if (prayerCountEl) {
            prayerCountEl.textContent = `${this.prayerRequests.length} peticiones activas`;
        }
        if (urgentPrayersEl) {
            urgentPrayersEl.textContent = urgentCount;
        }
        
        this.prayerRequests.slice(0, 2).forEach(prayer => {
            const prayerEl = document.createElement('div');
            prayerEl.className = `prayer-item ${prayer.urgent ? 'urgent' : ''}`;
            
            const timeAgo = this.getTimeAgo(prayer.time);
            
            prayerEl.innerHTML = `
                <div class="prayer-icon">
                    <i class="fas fa-${prayer.urgent ? 'exclamation-triangle' : 'heart'}"></i>
                </div>
                <div class="prayer-content">
                    <p>${prayer.text}</p>
                    <span class="prayer-time">${timeAgo}</span>
                </div>
            `;
            
            recentPrayers.appendChild(prayerEl);
        });
    }

    updateCommunityStatsDisplay() {
        const pageViewsEl = document.getElementById('pageViews');
        const interactionsEl = document.getElementById('interactions');
        const downloadsEl = document.getElementById('downloads');
        const sharesEl = document.getElementById('shares');

        if (pageViewsEl) {
            pageViewsEl.textContent = this.communityStats.pageViews.toLocaleString();
        }
        if (interactionsEl) {
            interactionsEl.textContent = this.communityStats.interactions.toLocaleString();
        }
        if (downloadsEl) {
            downloadsEl.textContent = this.communityStats.downloads.toLocaleString();
        }
        if (sharesEl) {
            sharesEl.textContent = this.communityStats.shares.toLocaleString();
        }
    }

    updateStreamInfo() {
        const streamViewersEl = document.getElementById('streamViewers');
        const streamStatusEl = document.getElementById('streamStatus');
        const streamQualityEl = document.getElementById('streamQuality');

        if (streamViewersEl) {
            streamViewersEl.textContent = this.streamViewers.toLocaleString();
        }
        if (streamStatusEl) {
            streamStatusEl.textContent = this.isLive ? 'Transmitiendo en HD' : 'Fuera de línea';
        }
        if (streamQualityEl) {
            streamQualityEl.textContent = 'HD 1080p';
        }
    }

    startRealTimeUpdates() {
        // Update stream viewers count
        setInterval(() => {
            const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
            this.streamViewers = Math.max(100, this.streamViewers + change);
            this.updateStreamInfo();
        }, 15000); // Every 15 seconds
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Hace un momento';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `Hace ${days} día${days > 1 ? 's' : ''}`;
        }
    }

    joinStream() {
        this.showMessage('Redirigiendo al stream en vivo...', 'info');
        
        // Simulate joining stream
        setTimeout(() => {
            this.showMessage('¡Bienvenido al servicio en vivo!', 'success');
            // In a real application, this would redirect to the streaming platform
        }, 2000);
    }

    shareStream() {
        const shareText = `🎥 ¡Únete a nuestro servicio en vivo! ${this.streamViewers} personas ya están conectadas. #IglesiaCaminoADamasco #EnVivo`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Servicio en Vivo - Iglesia Camino a Damasco',
                text: shareText,
                url: window.location.href
            }).then(() => {
                this.showMessage('Stream compartido exitosamente', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('Enlace del stream copiado al portapapeles', 'success');
        }).catch(() => {
            this.showMessage('No se pudo compartir el stream', 'error');
        });
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `dashboard-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add message styles
        const style = document.createElement('style');
        style.textContent = `
            .dashboard-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
            }
            .dashboard-message.success {
                background: rgba(34, 197, 94, 0.9);
            }
            .dashboard-message.error {
                background: rgba(244, 67, 54, 0.9);
            }
            .dashboard-message.info {
                background: rgba(139, 92, 246, 0.9);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.liveDashboard = new LiveDashboard();
});

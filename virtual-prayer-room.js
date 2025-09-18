// Virtual Prayer Room Manager for Iglesia Camino a Damasco
// Version 1.0.0

class VirtualPrayerRoom {
    constructor() {
        this.isActive = false;
        this.currentMood = 'peace';
        this.activePrayers = 0;
        this.particles = [];
        this.meditationTimer = null;
        this.worshipMusic = null;
        
        this.moods = {
            peace: {
                name: 'Paz',
                color: '#4CAF50',
                verses: [
                    { text: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.", reference: "Filipenses 4:7" },
                    { text: "Deja que la paz de Cristo gobierne en vuestros corazones.", reference: "Colosenses 3:15" }
                ]
            },
            healing: {
                name: 'Sanidad',
                color: '#FF5722',
                verses: [
                    { text: "Él mismo tomó nuestras enfermedades y cargó con nuestros dolores.", reference: "Mateo 8:17" },
                    { text: "Por sus llagas fuimos sanados.", reference: "Isaías 53:5" }
                ]
            },
            gratitude: {
                name: 'Gratitud',
                color: '#FFC107',
                verses: [
                    { text: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.", reference: "1 Tesalonicenses 5:18" },
                    { text: "Alabad a Jehová, porque él es bueno.", reference: "Salmos 107:1" }
                ]
            },
            strength: {
                name: 'Fortaleza',
                color: '#9C27B0',
                verses: [
                    { text: "Todo lo puedo en Cristo que me fortalece.", reference: "Filipenses 4:13" },
                    { text: "Jehová es mi fortaleza y mi escudo.", reference: "Salmos 28:7" }
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.loadCommunityPrayers();
        this.loadPeaceVerses();
        this.createParticles();
        this.setupEventListeners();
        this.startParticleAnimation();
        this.updateActivePrayerCount();
    }

    loadCommunityPrayers() {
        const container = document.getElementById('communityPrayers');
        if (!container) return;

        const prayers = [
            "Señor, bendice a nuestra comunidad con tu amor y gracia.",
            "Oramos por las familias que están pasando por momentos difíciles.",
            "Que tu paz llene los corazones de todos los que están aquí.",
            "Señor, guíanos en tu camino y danos sabiduría.",
            "Oramos por sanidad y restauración en nuestras vidas."
        ];

        container.innerHTML = '';
        prayers.forEach(prayer => {
            const prayerElement = document.createElement('div');
            prayerElement.className = 'community-prayer';
            prayerElement.textContent = prayer;
            container.appendChild(prayerElement);
        });
    }

    loadPeaceVerses() {
        const container = document.getElementById('peaceVerses');
        if (!container) return;

        const currentMoodData = this.moods[this.currentMood];
        container.innerHTML = '';

        currentMoodData.verses.forEach(verse => {
            const verseElement = document.createElement('div');
            verseElement.className = 'peace-verse';
            verseElement.innerHTML = `
                <div class="peace-verse-text">"${verse.text}"</div>
                <div class="peace-verse-reference">${verse.reference}</div>
            `;
            container.appendChild(verseElement);
        });
    }

    createParticles() {
        const container = document.getElementById('prayerParticles');
        if (!container) return;

        // Clear existing particles
        container.innerHTML = '';
        this.particles = [];

        // Create 20 particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'prayer-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    startParticleAnimation() {
        // Particles are animated via CSS, this method can be used for additional effects
        setInterval(() => {
            if (this.isActive) {
                this.createParticles();
            }
        }, 10000); // Refresh particles every 10 seconds
    }

    joinPrayer() {
        this.isActive = !this.isActive;
        this.activePrayers = this.isActive ? this.activePrayers + 1 : Math.max(0, this.activePrayers - 1);
        
        this.updateActivePrayerCount();
        this.updatePrayerBackground();
        
        if (this.isActive) {
            this.showMessage('Te has unido a la oración comunitaria. Que Dios te bendiga.', 'success');
            this.startBreathingGuide();
        } else {
            this.showMessage('Has salido de la sesión de oración.', 'info');
            this.stopBreathingGuide();
        }
    }

    startMeditation() {
        if (this.meditationTimer) {
            this.stopMeditation();
            return;
        }

        this.showMessage('Iniciando meditación guiada...', 'info');
        this.startBreathingGuide();
        
        // Simulate meditation timer (in real implementation, this would be actual meditation)
        let timeLeft = 300; // 5 minutes
        this.meditationTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                this.stopMeditation();
                this.showMessage('Meditación completada. Que la paz de Dios esté contigo.', 'success');
            }
        }, 1000);
    }

    stopMeditation() {
        if (this.meditationTimer) {
            clearInterval(this.meditationTimer);
            this.meditationTimer = null;
        }
        this.stopBreathingGuide();
    }

    startBreathingGuide() {
        const title = document.querySelector('.prayer-title');
        const subtitle = document.querySelector('.prayer-subtitle');
        
        if (!title || !subtitle) return;

        const breathingPhases = [
            { title: 'Inhala', subtitle: 'Respira profundamente...' },
            { title: 'Mantén', subtitle: 'Siente la presencia de Dios...' },
            { title: 'Exhala', subtitle: 'Deja que Su paz llene tu ser...' },
            { title: 'Descansa', subtitle: 'Permanece en Su amor...' }
        ];

        let phaseIndex = 0;
        this.breathingInterval = setInterval(() => {
            const phase = breathingPhases[phaseIndex];
            title.textContent = phase.title;
            subtitle.textContent = phase.subtitle;
            phaseIndex = (phaseIndex + 1) % breathingPhases.length;
        }, 4000); // 4 seconds per phase
    }

    stopBreathingGuide() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        const title = document.querySelector('.prayer-title');
        const subtitle = document.querySelector('.prayer-subtitle');
        
        if (title && subtitle) {
            title.textContent = 'Centra tu corazón en Dios';
            subtitle.textContent = 'Respira profundamente y permite que Su paz llene tu ser';
        }
    }

    playWorshipMusic() {
        if (this.worshipMusic) {
            this.stopWorshipMusic();
            return;
        }

        this.showMessage('Reproduciendo música de adoración...', 'info');
        
        // In a real implementation, this would play actual worship music
        // For now, we'll simulate it with a visual indicator
        this.worshipMusic = {
            playing: true,
            startTime: Date.now()
        };
        
        this.updateWorshipMusicButton();
    }

    stopWorshipMusic() {
        if (this.worshipMusic) {
            this.worshipMusic = null;
            this.showMessage('Música de adoración detenida.', 'info');
            this.updateWorshipMusicButton();
        }
    }

    updateWorshipMusicButton() {
        const button = document.querySelector('[onclick*="playWorshipMusic"]');
        if (button) {
            const icon = button.querySelector('i');
            const text = button.textContent.trim();
            
            if (this.worshipMusic) {
                icon.className = 'fas fa-stop';
                button.innerHTML = '<i class="fas fa-stop"></i> Detener Música';
            } else {
                icon.className = 'fas fa-music';
                button.innerHTML = '<i class="fas fa-music"></i> Música de Adoración';
            }
        }
    }

    setMood(mood) {
        if (!this.moods[mood]) return;

        this.currentMood = mood;
        this.updateMoodButtons();
        this.updatePrayerBackground();
        this.loadPeaceVerses();
        
        this.showMessage(`Ambiente cambiado a: ${this.moods[mood].name}`, 'info');
    }

    updateMoodButtons() {
        const buttons = document.querySelectorAll('.mood-btn');
        buttons.forEach(button => {
            const mood = button.getAttribute('data-mood');
            if (mood === this.currentMood) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    updatePrayerBackground() {
        const background = document.getElementById('prayerBackground');
        if (!background) return;

        // Remove existing mood classes
        Object.keys(this.moods).forEach(mood => {
            background.classList.remove(mood);
        });

        // Add current mood class
        background.classList.add(this.currentMood);
    }

    updateActivePrayerCount() {
        const countElement = document.getElementById('activePrayerCount');
        if (countElement) {
            // Simulate realistic prayer count
            const baseCount = this.activePrayers;
            const randomVariation = Math.floor(Math.random() * 5);
            const displayCount = baseCount + randomVariation;
            
            this.animateNumber(countElement, displayCount);
        }
    }

    animateNumber(element, targetNumber) {
        const startNumber = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentNumber = Math.round(startNumber + (targetNumber - startNumber) * progress);
            element.textContent = currentNumber;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.prayer-room-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `prayer-room-message alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.minWidth = '300px';
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'p':
                        e.preventDefault();
                        this.joinPrayer();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.startMeditation();
                        break;
                    case 'w':
                        e.preventDefault();
                        this.playWorshipMusic();
                        break;
                }
            }
        });

        // Auto-update prayer count
        setInterval(() => {
            this.updateActivePrayerCount();
        }, 30000); // Update every 30 seconds
    }

    // Public methods for external use
    getCurrentMood() {
        return this.moods[this.currentMood];
    }

    getAllMoods() {
        return this.moods;
    }

    getStats() {
        return {
            isActive: this.isActive,
            currentMood: this.currentMood,
            activePrayers: this.activePrayers,
            isMeditating: !!this.meditationTimer,
            isPlayingMusic: !!this.worshipMusic
        };
    }

    // Cleanup method
    cleanup() {
        this.stopMeditation();
        this.stopWorshipMusic();
        this.stopBreathingGuide();
    }
}

// Initialize virtual prayer room when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.virtualPrayerRoom = new VirtualPrayerRoom();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtualPrayerRoom;
}

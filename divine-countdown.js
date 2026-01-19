class DivineCountdown {
    constructor() {
        this.events = [
            {
                id: 1,
                title: 'Conferencia de Avivamiento',
                date: new Date('2024-03-15T19:00:00'),
                description: 'Una experiencia transformadora de fe y poder',
                location: 'Iglesia Camino a Damasco',
                registrations: 0,
                shares: 0
            },
            {
                id: 2,
                title: 'Estudio Bíblico Especial',
                date: new Date('2024-03-22T18:30:00'),
                description: 'Profundiza en la Palabra de Dios',
                location: 'Salón de Estudios',
                registrations: 0,
                shares: 0
            },
            {
                id: 3,
                title: 'Retiro de Mujeres',
                date: new Date('2024-04-05T09:00:00'),
                description: 'Un tiempo de renovación y hermandad',
                location: 'Centro de Retiros',
                registrations: 0,
                shares: 0
            }
        ];
        
        this.countdownIntervals = [];
        this.totalRegistrations = 0;
        this.totalShares = 0;
        this.init();
    }

    init() {
        this.loadStats();
        this.startCountdowns();
        this.updateStats();
    }

    startCountdowns() {
        this.events.forEach((event, index) => {
            const countdownId = index + 1;
            this.updateCountdown(countdownId, event.date);
            
            const interval = setInterval(() => {
                this.updateCountdown(countdownId, event.date);
            }, 1000);
            
            this.countdownIntervals.push(interval);
        });
    }

    updateCountdown(countdownId, targetDate) {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            // Event has passed
            this.showEventExpired(countdownId);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM elements
        const daysEl = document.getElementById(`days${countdownId}`);
        const hoursEl = document.getElementById(`hours${countdownId}`);
        const minutesEl = document.getElementById(`minutes${countdownId}`);
        const secondsEl = document.getElementById(`seconds${countdownId}`);

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

        // Add pulse animation for seconds
        if (secondsEl) {
            secondsEl.style.animation = 'none';
            setTimeout(() => {
                secondsEl.style.animation = 'countdownPulse 1s ease-in-out';
            }, 10);
        }

        // Check if event is starting soon (less than 1 hour)
        if (distance < 3600000 && distance > 0) {
            this.showEventStartingSoon(countdownId);
        }
    }

    showEventExpired(countdownId) {
        const countdownEl = document.getElementById(`countdown${countdownId}`);
        const statusBadge = document.querySelector(`#countdown${countdownId}`).closest('.countdown-card').querySelector('.status-badge');
        
        if (countdownEl) {
            countdownEl.innerHTML = `
                <div class="event-expired">
                    <i class="fas fa-check-circle"></i>
                    <h4>Evento Completado</h4>
                    <p>Este evento ya ha terminado</p>
                </div>
            `;
        }
        
        if (statusBadge) {
            statusBadge.textContent = 'Completado';
            statusBadge.className = 'status-badge completed';
        }
    }

    showEventStartingSoon(countdownId) {
        const countdownCard = document.querySelector(`#countdown${countdownId}`).closest('.countdown-card');
        const statusBadge = countdownCard.querySelector('.status-badge');
        
        if (statusBadge) {
            statusBadge.textContent = '¡Pronto!';
            statusBadge.className = 'status-badge live';
        }
        
        // Add urgent animation
        countdownCard.style.animation = 'urgentPulse 2s infinite ease-in-out';
    }

    registerEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Show registration modal
        this.showRegistrationModal(event);
    }

    showRegistrationModal(event) {
        const modal = document.createElement('div');
        modal.className = 'countdown-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Registrarse para ${event.title}</h4>
                    <button class="close-btn" onclick="this.closest('.countdown-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="event-preview">
                        <h5>${event.title}</h5>
                        <p>${event.description}</p>
                        <div class="event-details">
                            <div class="detail-item">
                                <i class="fas fa-calendar"></i>
                                <span>${event.date.toLocaleDateString('es-ES', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${event.date.toLocaleTimeString('es-ES', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                        </div>
                    </div>
                    <form class="registration-form">
                        <div class="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" placeholder="Tu nombre completo" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="tu@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Teléfono</label>
                            <input type="tel" placeholder="Tu número de teléfono">
                        </div>
                        <div class="form-group">
                            <label>Comentarios (opcional)</label>
                            <textarea placeholder="¿Hay algo que quieras que sepamos?"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-user-plus"></i> Confirmar Registro
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .countdown-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                color: white;
                animation: slideIn 0.3s ease;
                max-height: 90vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .modal-header h4 {
                margin: 0;
                color: white;
            }
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .event-preview {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }
            .event-preview h5 {
                color: white;
                margin-bottom: 0.5rem;
            }
            .event-preview p {
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 1rem;
            }
            .registration-form .form-group {
                margin-bottom: 1.5rem;
            }
            .registration-form label {
                display: block;
                color: white;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            .registration-form input,
            .registration-form textarea {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                padding: 0.75rem;
                color: white;
            }
            .registration-form input::placeholder,
            .registration-form textarea::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
            .registration-form input:focus,
            .registration-form textarea:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
            }
            .event-expired {
                text-align: center;
                padding: 2rem;
                color: white;
            }
            .event-expired i {
                font-size: 3rem;
                color: #22C55E;
                margin-bottom: 1rem;
            }
            .event-expired h4 {
                margin-bottom: 0.5rem;
            }
            @keyframes urgentPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
                }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('.registration-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processRegistration(event.id);
            modal.remove();
        });
    }

    processRegistration(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.registrations++;
            this.totalRegistrations++;
            this.updateStats();
            this.showMessage('¡Registro exitoso! Te esperamos en el evento.', 'success');
        }
    }

    shareEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const shareText = `¡No te pierdas ${event.title}! ${event.description} - ${event.date.toLocaleDateString('es-ES')} a las ${event.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} en ${event.location}`;
        
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: shareText,
                url: window.location.href
            }).then(() => {
                event.shares++;
                this.totalShares++;
                this.updateStats();
                this.showMessage('Evento compartido exitosamente', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('Enlace del evento copiado al portapapeles', 'success');
        }).catch(() => {
            this.showMessage('No se pudo compartir el evento', 'error');
        });
    }

    updateStats() {
        const totalEventsEl = document.getElementById('totalEvents');
        const totalRegistrationsEl = document.getElementById('totalRegistrations');
        const totalSharesEl = document.getElementById('totalShares');

        if (totalEventsEl) {
            totalEventsEl.textContent = this.events.length;
        }
        if (totalRegistrationsEl) {
            totalRegistrationsEl.textContent = this.totalRegistrations;
        }
        if (totalSharesEl) {
            totalSharesEl.textContent = this.totalShares;
        }

        this.saveStats();
    }

    loadStats() {
        this.totalRegistrations = parseInt(localStorage.getItem('divineCountdownRegistrations')) || 0;
        this.totalShares = parseInt(localStorage.getItem('divineCountdownShares')) || 0;
        
        // Load individual event stats
        const savedEvents = localStorage.getItem('divineCountdownEvents');
        if (savedEvents) {
            const eventsData = JSON.parse(savedEvents);
            this.events.forEach(event => {
                const savedEvent = eventsData.find(e => e.id === event.id);
                if (savedEvent) {
                    event.registrations = savedEvent.registrations || 0;
                    event.shares = savedEvent.shares || 0;
                }
            });
        }
    }

    saveStats() {
        localStorage.setItem('divineCountdownRegistrations', this.totalRegistrations);
        localStorage.setItem('divineCountdownShares', this.totalShares);
        localStorage.setItem('divineCountdownEvents', JSON.stringify(this.events));
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `countdown-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add message styles
        const style = document.createElement('style');
        style.textContent = `
            .countdown-message {
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
            .countdown-message.success {
                background: rgba(34, 197, 94, 0.9);
            }
            .countdown-message.error {
                background: rgba(244, 67, 54, 0.9);
            }
            .countdown-message.info {
                background: rgba(59, 130, 246, 0.9);
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

    // Cleanup method
    destroy() {
        this.countdownIntervals.forEach(interval => {
            clearInterval(interval);
        });
        this.countdownIntervals = [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.divineCountdown = new DivineCountdown();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.divineCountdown) {
        window.divineCountdown.destroy();
    }
});

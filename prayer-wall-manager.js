// Prayer Wall Manager for Iglesia Camino a Damasco
// Version 1.0.0

class PrayerWallManager {
    constructor() {
        this.prayerRequests = [];
        this.currentUser = null;
        this.isPraying = false;
        
        this.init();
    }

    init() {
        this.loadSamplePrayerRequests();
        this.updatePrayerStats();
        this.renderPrayerRequests();
        this.setupEventListeners();
    }

    loadSamplePrayerRequests() {
        // Sample prayer requests - in a real implementation, these would come from a database
        this.prayerRequests = [
            {
                id: 1,
                name: "María González",
                text: "Por favor oren por mi familia durante este tiempo difícil. Necesitamos sabiduría y paz.",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                urgent: false,
                answered: false,
                prayerCount: 12
            },
            {
                id: 2,
                name: "Carlos Rodríguez",
                text: "Oren por mi salud. Tengo una cirugía programada para la próxima semana.",
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                urgent: true,
                answered: false,
                prayerCount: 8
            },
            {
                id: 3,
                name: "Ana Martínez",
                text: "Gracias a Dios por responder nuestras oraciones. Mi hijo encontró trabajo.",
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                urgent: false,
                answered: true,
                prayerCount: 15
            },
            {
                id: 4,
                name: "José Pérez",
                text: "Oren por mi matrimonio. Estamos pasando por momentos difíciles.",
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                urgent: false,
                answered: false,
                prayerCount: 20
            },
            {
                id: 5,
                name: "Laura Sánchez",
                text: "Por favor oren por mi madre que está enferma. Necesitamos un milagro.",
                date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                urgent: true,
                answered: false,
                prayerCount: 25
            }
        ];
    }

    renderPrayerRequests() {
        const container = document.getElementById('prayerRequests');
        if (!container) return;

        // Sort requests by date (newest first)
        const sortedRequests = [...this.prayerRequests].sort((a, b) => b.date - a.date);

        container.innerHTML = '';

        if (sortedRequests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-hands-praying fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No hay peticiones de oración aún. ¡Sé el primero en agregar una!</p>
                </div>
            `;
            return;
        }

        sortedRequests.forEach(request => {
            const requestElement = this.createPrayerRequestElement(request);
            container.appendChild(requestElement);
        });
    }

    createPrayerRequestElement(request) {
        const div = document.createElement('div');
        div.className = `prayer-request ${request.urgent ? 'urgent' : ''} ${request.answered ? 'answered' : ''}`;
        
        const formattedDate = request.date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        div.innerHTML = `
            <div class="prayer-request-header">
                <h5 class="prayer-request-name">${request.name}</h5>
                <span class="prayer-request-date">${formattedDate}</span>
            </div>
            <p class="prayer-request-text">${request.text}</p>
            <div class="prayer-request-actions">
                <button class="btn btn-outline-primary btn-sm" onclick="prayerWallManager.prayForRequest(${request.id})">
                    <i class="fas fa-hands-praying"></i> Orar (${request.prayerCount})
                </button>
                ${!request.answered ? `
                    <button class="btn btn-outline-success btn-sm" onclick="prayerWallManager.markAsAnswered(${request.id})">
                        <i class="fas fa-check"></i> Respondida
                    </button>
                ` : ''}
                <button class="btn btn-outline-secondary btn-sm" onclick="prayerWallManager.shareRequest(${request.id})">
                    <i class="fas fa-share"></i> Compartir
                </button>
            </div>
        `;

        return div;
    }

    updatePrayerStats() {
        const totalPrayers = this.prayerRequests.length;
        const answeredPrayers = this.prayerRequests.filter(r => r.answered).length;
        const prayingNow = this.isPraying ? 1 : 0;

        const totalElement = document.getElementById('totalPrayers');
        const answeredElement = document.getElementById('answeredPrayers');
        const prayingElement = document.getElementById('prayingNow');

        if (totalElement) {
            this.animateNumber(totalElement, totalPrayers);
        }
        if (answeredElement) {
            this.animateNumber(answeredElement, answeredPrayers);
        }
        if (prayingElement) {
            this.animateNumber(prayingElement, prayingNow);
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

    showAddPrayerForm() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('prayerFormModal');
        if (!modal) {
            modal = this.createPrayerFormModal();
            document.body.appendChild(modal);
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    createPrayerFormModal() {
        const modal = document.createElement('div');
        modal.id = 'prayerFormModal';
        modal.className = 'prayer-form-modal';
        
        modal.innerHTML = `
            <div class="prayer-form-content">
                <div class="prayer-form-header">
                    <h4>Agregar Petición de Oración</h4>
                    <button class="prayer-form-close" onclick="prayerWallManager.hideAddPrayerForm()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="addPrayerForm" onsubmit="prayerWallManager.addPrayerRequest(event)">
                    <div class="mb-3">
                        <label for="prayerName" class="form-label">Nombre (opcional)</label>
                        <input type="text" id="prayerName" name="name" class="form-control" placeholder="Tu nombre o 'Anónimo'">
                    </div>
                    <div class="mb-3">
                        <label for="prayerText" class="form-label">Petición de Oración *</label>
                        <textarea id="prayerText" name="text" class="form-control" rows="4" placeholder="Describe tu petición de oración..." required></textarea>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="urgentPrayer" name="urgent">
                            <label class="form-check-label" for="urgentPrayer">
                                Petición urgente
                            </label>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary flex-fill">
                            <i class="fas fa-plus"></i> Agregar Petición
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="prayerWallManager.hideAddPrayerForm()">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;

        return modal;
    }

    hideAddPrayerForm() {
        const modal = document.getElementById('prayerFormModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    addPrayerRequest(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const name = formData.get('name') || 'Anónimo';
        const text = formData.get('text');
        const urgent = formData.has('urgent');

        if (!text.trim()) {
            this.showMessage('Por favor, ingresa tu petición de oración.', 'error');
            return;
        }

        const newRequest = {
            id: Date.now(),
            name: name,
            text: text,
            date: new Date(),
            urgent: urgent,
            answered: false,
            prayerCount: 0
        };

        this.prayerRequests.unshift(newRequest);
        this.renderPrayerRequests();
        this.updatePrayerStats();
        this.hideAddPrayerForm();
        
        // Reset form
        event.target.reset();
        
        this.showMessage('Tu petición de oración ha sido agregada. ¡Que Dios te bendiga!', 'success');
    }

    prayForRequest(requestId) {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (request) {
            request.prayerCount++;
            this.renderPrayerRequests();
            this.showMessage(`¡Gracias por orar por ${request.name}!`, 'success');
        }
    }

    markAsAnswered(requestId) {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (request) {
            request.answered = true;
            this.renderPrayerRequests();
            this.updatePrayerStats();
            this.showMessage('¡Gracias por compartir que la oración fue respondida!', 'success');
        }
    }

    shareRequest(requestId) {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (!request) return;

        const shareText = `Petición de oración: "${request.text}" - ${request.name}\n\nÚnete a nosotros en oración desde Iglesia Camino a Damasco`;
        const shareUrl = window.location.href + '#prayer-wall';

        if (navigator.share) {
            navigator.share({
                title: 'Petición de Oración - Iglesia Camino a Damasco',
                text: shareText,
                url: shareUrl
            }).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(shareText) {
        navigator.clipboard.writeText(shareText).then(() => {
            this.showMessage('Petición copiada al portapapeles', 'success');
        }).catch(() => {
            alert(shareText);
        });
    }

    joinPrayer() {
        this.isPraying = !this.isPraying;
        this.updatePrayerStats();
        
        if (this.isPraying) {
            this.showMessage('¡Te has unido a la oración! Que Dios te bendiga.', 'success');
        } else {
            this.showMessage('Has salido de la sesión de oración.', 'info');
        }
    }

    sharePrayerWall() {
        const shareText = `Únete a nuestro Muro de Oración en Iglesia Camino a Damasco. Oremos juntos por nuestras necesidades y celebremos las respuestas de Dios.`;
        const shareUrl = window.location.href + '#prayer-wall';

        if (navigator.share) {
            navigator.share({
                title: 'Muro de Oración - Iglesia Camino a Damasco',
                text: shareText,
                url: shareUrl
            }).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.prayer-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `prayer-message alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
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
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('prayerFormModal');
            if (modal && e.target === modal) {
                this.hideAddPrayerForm();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddPrayerForm();
            }
        });
    }

    // Public methods for external use
    getPrayerRequests() {
        return this.prayerRequests;
    }

    addPrayerRequestData(requestData) {
        this.prayerRequests.unshift(requestData);
        this.renderPrayerRequests();
        this.updatePrayerStats();
    }

    getStats() {
        return {
            total: this.prayerRequests.length,
            answered: this.prayerRequests.filter(r => r.answered).length,
            urgent: this.prayerRequests.filter(r => r.urgent).length,
            prayingNow: this.isPraying ? 1 : 0
        };
    }
}

// Initialize prayer wall manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.prayerWallManager = new PrayerWallManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrayerWallManager;
}

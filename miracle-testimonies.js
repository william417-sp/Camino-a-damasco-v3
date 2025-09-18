class MiracleTestimonies {
    constructor() {
        this.currentFilter = 'all';
        this.testimonies = [
            {
                id: 1,
                name: 'María González',
                date: 'Hace 2 semanas',
                category: 'healing',
                title: 'Milagro de Sanación',
                content: 'Después de años luchando contra una enfermedad crónica, Dios me sanó completamente durante una oración de fe. Los médicos no podían explicar mi recuperación instantánea. ¡Gloria a Dios!',
                likes: 24,
                shares: 8,
                comments: 5
            },
            {
                id: 2,
                name: 'Carlos Rodríguez',
                date: 'Hace 1 mes',
                category: 'provision',
                title: 'Dios Provee en Tiempo de Necesidad',
                content: 'Perdí mi trabajo y no sabía cómo pagar las cuentas. Oré con fe y Dios abrió una puerta que nunca esperé. Ahora tengo un trabajo mejor que el anterior. ¡Dios es fiel!',
                likes: 18,
                shares: 12,
                comments: 7
            },
            {
                id: 3,
                name: 'Ana Martínez',
                date: 'Hace 3 semanas',
                category: 'protection',
                title: 'Protección Divina en Accidente',
                content: 'Tuve un accidente automovilístico terrible, pero salí sin un rasguño. Los paramédicos no podían creer que estuviera viva. Sé que los ángeles de Dios me protegieron.',
                likes: 31,
                shares: 15,
                comments: 9
            },
            {
                id: 4,
                name: 'Roberto Silva',
                date: 'Hace 2 meses',
                category: 'restoration',
                title: 'Restauración de Familia',
                content: 'Mi familia estaba rota por años de conflictos. Oré por restauración y Dios tocó los corazones de todos. Ahora somos más unidos que nunca. ¡Dios restaura lo que el enemigo robó!',
                likes: 22,
                shares: 6,
                comments: 11
            },
            {
                id: 5,
                name: 'Laura Fernández',
                date: 'Hace 1 semana',
                category: 'healing',
                title: 'Sanación Emocional',
                content: 'Luché con depresión por años. En una reunión de oración, sentí el amor de Dios como nunca antes. Desde ese día, la tristeza se fue y la alegría llenó mi corazón.',
                likes: 19,
                shares: 9,
                comments: 6
            },
            {
                id: 6,
                name: 'Miguel Torres',
                date: 'Hace 5 días',
                category: 'provision',
                title: 'Milagro Financiero',
                content: 'Necesitaba $5,000 para una emergencia médica. No tenía de dónde sacar el dinero. Oré y al día siguiente recibí una llamada ofreciéndome exactamente esa cantidad. ¡Dios es nuestro proveedor!',
                likes: 27,
                shares: 13,
                comments: 8
            }
        ];
        this.likedTestimonies = new Set();
        this.init();
    }

    init() {
        this.loadLikedTestimonies();
        this.updateFilterButtons();
    }

    filterTestimonies(category) {
        this.currentFilter = category;
        this.updateFilterButtons();
        this.updateTestimoniesDisplay();
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    updateTestimoniesDisplay() {
        const grid = document.getElementById('testimoniesGrid');
        if (!grid) return;

        const filteredTestimonies = this.currentFilter === 'all' 
            ? this.testimonies 
            : this.testimonies.filter(t => t.category === this.currentFilter);

        // Add animation to existing cards
        grid.querySelectorAll('.testimony-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });

        setTimeout(() => {
            grid.innerHTML = '';
            filteredTestimonies.forEach(testimony => {
                const card = this.createTestimonyCard(testimony);
                grid.appendChild(card);
            });
            
            // Animate new cards
            grid.querySelectorAll('.testimony-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 300);
    }

    createTestimonyCard(testimony) {
        const card = document.createElement('div');
        card.className = 'testimony-card';
        card.dataset.category = testimony.category;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease';

        const categoryNames = {
            healing: 'Sanación',
            provision: 'Provisión',
            protection: 'Protección',
            restoration: 'Restauración'
        };

        const isLiked = this.likedTestimonies.has(testimony.id);

        card.innerHTML = `
            <div class="testimony-header">
                <div class="testimony-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="testimony-info">
                    <h4>${testimony.name}</h4>
                    <span class="testimony-date">${testimony.date}</span>
                </div>
                <div class="testimony-category">
                    <span class="category-badge ${testimony.category}">${categoryNames[testimony.category]}</span>
                </div>
            </div>
            <div class="testimony-content">
                <h5>${testimony.title}</h5>
                <p>"${testimony.content}"</p>
            </div>
            <div class="testimony-stats">
                <div class="stat">
                    <i class="fas fa-heart"></i>
                    <span id="likes-${testimony.id}">${testimony.likes}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-share"></i>
                    <span>${testimony.shares}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-comment"></i>
                    <span>${testimony.comments}</span>
                </div>
            </div>
            <div class="testimony-actions">
                <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="miracleTestimonies.likeTestimony(${testimony.id})">
                    <i class="fas fa-heart"></i> Me Gusta
                </button>
                <button class="action-btn" onclick="miracleTestimonies.shareTestimony(${testimony.id})">
                    <i class="fas fa-share"></i> Compartir
                </button>
                <button class="action-btn" onclick="miracleTestimonies.commentTestimony(${testimony.id})">
                    <i class="fas fa-comment"></i> Comentar
                </button>
            </div>
        `;

        return card;
    }

    likeTestimony(id) {
        const testimony = this.testimonies.find(t => t.id === id);
        if (!testimony) return;

        const isLiked = this.likedTestimonies.has(id);
        const likeBtn = document.querySelector(`button[onclick="miracleTestimonies.likeTestimony(${id})"]`);
        const likesSpan = document.getElementById(`likes-${id}`);

        if (isLiked) {
            // Unlike
            this.likedTestimonies.delete(id);
            testimony.likes--;
            likeBtn.classList.remove('liked');
        } else {
            // Like
            this.likedTestimonies.add(id);
            testimony.likes++;
            likeBtn.classList.add('liked');
            
            // Add heart animation
            this.showHeartAnimation(likeBtn);
        }

        if (likesSpan) {
            likesSpan.textContent = testimony.likes;
        }

        this.saveLikedTestimonies();
        this.showMessage(isLiked ? 'Ya no te gusta este testimonio' : 'Te gusta este testimonio', 'success');
    }

    shareTestimony(id) {
        const testimony = this.testimonies.find(t => t.id === id);
        if (!testimony) return;

        const shareText = `Testimonio de ${testimony.name}: "${testimony.title}" - ${testimony.content.substring(0, 100)}...`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Testimonio de Milagro',
                text: shareText,
                url: window.location.href
            }).then(() => {
                testimony.shares++;
                this.showMessage('Testimonio compartido exitosamente', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('Testimonio copiado al portapapeles', 'success');
        }).catch(() => {
            this.showMessage('No se pudo compartir el testimonio', 'error');
        });
    }

    commentTestimony(id) {
        const testimony = this.testimonies.find(t => t.id === id);
        if (!testimony) return;

        this.showCommentModal(testimony);
    }

    showCommentModal(testimony) {
        const modal = document.createElement('div');
        modal.className = 'testimony-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Comentar en el testimonio de ${testimony.name}</h4>
                    <button class="close-btn" onclick="this.closest('.testimony-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="testimony-preview">
                        <h5>${testimony.title}</h5>
                        <p>"${testimony.content}"</p>
                    </div>
                    <div class="comment-form">
                        <textarea placeholder="Escribe tu comentario..." rows="4"></textarea>
                        <button class="btn btn-primary" onclick="miracleTestimonies.submitComment(${testimony.id}, this.previousElementSibling.value)">
                            <i class="fas fa-paper-plane"></i> Comentar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .testimony-modal {
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
                background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                color: white;
                animation: slideIn 0.3s ease;
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
            .testimony-preview {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }
            .testimony-preview h5 {
                color: white;
                margin-bottom: 0.5rem;
            }
            .testimony-preview p {
                color: rgba(255, 255, 255, 0.9);
                margin: 0;
                font-style: italic;
            }
            .comment-form textarea {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                padding: 1rem;
                color: white;
                margin-bottom: 1rem;
                resize: vertical;
            }
            .comment-form textarea::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
            .comment-form textarea:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
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
    }

    submitComment(id, comment) {
        if (!comment.trim()) {
            this.showMessage('Por favor escribe un comentario', 'error');
            return;
        }

        const testimony = this.testimonies.find(t => t.id === id);
        if (testimony) {
            testimony.comments++;
            this.showMessage('Comentario agregado exitosamente', 'success');
            
            // Close modal
            const modal = document.querySelector('.testimony-modal');
            if (modal) {
                modal.remove();
            }
            
            // Update display
            this.updateTestimoniesDisplay();
        }
    }

    showAddTestimonyModal() {
        const modal = document.createElement('div');
        modal.className = 'testimony-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Compartir Mi Testimonio</h4>
                    <button class="close-btn" onclick="this.closest('.testimony-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="testimony-form">
                        <div class="form-group">
                            <label>Tu Nombre</label>
                            <input type="text" placeholder="Tu nombre" required>
                        </div>
                        <div class="form-group">
                            <label>Categoría del Milagro</label>
                            <select required>
                                <option value="">Selecciona una categoría</option>
                                <option value="healing">Sanación</option>
                                <option value="provision">Provisión</option>
                                <option value="protection">Protección</option>
                                <option value="restoration">Restauración</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Título del Testimonio</label>
                            <input type="text" placeholder="Título breve de tu testimonio" required>
                        </div>
                        <div class="form-group">
                            <label>Tu Testimonio</label>
                            <textarea placeholder="Comparte tu historia de fe y milagro..." rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Compartir Testimonio
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Add form styles
        const style = document.createElement('style');
        style.textContent += `
            .testimony-form .form-group {
                margin-bottom: 1.5rem;
            }
            .testimony-form label {
                display: block;
                color: white;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            .testimony-form input,
            .testimony-form select,
            .testimony-form textarea {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                padding: 0.75rem;
                color: white;
            }
            .testimony-form input::placeholder,
            .testimony-form textarea::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
            .testimony-form input:focus,
            .testimony-form select:focus,
            .testimony-form textarea:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('.testimony-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const category = form.querySelector('select').value;
            const title = form.querySelectorAll('input[type="text"]')[1].value;
            const content = form.querySelector('textarea').value;

            this.addTestimony(name, category, title, content);
            modal.remove();
        });
    }

    addTestimony(name, category, title, content) {
        const newTestimony = {
            id: this.testimonies.length + 1,
            name: name,
            date: 'Ahora',
            category: category,
            title: title,
            content: content,
            likes: 0,
            shares: 0,
            comments: 0
        };

        this.testimonies.unshift(newTestimony);
        this.updateTestimoniesDisplay();
        this.showMessage('¡Tu testimonio ha sido compartido!', 'success');
    }

    loadMoreTestimonies() {
        // Simulate loading more testimonies
        this.showMessage('Cargando más testimonios...', 'info');
        
        setTimeout(() => {
            // Add more testimonies (simulated)
            const moreTestimonies = [
                {
                    id: this.testimonies.length + 1,
                    name: 'Patricia López',
                    date: 'Hace 3 días',
                    category: 'healing',
                    title: 'Sanación de Cáncer',
                    content: 'Los médicos me dieron 6 meses de vida. Oré sin cesar y Dios me sanó completamente. Ahora estoy libre de cáncer. ¡Dios es el médico de médicos!',
                    likes: 45,
                    shares: 22,
                    comments: 15
                }
            ];

            this.testimonies.push(...moreTestimonies);
            this.updateTestimoniesDisplay();
            this.showMessage('Más testimonios cargados', 'success');
        }, 1500);
    }

    showHeartAnimation(button) {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.cssText = `
            position: absolute;
            color: #ff4757;
            font-size: 1.5rem;
            pointer-events: none;
            animation: heartFloat 1s ease-out forwards;
            z-index: 1000;
        `;

        const rect = button.getBoundingClientRect();
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + 'px';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `testimony-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add message styles
        const style = document.createElement('style');
        style.textContent = `
            .testimony-message {
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
            .testimony-message.success {
                background: rgba(34, 197, 94, 0.9);
            }
            .testimony-message.error {
                background: rgba(244, 67, 54, 0.9);
            }
            .testimony-message.info {
                background: rgba(59, 130, 246, 0.9);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes heartFloat {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-50px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    loadLikedTestimonies() {
        const saved = localStorage.getItem('miracleTestimoniesLiked');
        if (saved) {
            this.likedTestimonies = new Set(JSON.parse(saved));
        }
    }

    saveLikedTestimonies() {
        localStorage.setItem('miracleTestimoniesLiked', JSON.stringify([...this.likedTestimonies]));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.miracleTestimonies = new MiracleTestimonies();
});

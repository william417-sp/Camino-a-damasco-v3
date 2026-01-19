// Testimonials Manager for Iglesia Camino a Damasco
// Version 1.0.0

class TestimonialsManager {
    constructor() {
        this.testimonials = [];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.isAutoPlaying = true;
        
        this.init();
    }

    init() {
        this.loadTestimonials();
        this.renderTestimonials();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    loadTestimonials() {
        // Sample testimonials - in a real implementation, these would come from a database
        this.testimonials = [
            {
                id: 1,
                text: "Mi vida cambió completamente cuando llegué a la Iglesia Camino a Damasco. Encontré una familia espiritual que me ayudó a crecer en mi fe y a superar los momentos más difíciles de mi vida.",
                author: "María González",
                role: "Miembro desde 2019",
                rating: 5,
                avatar: "MG"
            },
            {
                id: 2,
                text: "La comunidad aquí es increíble. Desde el primer día me sentí acogido y amado. Los sermones del Pastor Juan han transformado mi manera de ver la vida y mi relación con Dios.",
                author: "Carlos Rodríguez",
                role: "Miembro desde 2020",
                rating: 5,
                avatar: "CR"
            },
            {
                id: 3,
                text: "Cuando mi familia pasaba por una crisis, la Iglesia Camino a Damasco estuvo ahí para nosotros. Las oraciones y el apoyo de la comunidad nos ayudaron a superar esa difícil temporada.",
                author: "Ana Martínez",
                role: "Miembro desde 2018",
                rating: 5,
                avatar: "AM"
            },
            {
                id: 4,
                text: "Los programas para jóvenes han sido una bendición para mis hijos. Han crecido en su fe y han encontrado amigos que comparten sus valores cristianos. Estoy muy agradecida.",
                author: "Laura Sánchez",
                role: "Miembro desde 2017",
                rating: 5,
                avatar: "LS"
            },
            {
                id: 5,
                text: "La Iglesia Camino a Damasco no es solo un lugar para adorar, es una familia. Aquí he encontrado propósito, esperanza y una comunidad que me apoya en todo momento.",
                author: "José Pérez",
                role: "Miembro desde 2021",
                rating: 5,
                avatar: "JP"
            },
            {
                id: 6,
                text: "Las clases de estudio bíblico han profundizado mi entendimiento de la Palabra de Dios. Cada semana aprendo algo nuevo que aplico en mi vida diaria.",
                author: "Carmen López",
                role: "Miembro desde 2019",
                rating: 5,
                avatar: "CL"
            }
        ];
    }

    renderTestimonials() {
        const container = document.getElementById('testimonialsContainer');
        const dotsContainer = document.getElementById('testimonialDots');
        
        if (!container || !dotsContainer) return;

        // Clear existing content
        container.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Create testimonial cards
        this.testimonials.forEach((testimonial, index) => {
            const card = this.createTestimonialCard(testimonial);
            container.appendChild(card);
        });

        // Create navigation dots
        this.testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `testimonial-dot ${index === this.currentIndex ? 'active' : ''}`;
            dot.onclick = () => this.goToTestimonial(index);
            dotsContainer.appendChild(dot);
        });

        // Set initial position
        this.updateCarouselPosition();
    }

    createTestimonialCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        
        const stars = '★'.repeat(testimonial.rating);
        
        card.innerHTML = `
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${testimonial.avatar}</div>
                <div class="testimonial-info">
                    <h5>${testimonial.author}</h5>
                    <p>${testimonial.role}</p>
                </div>
            </div>
            <div class="testimonial-rating">
                ${stars.split('').map(star => `<span class="testimonial-star">${star}</span>`).join('')}
            </div>
        `;

        return card;
    }

    updateCarouselPosition() {
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;

        const translateX = -this.currentIndex * 100;
        container.style.transform = `translateX(${translateX}%)`;

        // Update dots
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex === this.testimonials.length - 1;
        }
    }

    nextTestimonial() {
        if (this.currentIndex < this.testimonials.length - 1) {
            this.currentIndex++;
            this.updateCarouselPosition();
            this.resetAutoPlay();
        }
    }

    previousTestimonial() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarouselPosition();
            this.resetAutoPlay();
        }
    }

    goToTestimonial(index) {
        if (index >= 0 && index < this.testimonials.length) {
            this.currentIndex = index;
            this.updateCarouselPosition();
            this.resetAutoPlay();
        }
    }

    startAutoPlay() {
        if (this.isAutoPlaying && this.testimonials.length > 1) {
            this.autoPlayInterval = setInterval(() => {
                this.nextTestimonial();
                // Loop back to first testimonial
                if (this.currentIndex === this.testimonials.length - 1) {
                    setTimeout(() => {
                        this.currentIndex = 0;
                        this.updateCarouselPosition();
                    }, 500);
                }
            }, this.autoPlayDelay);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }

    toggleAutoPlay() {
        this.isAutoPlaying = !this.isAutoPlaying;
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }

    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousTestimonial();
            } else if (e.key === 'ArrowRight') {
                this.nextTestimonial();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        const container = document.getElementById('testimonialsContainer');
        
        if (container) {
            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            container.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
            });

            // Mouse drag support
            let isDragging = false;
            let startMouseX = 0;

            container.addEventListener('mousedown', (e) => {
                isDragging = true;
                startMouseX = e.clientX;
                container.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                }
            });

            document.addEventListener('mouseup', (e) => {
                if (isDragging) {
                    isDragging = false;
                    container.style.cursor = 'grab';
                    this.handleSwipe(startMouseX, e.clientX);
                }
            });
        }

        // Pause auto-play on hover
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });

            carousel.addEventListener('mouseleave', () => {
                if (this.isAutoPlaying) {
                    this.startAutoPlay();
                }
            });
        }
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next testimonial
                this.nextTestimonial();
            } else {
                // Swipe right - previous testimonial
                this.previousTestimonial();
            }
        }
    }

    // Public methods for external use
    getCurrentTestimonial() {
        return this.testimonials[this.currentIndex];
    }

    getAllTestimonials() {
        return this.testimonials;
    }

    addTestimonial(testimonial) {
        this.testimonials.push(testimonial);
        this.renderTestimonials();
    }

    removeTestimonial(id) {
        this.testimonials = this.testimonials.filter(t => t.id !== id);
        if (this.currentIndex >= this.testimonials.length) {
            this.currentIndex = Math.max(0, this.testimonials.length - 1);
        }
        this.renderTestimonials();
    }

    getStats() {
        return {
            total: this.testimonials.length,
            current: this.currentIndex + 1,
            isAutoPlaying: this.isAutoPlaying
        };
    }
}

// Initialize testimonials manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.testimonialsManager = new TestimonialsManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialsManager;
}

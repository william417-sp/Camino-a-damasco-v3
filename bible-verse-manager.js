// Bible Verse Manager for Iglesia Camino a Damasco
// Version 1.0.0

class BibleVerseManager {
    constructor() {
        this.verses = [
            {
                text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
                reference: "Juan 3:16"
            },
            {
                text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
                reference: "Jeremías 29:11"
            },
            {
                text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
                reference: "Romanos 8:28"
            },
            {
                text: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.",
                reference: "2 Timoteo 1:7"
            },
            {
                text: "Todo lo puedo en Cristo que me fortalece.",
                reference: "Filipenses 4:13"
            },
            {
                text: "Porque así como el cuerpo es uno, y tiene muchos miembros, pero todos los miembros del cuerpo, siendo muchos, son un solo cuerpo, así también Cristo.",
                reference: "1 Corintios 12:12"
            },
            {
                text: "Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos; y penetra hasta partir el alma y el espíritu, las coyunturas y los tuétanos, y discierne los pensamientos y las intenciones del corazón.",
                reference: "Hebreos 4:12"
            },
            {
                text: "Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.",
                reference: "Romanos 6:23"
            },
            {
                text: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe.",
                reference: "Efesios 2:8-9"
            },
            {
                text: "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.",
                reference: "Mateo 18:20"
            },
            {
                text: "Porque la Escritura dice: Todo aquel que en él creyere, no será avergonzado.",
                reference: "Romanos 10:11"
            },
            {
                text: "Porque la ley del Espíritu de vida en Cristo Jesús me ha librado de la ley del pecado y de la muerte.",
                reference: "Romanos 8:2"
            },
            {
                text: "Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido.",
                reference: "Lucas 19:10"
            },
            {
                text: "Porque la palabra de la cruz es locura a los que se pierden; pero a los que se salvan, esto es, a nosotros, es poder de Dios.",
                reference: "1 Corintios 1:18"
            },
            {
                text: "Porque el amor de Cristo nos constriñe, pensando esto: que si uno murió por todos, luego todos murieron.",
                reference: "2 Corintios 5:14"
            },
            {
                text: "Porque la gracia de Dios se ha manifestado para salvación a todos los hombres.",
                reference: "Tito 2:11"
            },
            {
                text: "Porque el que quiera salvar su vida, la perderá; pero el que pierda su vida por causa de mí, la hallará.",
                reference: "Mateo 16:25"
            },
            {
                text: "Porque el reino de Dios no es comida ni bebida, sino justicia, paz y gozo en el Espíritu Santo.",
                reference: "Romanos 14:17"
            },
            {
                text: "Porque la fe viene por el oír, y el oír, por la palabra de Dios.",
                reference: "Romanos 10:17"
            },
            {
                text: "Porque el Señor es bueno; para siempre es su misericordia, y su verdad por todas las generaciones.",
                reference: "Salmos 100:5"
            }
        ];
        
        this.currentVerseIndex = 0;
        this.init();
    }

    init() {
        // Set initial verse based on date for consistency
        this.setDailyVerse();
        this.updateVerseDisplay();
        this.setupEventListeners();
    }

    setDailyVerse() {
        // Use date to determine which verse to show (changes daily)
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        this.currentVerseIndex = dayOfYear % this.verses.length;
    }

    updateVerseDisplay() {
        const verseText = document.querySelector('.verse-text');
        const verseReference = document.querySelector('.verse-reference');
        
        if (verseText && verseReference) {
            const currentVerse = this.verses[this.currentVerseIndex];
            verseText.textContent = currentVerse.text;
            verseReference.textContent = currentVerse.reference;
            
            // Add fade effect
            verseText.style.opacity = '0';
            verseReference.style.opacity = '0';
            
            setTimeout(() => {
                verseText.style.opacity = '1';
                verseReference.style.opacity = '1';
            }, 300);
        }
    }

    getNewVerse() {
        // Get a random verse (different from current)
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.verses.length);
        } while (newIndex === this.currentVerseIndex && this.verses.length > 1);
        
        this.currentVerseIndex = newIndex;
        this.updateVerseDisplay();
        
        // Show success message
        this.showMessage('Nuevo versículo cargado', 'success');
    }

    shareVerse() {
        const currentVerse = this.verses[this.currentVerseIndex];
        const shareText = `"${currentVerse.text}" - ${currentVerse.reference}\n\nCompartido desde Iglesia Camino a Damasco`;
        const shareUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'Versículo del Día - Iglesia Camino a Damasco',
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
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            this.showMessage('Versículo copiado al portapapeles', 'success');
        }).catch(() => {
            // Final fallback: show in alert
            alert(shareText);
        });
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.verse-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `verse-message alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
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
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    setupEventListeners() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.getNewVerse();
                        break;
                    case 's':
                        e.preventDefault();
                        this.shareVerse();
                        break;
                }
            }
        });
    }

    // Public methods for external use
    getCurrentVerse() {
        return this.verses[this.currentVerseIndex];
    }

    getAllVerses() {
        return this.verses;
    }

    addVerse(text, reference) {
        this.verses.push({ text, reference });
    }

    getVerseByReference(reference) {
        return this.verses.find(verse => verse.reference === reference);
    }

    // Method to get verse for specific date
    getVerseForDate(date) {
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const index = dayOfYear % this.verses.length;
        return this.verses[index];
    }
}

// Initialize Bible verse manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bibleVerseManager = new BibleVerseManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BibleVerseManager;
}

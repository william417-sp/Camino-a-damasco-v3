// AI Spiritual Guidance Manager for Iglesia Camino a Damasco
// Version 1.0.0

class AIGuidance {
    constructor() {
        this.messages = [];
        this.messageCount = 0;
        this.sessionCount = 1;
        this.isTyping = false;
        this.responses = {
            faith: [
                "La fe es la certeza de lo que se espera, la convicción de lo que no se ve (Hebreos 11:1). Para fortalecer tu fe, te recomiendo: 1) Leer la Biblia diariamente, 2) Orar constantemente, 3) Rodearse de una comunidad de fe, 4) Servir a otros, y 5) Confiar en las promesas de Dios.",
                "La fe crece cuando la ejercitamos. Como un músculo, se fortalece con el uso. Cada vez que confías en Dios en situaciones difíciles, tu fe se hace más fuerte. Recuerda que Jesús dijo: 'Si tuvierais fe como un grano de mostaza, diríais a este sicómoro: Desarráigate, y plántate en el mar; y os obedecería' (Lucas 17:6)."
            ],
            prayer: [
                "La oración es una conversación con Dios. Para orar mejor: 1) Busca un lugar tranquilo, 2) Comienza agradeciendo a Dios, 3) Confiesa tus pecados, 4) Presenta tus peticiones, 5) Escucha en silencio, 6) Termina alabando a Dios. Jesús nos enseñó el Padre Nuestro como modelo perfecto de oración.",
                "La oración no es solo pedir, sino también escuchar. Dedica tiempo a estar en silencio ante Dios. Como dice el Salmo 46:10: 'Estad quietos, y conoced que yo soy Dios'. La oración es un diálogo, no un monólogo."
            ],
            crisis: [
                "En tiempos de crisis, recuerda que Dios está contigo. Como dice Isaías 43:2: 'Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán'. Te recomiendo: 1) Buscar apoyo en tu comunidad de fe, 2) Orar constantemente, 3) Leer versículos de esperanza, 4) Confiar en el plan de Dios, y 5) Recordar que esto también pasará.",
                "Las crisis son oportunidades para crecer en fe. Como dice Romanos 8:28: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien'. Dios puede usar incluso las situaciones más difíciles para tu crecimiento espiritual."
            ],
            forgiveness: [
                "El perdón es un acto de amor y obediencia a Dios. Jesús nos enseñó a perdonar 'setenta veces siete' (Mateo 18:22). Para perdonar: 1) Recuerda que Dios te perdonó primero, 2) Ora por la persona que te lastimó, 3) Libera el resentimiento, 4) Busca la reconciliación si es posible, 5) Confía en que Dios hará justicia.",
                "El perdón no significa olvidar o justificar el mal, sino liberarte del veneno del resentimiento. Como dice Efesios 4:32: 'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo'."
            ],
            love: [
                "El amor es el fundamento de la fe cristiana. Como dice 1 Corintios 13:13: 'Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor'. El amor de Dios es incondicional, eterno y transformador. Para amar como Cristo: 1) Ama sin condiciones, 2) Sirve a otros, 3) Perdona siempre, 4) Pon a otros antes que a ti mismo.",
                "Dios es amor (1 Juan 4:8). Su amor es perfecto y nos capacita para amar a otros. Como dice Juan 15:12: 'Este es mi mandamiento: Que os améis unos a otros, como yo os he amado'."
            ],
            anxiety: [
                "La ansiedad es común, pero Dios nos da paz. Como dice Filipenses 4:6-7: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús'. Para superar la ansiedad: 1) Ora constantemente, 2) Medita en la Palabra de Dios, 3) Confía en las promesas de Dios, 4) Busca apoyo comunitario.",
                "Jesús nos dice: 'No os afanéis por vuestra vida' (Mateo 6:25). Dios cuida de los pájaros del cielo y de los lirios del campo, ¿cuánto más cuidará de ti? Confía en Su provisión y Su tiempo perfecto."
            ],
            default: [
                "Gracias por tu pregunta. Como tu Guía Espiritual IA, estoy aquí para ayudarte en tu camino de fe. Te recomiendo buscar la sabiduría en la Palabra de Dios y en la oración. ¿Hay algún tema específico sobre el que te gustaría profundizar?",
                "Es una excelente pregunta. La Biblia es nuestra fuente de sabiduría y verdad. Te animo a buscar versículos relacionados con tu consulta y a orar por discernimiento. ¿Te gustaría que te ayude con algún pasaje bíblico específico?",
                "Tu búsqueda espiritual es valiosa. Recuerda que Dios está contigo en cada paso del camino. Te recomiendo: 1) Leer la Biblia diariamente, 2) Orar constantemente, 3) Participar en una comunidad de fe, 4) Servir a otros. ¿En qué más puedo ayudarte?"
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        const input = document.getElementById('aiChatInput');
        const sendBtn = document.getElementById('aiSendBtn');
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            input.addEventListener('input', () => {
                this.updateSendButton();
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    updateSendButton() {
        const input = document.getElementById('aiChatInput');
        const sendBtn = document.getElementById('aiSendBtn');
        
        if (input && sendBtn) {
            const hasText = input.value.trim().length > 0;
            sendBtn.disabled = !hasText || this.isTyping;
            sendBtn.style.opacity = hasText && !this.isTyping ? '1' : '0.5';
        }
    }

    sendMessage() {
        const input = document.getElementById('aiChatInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        this.updateSendButton();
        
        // Process AI response
        setTimeout(() => {
            this.processAIResponse(message);
        }, 1000);
    }

    sendSuggestion(suggestion) {
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = suggestion;
            this.updateSendButton();
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const avatar = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
        const time = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ text, sender, time: new Date() });
        if (sender === 'user') {
            this.messageCount++;
            this.updateStats();
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span>Guía Espiritual IA está escribiendo</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return typingDiv;
    }

    removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.remove();
        }
    }

    processAIResponse(userMessage) {
        this.isTyping = true;
        this.updateSendButton();
        
        const typingDiv = this.showTypingIndicator();
        
        // Simulate AI processing time
        const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
        
        setTimeout(() => {
            this.removeTypingIndicator(typingDiv);
            
            const response = this.generateResponse(userMessage);
            this.addMessage(response, 'ai');
            
            this.isTyping = false;
            this.updateSendButton();
        }, processingTime);
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Determine response category
        let category = 'default';
        
        if (lowerMessage.includes('fe') || lowerMessage.includes('creer') || lowerMessage.includes('confiar')) {
            category = 'faith';
        } else if (lowerMessage.includes('orar') || lowerMessage.includes('oración') || lowerMessage.includes('rezar')) {
            category = 'prayer';
        } else if (lowerMessage.includes('crisis') || lowerMessage.includes('problema') || lowerMessage.includes('dificultad') || lowerMessage.includes('ayuda')) {
            category = 'crisis';
        } else if (lowerMessage.includes('perdonar') || lowerMessage.includes('perdón') || lowerMessage.includes('perdon')) {
            category = 'forgiveness';
        } else if (lowerMessage.includes('amor') || lowerMessage.includes('amar')) {
            category = 'love';
        } else if (lowerMessage.includes('ansiedad') || lowerMessage.includes('preocupación') || lowerMessage.includes('miedo')) {
            category = 'anxiety';
        }
        
        const responses = this.responses[category] || this.responses.default;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return randomResponse;
    }

    clearChat() {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;
        
        // Keep only the initial AI message
        const initialMessage = messagesContainer.querySelector('.ai-message');
        messagesContainer.innerHTML = '';
        if (initialMessage) {
            messagesContainer.appendChild(initialMessage);
        }
        
        this.messages = [];
        this.messageCount = 0;
        this.sessionCount++;
        this.updateStats();
        
        this.showMessage('Chat limpiado. Nueva sesión iniciada.', 'info');
    }

    exportChat() {
        if (this.messages.length === 0) {
            this.showMessage('No hay mensajes para exportar.', 'warning');
            return;
        }
        
        const chatData = {
            session: this.sessionCount,
            date: new Date().toISOString(),
            messages: this.messages
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chat-espiritual-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage('Chat exportado exitosamente.', 'success');
    }

    updateStats() {
        const messagesCountElement = document.getElementById('aiMessagesCount');
        const sessionsCountElement = document.getElementById('aiSessionsCount');
        
        if (messagesCountElement) {
            this.animateNumber(messagesCountElement, this.messageCount);
        }
        
        if (sessionsCountElement) {
            this.animateNumber(sessionsCountElement, this.sessionCount);
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
        const existingMessages = document.querySelectorAll('.ai-guidance-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-guidance-message alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'} alert-dismissible fade show`;
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

    // Public methods for external use
    getChatHistory() {
        return this.messages;
    }

    getStats() {
        return {
            messageCount: this.messageCount,
            sessionCount: this.sessionCount,
            isTyping: this.isTyping
        };
    }

    addCustomResponse(category, response) {
        if (!this.responses[category]) {
            this.responses[category] = [];
        }
        this.responses[category].push(response);
    }
}

// Initialize AI guidance when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiGuidance = new AIGuidance();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIGuidance;
}

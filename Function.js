document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
    initializeCalendar();
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Calendar functionality
function initializeCalendar() {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarTitle = document.querySelector('.calendar-title');
    const calendarDays = document.querySelector('.calendar-days');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Eventos regulares (servicios)
    const regularEvents = {
        0: { 
            type: 'has-event', 
            title: 'Culto Principal',
            time: '10:00 AM - 12:00 PM',
            description: 'Únete a nuestro servicio dominical donde adoramos juntos y recibimos la Palabra de Dios.'
        },
        2: { 
            type: 'has-event', 
            title: 'Oración e Intercesión',
            time: '7:30 PM - 9:00 PM',
            description: 'Tiempo dedicado a la oración y la intercesión por las necesidades de nuestra iglesia y comunidad.'
        },
        4: { 
            type: 'has-event', 
            title: 'Discipulado',
            time: '7:30 PM - 9:00 PM',
            description: 'Estudio bíblico y discipulado para profundizar en la Palabra de Dios y crecer en nuestra fe.'
        }
    };

    function updateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();
        
        // Actualizar título del mes
        calendarTitle.textContent = new Date(currentYear, currentMonth)
            .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            .toUpperCase();
        
        let calendarHTML = '';
        
        // Días del mes anterior
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            calendarHTML += `<div class="calendar-day inactive">${prevMonthLastDay - i}</div>`;
        }
        
        // Días del mes actual
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay();
            const isToday = date.toDateString() === new Date().toDateString();
            const hasEvent = regularEvents[dayOfWeek];
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (hasEvent) classes += ' has-event';
            
            calendarHTML += `<div class="${classes}" title="${hasEvent ? hasEvent.title : ''}">${day}</div>`;
        }
        
        // Días del mes siguiente
        const remainingDays = 42 - (startingDay + totalDays); // 42 = 6 filas * 7 días
        for (let day = 1; day <= remainingDays; day++) {
            calendarHTML += `<div class="calendar-day inactive">${day}</div>`;
        }
        
        calendarDays.innerHTML = calendarHTML;
        
        // Agregar eventos click a los días
        document.querySelectorAll('.calendar-day:not(.inactive)').forEach(dayElement => {
            dayElement.addEventListener('click', () => {
                // Remover selección anterior
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                dayElement.classList.add('selected');

                // Obtener la fecha del día seleccionado
                const selectedDay = parseInt(dayElement.textContent);
                const selectedDate = new Date(currentYear, currentMonth, selectedDay);
                const dayOfWeek = selectedDate.getDay();

                // Obtener el contenedor de detalles del evento
                const eventDetails = document.getElementById('eventDetails');
                const eventTitle = document.getElementById('eventTitle');
                const eventTime = document.getElementById('eventTime');
                const eventDescription = document.getElementById('eventDescription');

                // Verificar si hay un evento para ese día
                if (regularEvents[dayOfWeek]) {
                    const event = regularEvents[dayOfWeek];
                    eventTitle.textContent = event.title;
                    eventTime.textContent = event.time;
                    eventDescription.textContent = event.description;
                    eventDetails.classList.add('show');
                } else {
                    eventDetails.classList.remove('show');
                }
            });
        });
    }

    // Event listeners para los botones de navegación
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    // Inicializar calendario
    updateCalendar();
}

// Form submission handling
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        let formType = '';
        if (this.classList.contains('prayer-form')) {
            formType = 'oración';
        } else if (this.classList.contains('newsletter-form')) {
            formType = 'boletín';
        } else if (this.id === 'connectionForm') {
            formType = 'conexión';
        } else {
            formType = 'contacto';
        }
        
        alert(`¡Gracias por enviar tu formulario de ${formType}! Nos pondremos en contacto contigo pronto.`);
        this.reset();
    });
});

// Toggle navigation menu on mobile
document.querySelector('.navbar-toggler').addEventListener('click', function () {
    document.querySelector('#navbarTogglerDemo01').classList.toggle('show');
});

// Enhanced Watch Now button functionality for Facebook Live
document.querySelector('.watch-now').addEventListener('click', function () {
    const facebookPageUrl = "https://www.facebook.com/iglesiacaminoadamasco";
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    if (day === 0 && hour >= 10 && hour < 12) {
        window.open(facebookPageUrl, '_blank');
        const streamingPreview = document.querySelector('.streaming-preview');
        streamingPreview.innerHTML = `
            <div class="streaming-status">
                <i class="fas fa-circle text-danger"></i>
                <span>En Vivo Ahora</span>
            </div>
            <div class="streaming-info">
                <p>Únete a nuestro servicio en Facebook Live</p>
                <a href="${facebookPageUrl}" target="_blank" class="btn btn-primary">
                    <i class="fab fa-facebook"></i> Ver en Facebook
                </a>
            </div>
        `;
    } else {
        const nextService = new Date();
        if (day === 0 && hour < 10) {
            nextService.setHours(10, 0, 0);
        } else if (day === 0 && hour >= 12) {
            nextService.setDate(nextService.getDate() + (7 - day) % 7);
            nextService.setHours(10, 0, 0);
        } else {
            nextService.setDate(nextService.getDate() + (7 - day) % 7);
            nextService.setHours(10, 0, 0);
        }
        
        const streamingPreview = document.querySelector('.streaming-preview');
        streamingPreview.innerHTML = `
            <div class="streaming-countdown">
                <h4>Próximo Servicio</h4>
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <span class="countdown-number" id="days">00</span>
                        <span class="countdown-label">Días</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number" id="hours">00</span>
                        <span class="countdown-label">Horas</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number" id="minutes">00</span>
                        <span class="countdown-label">Minutos</span>
                    </div>
                </div>
                <p class="next-service-time">
                    ${nextService.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} 
                    a las 10:00
                </p>
                <a href="${facebookPageUrl}" target="_blank" class="btn btn-outline-light">
                    <i class="fab fa-facebook"></i> Visitar Facebook
                </a>
            </div>
        `;
        updateCountdown(nextService);
    }
});

function updateCountdown(targetDate) {
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(countdown);
            document.querySelector('.streaming-preview').innerHTML = `
                <div class="streaming-status">
                    <i class="fas fa-circle text-danger"></i>
                    <span>En Vivo Ahora</span>
                </div>
                <div class="streaming-info">
                    <p>Únete a nuestro servicio en Facebook Live</p>
                    <a href="https://www.facebook.com/iglesiacaminoadamasco" target="_blank" class="btn btn-primary">
                        <i class="fab fa-facebook"></i> Ver en Facebook
                    </a>
                </div>
            `;
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }, 1000);
}

// Plan Visit button functionality
document.querySelector('.plan-visit-btn')?.addEventListener('click', function() {
    const connectOffcanvas = new bootstrap.Offcanvas(document.getElementById('connectOffcanvas'));
    connectOffcanvas.show();
});

// Live Chat Functionality
const chatContainer = document.querySelector('.chat-container');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.chat-input button');

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'system-message'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
    `;
    chatMessages?.appendChild(messageDiv);
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatInput() {
    const message = chatInput?.value.trim();
    if (message) {
        addMessage(message, true);
        setTimeout(() => {
            addMessage('Gracias por tu mensaje. Nuestro equipo te responderá pronto.');
        }, 1000);
        if (chatInput) chatInput.value = '';
    }
}

if (sendButton) {
    sendButton.addEventListener('click', handleChatInput);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatInput();
        }
    });
}

// Previous Streams Functionality
const streamCards = document.querySelectorAll('.stream-card');
streamCards.forEach(card => {
    card.addEventListener('click', () => {
        const videoUrl = card.dataset.videoUrl;
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        }
    });
});

// Notification System
function showNotification(title, message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }
    
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: message,
            icon: "Images/cross.png"
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, {
                    body: message,
                    icon: "Images/cross.png"
                });
            }
        });
    }
}

// Service reminder notifications
setInterval(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    if (day === 0 && hour === 9 && minute === 55) {
        showNotification(
            "Servicio en Vivo Próximamente",
            "El servicio dominical comenzará en 5 minutos. ¡Únete a nosotros!"
        );
    }
}, 60000);
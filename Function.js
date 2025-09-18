// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
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

// Form submission handling
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get the form type
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
        
        // Show success message
        alert(`¡Gracias por enviar tu formulario de ${formType}! Nos pondremos en contacto contigo pronto.`);
        
        // Reset form
        this.reset();
    });
});

// Toggle navigation menu on mobile
document.querySelector('.navbar-toggler').addEventListener('click', function () {
    document.querySelector('#navbarTogglerDemo01').classList.toggle('show');
});

// Enhanced Watch Now button functionality for Facebook Live
document.querySelector('.watch-now').addEventListener('click', function () {
    // Facebook Page URL - Replace with your actual Facebook page URL
    const facebookPageUrl = "https://www.facebook.com/profile.php?id=100081976192579";
    
    // Check if the service is currently live
    const now = new Date();
    const day = now.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
    const hour = now.getHours();
    
    // Function to find next service
    function getNextService() {
        const next = new Date(now);
        const daysToAdd = [0, 2, 4]; // Sunday (0), Tuesday (2), Thursday (4)
        
        // Find the next service day
        let nextDayIndex = daysToAdd.findIndex(d => d > day || (d === day && hour < (d === 0 ? 10 : 19.5)));
        if (nextDayIndex === -1) {
            nextDayIndex = 0; // Next Sunday
            next.setDate(next.getDate() + (7 - day));
        } else {
            next.setDate(next.getDate() + (daysToAdd[nextDayIndex] - day));
        }
        
        // Set time
        next.setHours(daysToAdd[nextDayIndex] === 0 ? 10 : 19);
        next.setMinutes(daysToAdd[nextDayIndex] === 0 ? 0 : 30);
        next.setSeconds(0);
        next.setMilliseconds(0);
        
        return next;
    }
    
    const nextService = getNextService();
    
    if (now >= nextService && now < new Date(nextService.getTime() + (nextService.getHours() === 10 ? 2 : 1.5) * 60 * 60 * 1000)) {
        // Service is live - Open Facebook Live
        window.open(facebookPageUrl, '_blank');
        
        // Update streaming preview
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
        // Update streaming preview with countdown
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
                    a las ${nextService.getHours()}:${nextService.getMinutes().toString().padStart(2, '0')}
                </p>
                <a href="${facebookPageUrl}" target="_blank" class="btn btn-outline-light">
                    <i class="fab fa-facebook"></i> Visitar Facebook
                </a>
            </div>
        `;
        
        // Start countdown timer
        updateCountdown(nextService);
    }
});

// Countdown timer function
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
                    <a href="https://www.facebook.com/profile.php?id=100081976192579" target="_blank" class="btn btn-primary">
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

// Fade-in effect for sections
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionPosition = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (sectionPosition < screenPosition) {
            section.classList.add('fade-in');
        }
    });
});

// Toggle active class for the Donación button
document.querySelector('.donate-btn').addEventListener('click', function () {
    this.classList.toggle('active');
    // Redirect to donation page
    window.location.href = "https://example.com/donate"; // Replace with your actual donation link
});

// Back to top button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
});

backToTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Lightbox for images
document.querySelectorAll('.about-img, .team-img img, .sermon-video img').forEach(image => {
    image.addEventListener('click', function () {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `<img src="${this.src}" alt="${this.alt}">`;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', function () {
            document.body.removeChild(lightbox);
        });
    });
});

// Open external links in a new tab
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank'); // Open in a new tab
        link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
    }
});

// Make phone and email links functional
document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
    phoneLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default behavior
        window.location.href = this.getAttribute('href'); // Open the phone dialer
    });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
    emailLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default behavior
        window.location.href = this.getAttribute('href'); // Open the default email client
    });
});

// Connect floating button animation
const connectBtn = document.querySelector('.btn-connect');
setInterval(() => {
    connectBtn.classList.toggle('pulse');
}, 2000);

// Instagram feed hover effects
document.querySelectorAll('.instagram-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.instagram-overlay').style.opacity = '1';
    });
    
    item.addEventListener('mouseleave', function() {
        this.querySelector('.instagram-overlay').style.opacity = '0';
    });
});

// Update copyright year automatically
document.querySelector('.footer-copyright').innerHTML = 
    `&copy; ${new Date().getFullYear()} Iglesia Camino a Damasco. Todos los derechos reservados.`;

// Handle form validation with Bootstrap
(() => {
    'use strict';
    
    // Fetch all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
})();

// Calendar Reminder Button
document.querySelector('.btn-outline-primary').addEventListener('click', function() {
    const nextService = new Date();
    const day = nextService.getDay();
    const hour = nextService.getHours();
    
    if (day === 0 && hour < 10) {
        nextService.setHours(10, 0, 0);
    } else if (day === 0 && hour >= 12) {
        // Next service is Tuesday
        nextService.setDate(nextService.getDate() + (2 - day + 7) % 7);
        nextService.setHours(19, 30, 0);
    } else {
        // Next service is Sunday
        nextService.setDate(nextService.getDate() + (7 - day) % 7);
        nextService.setHours(10, 0, 0);
    }
    
    // Create calendar event
    const event = {
        title: 'Servicio de Iglesia Camino a Damasco',
        description: 'Únete a nuestro servicio en vivo',
        startTime: nextService.toISOString(),
        endTime: new Date(nextService.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Iglesia Camino a Damasco'
    };
    
    // Create calendar download link
    const calendarUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(
        `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.startTime.replace(/[-:]/g, '')}
DTEND:${event.endTime.replace(/[-:]/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`
    )}`;
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = 'servicio-iglesia.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

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

// Schedule Widget Functionality
const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.querySelector('.month-year');
const prevMonth = document.querySelector('.prev-month');
const nextMonth = document.querySelector('.next-month');

let currentDate = new Date();
const calendarEvents = [
    { date: '2025-09-14', title: 'Servicio Dominical', time: '10:00 AM' },
    { date: '2025-09-16', title: 'Culto', time: '7:30 PM' },
    { date: '2025-09-18', title: 'Culto', time: '7:30 PM' },
    { date: '2025-09-21', title: 'Servicio Dominical', time: '10:00 AM' }
];

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month and year display
    monthYear.textContent = new Date(year, month).toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
    }).toUpperCase();
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const startingDay = (firstDay.getDay() + 6) % 7; // Adjust for Monday start
    
    // Add weekday headers
    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header-day';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before first day
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Check if day has events
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (calendarEvents.some(event => event.date === dateStr)) {
            dayCell.classList.add('event');
        }
        
        // Check if day is today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('today');
        }
        
        calendarGrid.appendChild(dayCell);
    }
    
    // Update events list
    updateEventsList();
}

function updateEventsList() {
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = '';
    
    const currentMonthEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getFullYear() === currentDate.getFullYear();
    });
    
    currentMonthEvents.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="event-info">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${new Date(event.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric' 
                })} - ${event.time}</div>
            </div>
            <button class="btn btn-sm btn-outline-primary">Agendar</button>
        `;
        eventList.appendChild(li);
    });
}

if (prevMonth && nextMonth) {
    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
}

// Initialize calendar
updateCalendar();

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

// Check for live stream every minute
setInterval(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    if (day === 0 && hour === 9 && now.getMinutes() === 55) {
        showNotification(
            "Servicio en Vivo Próximamente",
            "El servicio dominical comenzará en 5 minutos. ¡Únete a nosotros!"
        );
    }
}, 60000);

// Simple Admin Login (Not secure, for demonstration)
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple check - in real app, use server-side auth
    if (username === 'admin' && password === 'password') {
        document.getElementById('admin-section').style.display = 'block';
        bootstrap.Modal.getInstance(document.getElementById('adminLoginModal')).hide();
        loadAdminData();
    } else {
        alert('Credenciales incorrectas');
    }
});

// Load admin data from localStorage
function loadAdminData() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    events.forEach(event => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${event.title} - ${event.date}: ${event.description}`;
        eventList.appendChild(li);
    });
    
    const donationList = document.getElementById('donationList');
    donationList.innerHTML = '';
    donations.forEach(donation => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${donation.name} - $${donation.amount} on ${donation.date}`;
        donationList.appendChild(li);
    });
}

// Event Form Submit
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;
    
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push({ title, date, description });
    localStorage.setItem('events', JSON.stringify(events));
    
    loadAdminData();
    this.reset();
});

// Donation Form Submit
document.getElementById('donationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('donorName').value;
    const amount = document.getElementById('donationAmount').value;
    const date = document.getElementById('donationDate').value;
    
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.push({ name, amount, date });
    localStorage.setItem('donations', JSON.stringify(donations));
    
    loadAdminData();
    this.reset();
});
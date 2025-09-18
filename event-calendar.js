// Interactive Event Calendar for Iglesia Camino a Damasco
// Version 1.0.0

class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.calendarElement = null;
        this.eventsListElement = null;
        
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
        this.renderCalendar();
    }

    loadEvents() {
        // Sample events - in a real implementation, these would come from a database
        this.events = [
            {
                id: 1,
                title: 'Servicio Dominical',
                date: new Date(2025, 0, 26), // January 26, 2025
                time: '10:00 AM - 12:00 PM',
                location: 'Santuario Principal',
                description: 'Servicio dominical con adoración y predicación',
                type: 'service',
                recurring: 'weekly',
                dayOfWeek: 0 // Sunday
            },
            {
                id: 2,
                title: 'Estudio Bíblico',
                date: new Date(2025, 0, 29), // January 29, 2025
                time: '7:00 PM - 8:30 PM',
                location: 'Salón Comunitario',
                description: 'Estudio bíblico semanal para adultos',
                type: 'study',
                recurring: 'weekly',
                dayOfWeek: 3 // Wednesday
            },
            {
                id: 3,
                title: 'Grupo de Jóvenes',
                date: new Date(2025, 0, 31), // January 31, 2025
                time: '7:00 PM - 9:00 PM',
                location: 'Salón de Jóvenes',
                description: 'Reunión semanal del grupo de jóvenes',
                type: 'youth',
                recurring: 'weekly',
                dayOfWeek: 5 // Friday
            },
            {
                id: 4,
                title: 'Evento Especial de Pascua',
                date: new Date(2025, 3, 15), // April 15, 2025
                time: '10:00 AM - 12:00 PM',
                location: 'Santuario Principal',
                description: 'Celebración especial de Pascua con toda la congregación',
                type: 'special',
                recurring: 'none'
            },
            {
                id: 5,
                title: 'Noche de Adoración',
                date: new Date(2025, 0, 25), // January 25, 2025
                time: '7:00 PM - 9:00 PM',
                location: 'Santuario',
                description: 'Noche especial de adoración y alabanza',
                type: 'worship',
                recurring: 'none'
            }
        ];

        // Generate recurring events for the current month
        this.generateRecurringEvents();
    }

    generateRecurringEvents() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        this.events.forEach(event => {
            if (event.recurring === 'weekly') {
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentYear, currentMonth, day);
                    if (date.getDay() === event.dayOfWeek) {
                        // Check if this specific date doesn't already have this event
                        const existingEvent = this.events.find(e => 
                            e.title === event.title && 
                            e.date.getTime() === date.getTime()
                        );
                        
                        if (!existingEvent) {
                            this.events.push({
                                ...event,
                                id: event.id + '_' + day,
                                date: new Date(date)
                            });
                        }
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('prev-month')) {
                this.previousMonth();
            } else if (e.target.classList.contains('next-month')) {
                this.nextMonth();
            } else if (e.target.classList.contains('calendar-day')) {
                this.selectDate(e.target.dataset.date);
            }
        });
    }

    renderCalendar() {
        const calendarContainer = document.querySelector('.calendar-grid');
        if (!calendarContainer) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month/year display
        const monthYearElement = document.querySelector('.month-year');
        if (monthYearElement) {
            const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            monthYearElement.textContent = `${monthNames[month]} ${year}`;
        }

        // Clear calendar
        calendarContainer.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarContainer.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarContainer.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const currentDate = new Date(year, month, day);
            
            // Check if it's today
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Check if there are events on this day
            const dayEvents = this.getEventsForDate(currentDate);
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
                
                // Add event indicator
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'event-indicator';
                eventIndicator.textContent = dayEvents.length;
                dayElement.appendChild(eventIndicator);
            }

            calendarContainer.appendChild(dayElement);
        }

        // Update events list
        this.updateEventsList();
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            return event.date.toDateString() === date.toDateString();
        });
    }

    selectDate(dateString) {
        const selectedDate = new Date(dateString);
        const dayEvents = this.getEventsForDate(selectedDate);
        
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection to clicked day
        const selectedDay = document.querySelector(`[data-date="${dateString}"]`);
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }

        // Update events list for selected date
        this.updateEventsList(selectedDate);
    }

    updateEventsList(selectedDate = null) {
        const eventsListElement = document.querySelector('.event-list');
        if (!eventsListElement) return;

        let eventsToShow = [];
        
        if (selectedDate) {
            eventsToShow = this.getEventsForDate(selectedDate);
        } else {
            // Show upcoming events (next 7 days)
            const today = new Date();
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            eventsToShow = this.events.filter(event => {
                return event.date >= today && event.date <= nextWeek;
            }).sort((a, b) => a.date - b.date);
        }

        eventsListElement.innerHTML = '';

        if (eventsToShow.length === 0) {
            eventsListElement.innerHTML = '<li class="no-events">No hay eventos programados</li>';
            return;
        }

        eventsToShow.forEach(event => {
            const eventItem = document.createElement('li');
            eventItem.className = `event-item ${event.type}`;
            
            const eventDate = event.date.toLocaleDateString('es-ES', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });

            eventItem.innerHTML = `
                <div class="event-time">
                    <div class="event-date">${eventDate}</div>
                    <div class="event-time-detail">${event.time}</div>
                </div>
                <div class="event-content">
                    <h4 class="event-title">${event.title}</h4>
                    <p class="event-location">
                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                    </p>
                    <p class="event-description">${event.description}</p>
                </div>
                <div class="event-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="eventCalendar.addToCalendar('${event.id}')">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" onclick="eventCalendar.shareEvent('${event.id}')">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            `;

            eventsListElement.appendChild(eventItem);
        });
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.loadEvents(); // Regenerate recurring events
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.loadEvents(); // Regenerate recurring events
        this.renderCalendar();
    }

    addToCalendar(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Generate calendar event data
        const startDate = event.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endDate = new Date(event.date.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        const calendarData = {
            title: event.title,
            start: startDate,
            end: endDate,
            location: event.location,
            description: event.description
        };

        // Create calendar URL
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.title)}&dates=${calendarData.start}/${calendarData.end}&location=${encodeURIComponent(calendarData.location)}&details=${encodeURIComponent(calendarData.description)}`;
        
        // Open in new window
        window.open(calendarUrl, '_blank');
    }

    shareEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const eventDate = event.date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const shareText = `Te invito al evento "${event.title}" el ${eventDate} a las ${event.time} en ${event.location}. ${event.description}`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareText}\n\nMás información: ${shareUrl}`).then(() => {
                alert('Información del evento copiada al portapapeles');
            });
        }
    }

    // Public methods for external use
    getEvents() {
        return this.events;
    }

    addEvent(event) {
        this.events.push(event);
        this.renderCalendar();
    }

    removeEvent(eventId) {
        this.events = this.events.filter(e => e.id !== eventId);
        this.renderCalendar();
    }

    getEventsForMonth(year, month) {
        return this.events.filter(event => {
            return event.date.getFullYear() === year && event.date.getMonth() === month;
        });
    }
}

// Initialize event calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.eventCalendar = new EventCalendar();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventCalendar;
}

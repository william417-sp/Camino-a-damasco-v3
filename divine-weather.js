class DivineWeather {
    constructor() {
        this.currentUnit = 'C'; // C or F
        this.spiritualMessages = {
            sunny: [
                { message: "Como el sol brilla sobre justos e injustos, así es el amor de Dios para todos", verse: "Mateo 5:45" },
                { message: "El Señor es mi luz y mi salvación, ¿de quién temeré?", verse: "Salmo 27:1" },
                { message: "Porque el sol sale para malos y buenos, y llueve sobre justos e injustos", verse: "Mateo 5:45" }
            ],
            cloudy: [
                { message: "Aunque las nubes cubran el cielo, la esperanza en Dios nunca se nubla", verse: "Lamentaciones 3:22" },
                { message: "Las misericordias del Señor son nuevas cada mañana", verse: "Lamentaciones 3:23" },
                { message: "Dios es nuestro refugio y fortaleza, nuestro pronto auxilio en las tribulaciones", verse: "Salmo 46:1" }
            ],
            rainy: [
                { message: "Como la lluvia riega la tierra, así la Palabra de Dios riega nuestros corazones", verse: "Isaías 55:10" },
                { message: "Después de la lluvia viene el arcoíris, después de la prueba viene la bendición", verse: "Génesis 9:13" },
                { message: "El Señor enviará lluvia sobre tu tierra a su tiempo", verse: "Deuteronomio 11:14" }
            ],
            stormy: [
                { message: "Jesús calmó la tempestad, Él puede calmar cualquier tormenta en tu vida", verse: "Marcos 4:39" },
                { message: "En medio de la tormenta, Dios es nuestro ancla segura", verse: "Hebreos 6:19" },
                { message: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios", verse: "Isaías 41:10" }
            ]
        };
        
        this.weatherData = {
            current: {
                temp: 24,
                description: "Soleado y bendecido",
                icon: "sun",
                visibility: 10,
                windSpeed: 5,
                humidity: 65,
                feelsLike: 26
            },
            forecast: [
                { day: "Lun", icon: "sun", temp: 24 },
                { day: "Mar", icon: "cloud-sun", temp: 22 },
                { day: "Mié", icon: "cloud-rain", temp: 18 },
                { day: "Jue", icon: "cloud", temp: 20 },
                { day: "Vie", icon: "sun", temp: 25 },
                { day: "Sáb", icon: "sun", temp: 27 },
                { day: "Dom", icon: "sun", temp: 26 }
            ]
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.updateDisplay();
        this.updateSpiritualMessage();
        this.startAutoUpdate();
    }

    updateDisplay() {
        this.updateCurrentWeather();
        this.updateForecast();
        this.updateDate();
    }

    updateCurrentWeather() {
        const data = this.weatherData.current;
        
        // Update temperature
        const tempEl = document.getElementById('weatherTemp');
        if (tempEl) {
            const temp = this.currentUnit === 'F' ? this.celsiusToFahrenheit(data.temp) : data.temp;
            tempEl.textContent = `${Math.round(temp)}°`;
        }
        
        // Update unit
        const unitEl = document.querySelector('.temp-unit');
        if (unitEl) {
            unitEl.textContent = this.currentUnit;
        }
        
        // Update description
        const descEl = document.getElementById('weatherDesc');
        if (descEl) {
            descEl.textContent = data.description;
        }
        
        // Update icon
        const iconEl = document.getElementById('weatherIcon');
        if (iconEl) {
            iconEl.innerHTML = `<i class="fas fa-${data.icon}"></i>`;
        }
        
        // Update details
        this.updateDetail('visibility', `${data.visibility} km`);
        this.updateDetail('windSpeed', `${data.windSpeed} km/h`);
        this.updateDetail('humidity', `${data.humidity}%`);
        
        const feelsLike = this.currentUnit === 'F' ? this.celsiusToFahrenheit(data.feelsLike) : data.feelsLike;
        this.updateDetail('feelsLike', `${Math.round(feelsLike)}°${this.currentUnit}`);
    }

    updateDetail(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

    updateForecast() {
        const forecastGrid = document.getElementById('forecastGrid');
        if (!forecastGrid) return;

        forecastGrid.innerHTML = '';
        
        this.weatherData.forecast.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'forecast-day';
            
            const temp = this.currentUnit === 'F' ? this.celsiusToFahrenheit(day.temp) : day.temp;
            
            dayEl.innerHTML = `
                <span class="day-name">${day.day}</span>
                <div class="day-icon">
                    <i class="fas fa-${day.icon}"></i>
                </div>
                <span class="day-temp">${Math.round(temp)}°</span>
            `;
            
            forecastGrid.appendChild(dayEl);
        });
    }

    updateDate() {
        const dateEl = document.getElementById('weatherDate');
        if (dateEl) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateEl.textContent = now.toLocaleDateString('es-ES', options);
        }
    }

    updateSpiritualMessage() {
        const currentIcon = this.weatherData.current.icon;
        let weatherType = 'sunny';
        
        if (currentIcon.includes('cloud')) {
            weatherType = 'cloudy';
        } else if (currentIcon.includes('rain')) {
            weatherType = 'rainy';
        } else if (currentIcon.includes('storm') || currentIcon.includes('thunder')) {
            weatherType = 'stormy';
        }
        
        const messages = this.spiritualMessages[weatherType];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const messageEl = document.getElementById('spiritualMessage');
        const verseEl = document.querySelector('.message-verse');
        
        if (messageEl) {
            messageEl.textContent = `"${randomMessage.message}"`;
        }
        if (verseEl) {
            verseEl.textContent = `- ${randomMessage.verse}`;
        }
    }

    refreshWeather() {
        // Simulate weather refresh
        this.showMessage('Actualizando información del clima...', 'info');
        
        // Add loading animation
        const refreshBtn = document.querySelector('button[onclick="divineWeather.refreshWeather()"]');
        if (refreshBtn) {
            const originalHTML = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
            refreshBtn.disabled = true;
            
            setTimeout(() => {
                // Simulate new weather data
                this.simulateWeatherChange();
                this.updateDisplay();
                this.updateSpiritualMessage();
                
                refreshBtn.innerHTML = originalHTML;
                refreshBtn.disabled = false;
                this.showMessage('Clima actualizado exitosamente', 'success');
            }, 2000);
        }
    }

    simulateWeatherChange() {
        // Simulate slight weather variations
        const variations = [
            { temp: 22, description: "Parcialmente nublado", icon: "cloud-sun" },
            { temp: 26, description: "Soleado y cálido", icon: "sun" },
            { temp: 20, description: "Nublado", icon: "cloud" },
            { temp: 18, description: "Lluvia ligera", icon: "cloud-rain" },
            { temp: 24, description: "Soleado y bendecido", icon: "sun" }
        ];
        
        const randomWeather = variations[Math.floor(Math.random() * variations.length)];
        this.weatherData.current = {
            ...this.weatherData.current,
            ...randomWeather,
            visibility: Math.floor(Math.random() * 5) + 8,
            windSpeed: Math.floor(Math.random() * 10) + 3,
            humidity: Math.floor(Math.random() * 20) + 55,
            feelsLike: randomWeather.temp + Math.floor(Math.random() * 3) + 1
        };
    }

    shareWeather() {
        const data = this.weatherData.current;
        const temp = this.currentUnit === 'F' ? this.celsiusToFahrenheit(data.temp) : data.temp;
        const shareText = `🌤️ Clima en Iglesia Camino a Damasco: ${Math.round(temp)}°${this.currentUnit} - ${data.description}. ¡Dios bendice cada día! 🙏`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Clima Divino',
                text: shareText,
                url: window.location.href
            }).then(() => {
                this.showMessage('Clima compartido exitosamente', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('Información del clima copiada al portapapeles', 'success');
        }).catch(() => {
            this.showMessage('No se pudo compartir el clima', 'error');
        });
    }

    toggleUnit() {
        this.currentUnit = this.currentUnit === 'C' ? 'F' : 'C';
        this.updateDisplay();
        this.saveSettings();
        this.showMessage(`Unidad cambiada a °${this.currentUnit}`, 'info');
    }

    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    startAutoUpdate() {
        // Update weather every 30 minutes
        setInterval(() => {
            this.simulateWeatherChange();
            this.updateDisplay();
            this.updateSpiritualMessage();
        }, 30 * 60 * 1000);
        
        // Update spiritual message every 5 minutes
        setInterval(() => {
            this.updateSpiritualMessage();
        }, 5 * 60 * 1000);
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `weather-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add message styles
        const style = document.createElement('style');
        style.textContent = `
            .weather-message {
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
            .weather-message.success {
                background: rgba(34, 197, 94, 0.9);
            }
            .weather-message.error {
                background: rgba(244, 67, 54, 0.9);
            }
            .weather-message.info {
                background: rgba(6, 182, 212, 0.9);
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

    loadSettings() {
        this.currentUnit = localStorage.getItem('divineWeatherUnit') || 'C';
    }

    saveSettings() {
        localStorage.setItem('divineWeatherUnit', this.currentUnit);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.divineWeather = new DivineWeather();
});

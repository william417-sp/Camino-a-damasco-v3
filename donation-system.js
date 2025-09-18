// Donation System for Iglesia Camino a Damasco
// Version 1.0.0

class DonationSystem {
    constructor() {
        this.selectedAmount = null;
        this.selectedType = null;
        this.selectedMethod = null;
        this.form = document.getElementById('donationForm');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Amount selection
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAmount(e.target.dataset.amount);
            });
        });

        // Custom amount input
        const customAmountInput = document.getElementById('customAmount');
        customAmountInput.addEventListener('input', (e) => {
            this.selectCustomAmount(e.target.value);
        });

        // Donation type selection
        document.querySelectorAll('.type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectType(e.currentTarget.dataset.type);
            });
        });

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget.dataset.method);
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });
    }

    selectAmount(amount) {
        // Remove active class from all amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        const selectedBtn = document.querySelector(`[data-amount="${amount}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Set the amount in the form
        this.selectedAmount = amount;
        document.getElementById('customAmount').value = amount;
    }

    selectCustomAmount(amount) {
        // Remove active class from all amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.selectedAmount = amount;
    }

    selectType(type) {
        // Remove active class from all type cards
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        const selectedCard = document.querySelector(`[data-type="${type}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }

        this.selectedType = type;
        document.getElementById('donationType').value = type;
    }

    selectPaymentMethod(method) {
        // Remove active class from all payment methods
        document.querySelectorAll('.payment-method').forEach(methodEl => {
            methodEl.classList.remove('active');
        });

        // Add active class to selected method
        const selectedMethod = document.querySelector(`[data-method="${method}"]`);
        if (selectedMethod) {
            selectedMethod.classList.add('active');
        }

        this.selectedMethod = method;
        document.getElementById('paymentMethod').value = method;
    }

    setupFormValidation() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Por favor, ingresa un email válido.';
                break;
            case 'number':
                isValid = value > 0;
                errorMessage = 'Por favor, ingresa un monto válido.';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'Este campo es requerido.';
        }

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;

        // Validate required fields
        const requiredFields = this.form.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate amount selection
        if (!this.selectedAmount || this.selectedAmount <= 0) {
            this.showError('Por favor, selecciona un monto válido.');
            isValid = false;
        }

        // Validate donation type
        if (!this.selectedType) {
            this.showError('Por favor, selecciona un tipo de donación.');
            isValid = false;
        }

        // Validate payment method
        if (!this.selectedMethod) {
            this.showError('Por favor, selecciona un método de pago.');
            isValid = false;
        }

        return isValid;
    }

    async handleFormSubmission(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
            const formData = new FormData(this.form);
            const donationData = Object.fromEntries(formData.entries());

            // Process donation based on payment method
            const result = await this.processDonation(donationData);

            if (result.success) {
                this.showSuccess('¡Donación procesada exitosamente! Recibirás un recibo por email.');
                this.form.reset();
                this.resetSelections();
            } else {
                this.showError(result.message || 'Error al procesar la donación. Por favor, inténtalo de nuevo.');
            }

        } catch (error) {
            console.error('Donation processing error:', error);
            this.showError('Error al procesar la donación. Por favor, inténtalo de nuevo.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    async processDonation(donationData) {
        // Simulate payment processing based on method
        switch (donationData.method) {
            case 'card':
                return await this.processCardPayment(donationData);
            case 'paypal':
                return await this.processPayPalPayment(donationData);
            case 'bank':
                return await this.processBankTransfer(donationData);
            case 'cash':
                return await this.processCashPayment(donationData);
            default:
                throw new Error('Método de pago no válido');
        }
    }

    async processCardPayment(donationData) {
        // Simulate card payment processing
        await this.simulateDelay(2000);
        
        // In a real implementation, you would integrate with:
        // - Stripe
        // - PayPal
        // - Square
        // - Other payment processors
        
        return {
            success: true,
            transactionId: 'TXN_' + Date.now(),
            message: 'Pago con tarjeta procesado exitosamente'
        };
    }

    async processPayPalPayment(donationData) {
        // Simulate PayPal payment processing
        await this.simulateDelay(1500);
        
        // In a real implementation, you would redirect to PayPal
        // or use PayPal's JavaScript SDK
        
        return {
            success: true,
            transactionId: 'PP_' + Date.now(),
            message: 'Pago con PayPal procesado exitosamente'
        };
    }

    async processBankTransfer(donationData) {
        // Simulate bank transfer processing
        await this.simulateDelay(1000);
        
        // In a real implementation, you would:
        // - Generate bank transfer instructions
        // - Send email with transfer details
        // - Set up pending donation tracking
        
        return {
            success: true,
            transactionId: 'BANK_' + Date.now(),
            message: 'Instrucciones de transferencia bancaria enviadas por email'
        };
    }

    async processCashPayment(donationData) {
        // Simulate cash payment processing
        await this.simulateDelay(500);
        
        // In a real implementation, you would:
        // - Generate cash donation instructions
        // - Send email with drop-off information
        // - Set up pending donation tracking
        
        return {
            success: true,
            transactionId: 'CASH_' + Date.now(),
            message: 'Instrucciones para donación en efectivo enviadas por email'
        };
    }

    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetSelections() {
        // Reset amount selection
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.selectedAmount = null;

        // Reset type selection
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('active');
        });
        this.selectedType = null;

        // Reset payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('active');
        });
        this.selectedMethod = null;

        // Clear validation classes
        this.form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.donation-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `donation-message alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Insert message at the top of the form
        this.form.insertBefore(messageDiv, this.form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Public methods for external use
    getDonationSummary() {
        return {
            amount: this.selectedAmount,
            type: this.selectedType,
            method: this.selectedMethod
        };
    }

    setAmount(amount) {
        this.selectAmount(amount);
    }

    setType(type) {
        this.selectType(type);
    }

    setPaymentMethod(method) {
        this.selectPaymentMethod(method);
    }
}

// Initialize donation system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.donationSystem = new DonationSystem();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DonationSystem;
}

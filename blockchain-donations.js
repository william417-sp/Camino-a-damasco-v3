class BlockchainDonations {
    constructor() {
        this.selectedAmount = 0;
        this.paymentMethod = 'crypto';
        this.totalDonations = 0;
        this.totalAmount = 0;
        this.cryptoDonations = 0;
        this.init();
    }

    init() {
        this.loadStats();
        this.setupEventListeners();
        this.updateSummary();
    }

    setupEventListeners() {
        // Amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                this.setAmount(amount);
            });
        });

        // Custom amount input
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value) || 0;
                this.setAmount(amount);
            });
        }

        // Payment method buttons
        document.querySelectorAll('.payment-method').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.target.closest('.payment-method').dataset.method;
                this.setPaymentMethod(method);
            });
        });

        // Form inputs
        const purposeSelect = document.getElementById('donationPurpose');
        if (purposeSelect) {
            purposeSelect.addEventListener('change', () => {
                this.updateSummary();
            });
        }
    }

    setAmount(amount) {
        this.selectedAmount = amount;
        
        // Update amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (parseInt(btn.dataset.amount) === amount) {
                btn.classList.add('selected');
            }
        });

        // Update custom amount input
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
            customAmountInput.value = amount > 0 ? amount : '';
        }

        this.updateSummary();
    }

    setPaymentMethod(method) {
        this.paymentMethod = method;
        
        // Update payment method buttons
        document.querySelectorAll('.payment-method').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.method === method) {
                btn.classList.add('active');
            }
        });

        this.updateSummary();
    }

    updateSummary() {
        const summaryAmount = document.getElementById('summaryAmount');
        const summaryMethod = document.getElementById('summaryMethod');
        const summaryPurpose = document.getElementById('summaryPurpose');
        const summaryTotal = document.getElementById('summaryTotal');
        const purposeSelect = document.getElementById('donationPurpose');

        if (summaryAmount) {
            summaryAmount.textContent = `$${this.selectedAmount.toFixed(2)}`;
        }

        if (summaryMethod) {
            const methodNames = {
                'crypto': 'Criptomonedas',
                'card': 'Tarjeta de Crédito',
                'bank': 'Transferencia Bancaria'
            };
            summaryMethod.textContent = methodNames[this.paymentMethod] || 'Criptomonedas';
        }

        if (summaryPurpose && purposeSelect) {
            const selectedOption = purposeSelect.options[purposeSelect.selectedIndex];
            summaryPurpose.textContent = selectedOption ? selectedOption.text : 'Fondo General';
        }

        if (summaryTotal) {
            summaryTotal.textContent = `$${this.selectedAmount.toFixed(2)}`;
        }
    }

    processDonation() {
        if (this.selectedAmount <= 0) {
            this.showMessage('Por favor selecciona un monto válido', 'error');
            return;
        }

        const donorName = document.getElementById('donorName').value;
        const donationPurpose = document.getElementById('donationPurpose').value;
        const donationMessage = document.getElementById('donationMessage').value;

        // Show processing animation
        const donateBtn = document.getElementById('donateBtn');
        const originalText = donateBtn.innerHTML;
        donateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        donateBtn.disabled = true;

        // Simulate blockchain transaction
        setTimeout(() => {
            this.simulateBlockchainTransaction(donorName, donationPurpose, donationMessage);
            donateBtn.innerHTML = originalText;
            donateBtn.disabled = false;
        }, 3000);
    }

    simulateBlockchainTransaction(donorName, purpose, message) {
        // Generate transaction hash
        const transactionHash = this.generateTransactionHash();
        
        // Update stats
        this.totalDonations++;
        this.totalAmount += this.selectedAmount;
        if (this.paymentMethod === 'crypto') {
            this.cryptoDonations++;
        }

        // Save to localStorage
        this.saveStats();

        // Show success message
        this.showTransactionSuccess(transactionHash, donorName, purpose, message);

        // Reset form
        this.resetForm();
    }

    generateTransactionHash() {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    showTransactionSuccess(hash, donorName, purpose, message) {
        const successMessage = `
            <div class="transaction-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>¡Donación Procesada Exitosamente!</h4>
                <div class="transaction-details">
                    <p><strong>Hash de Transacción:</strong></p>
                    <div class="hash-display">
                        <span class="transaction-hash">${hash}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="blockchainDonations.copyHash('${hash}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p><strong>Monto:</strong> $${this.selectedAmount.toFixed(2)}</p>
                    <p><strong>Método:</strong> ${this.paymentMethod === 'crypto' ? 'Criptomonedas' : this.paymentMethod}</p>
                    <p><strong>Propósito:</strong> ${purpose}</p>
                    ${donorName ? `<p><strong>Donante:</strong> ${donorName}</p>` : ''}
                    ${message ? `<p><strong>Mensaje:</strong> ${message}</p>` : ''}
                </div>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="blockchainDonations.closeSuccessMessage()">
                        <i class="fas fa-check"></i> Entendido
                    </button>
                    <button class="btn btn-outline-primary" onclick="blockchainDonations.shareTransaction('${hash}')">
                        <i class="fas fa-share"></i> Compartir
                    </button>
                </div>
            </div>
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'blockchain-modal';
        modal.innerHTML = `
            <div class="modal-content">
                ${successMessage}
            </div>
        `;
        document.body.appendChild(modal);

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .blockchain-modal {
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
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                color: white;
                text-align: center;
                animation: slideIn 0.3s ease;
            }
            .success-icon {
                font-size: 4rem;
                color: #4CAF50;
                margin-bottom: 1rem;
            }
            .transaction-details {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                text-align: left;
            }
            .hash-display {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(0, 0, 0, 0.3);
                padding: 0.5rem;
                border-radius: 5px;
                margin: 0.5rem 0;
            }
            .transaction-hash {
                font-family: monospace;
                font-size: 0.8rem;
                word-break: break-all;
                flex: 1;
            }
            .success-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
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
    }

    copyHash(hash) {
        navigator.clipboard.writeText(hash).then(() => {
            this.showMessage('Hash copiado al portapapeles', 'success');
        });
    }

    copyAddress() {
        const address = document.getElementById('walletAddress').textContent;
        navigator.clipboard.writeText(address).then(() => {
            this.showMessage('Dirección copiada al portapapeles', 'success');
        });
    }

    shareTransaction(hash) {
        const shareText = `¡Acabo de hacer una donación a Iglesia Camino a Damasco! Hash de transacción: ${hash}`;
        if (navigator.share) {
            navigator.share({
                title: 'Donación Blockchain',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showMessage('Enlace copiado al portapapeles', 'success');
            });
        }
    }

    closeSuccessMessage() {
        const modal = document.querySelector('.blockchain-modal');
        if (modal) {
            modal.remove();
        }
    }

    resetForm() {
        this.selectedAmount = 0;
        this.paymentMethod = 'crypto';
        
        // Reset amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Reset custom amount
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
            customAmountInput.value = '';
        }

        // Reset payment method
        document.querySelectorAll('.payment-method').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.payment-method[data-method="crypto"]').classList.add('active');

        // Reset form fields
        document.getElementById('donorName').value = '';
        document.getElementById('donationPurpose').selectedIndex = 0;
        document.getElementById('donationMessage').value = '';

        this.updateSummary();
    }

    loadStats() {
        this.totalDonations = parseInt(localStorage.getItem('blockchainTotalDonations')) || 0;
        this.totalAmount = parseFloat(localStorage.getItem('blockchainTotalAmount')) || 0;
        this.cryptoDonations = parseInt(localStorage.getItem('blockchainCryptoDonations')) || 0;

        this.updateStatsDisplay();
    }

    saveStats() {
        localStorage.setItem('blockchainTotalDonations', this.totalDonations);
        localStorage.setItem('blockchainTotalAmount', this.totalAmount);
        localStorage.setItem('blockchainCryptoDonations', this.cryptoDonations);

        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const totalDonationsEl = document.getElementById('totalDonations');
        const totalAmountEl = document.getElementById('totalAmount');
        const cryptoDonationsEl = document.getElementById('cryptoDonations');

        if (totalDonationsEl) {
            totalDonationsEl.textContent = this.totalDonations;
        }
        if (totalAmountEl) {
            totalAmountEl.textContent = `$${this.totalAmount.toFixed(0)}`;
        }
        if (cryptoDonationsEl) {
            cryptoDonationsEl.textContent = this.cryptoDonations;
        }
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `blockchain-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add message styles
        const style = document.createElement('style');
        style.textContent = `
            .blockchain-message {
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
            .blockchain-message.success {
                background: rgba(76, 175, 80, 0.9);
            }
            .blockchain-message.error {
                background: rgba(244, 67, 54, 0.9);
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.blockchainDonations = new BlockchainDonations();
});

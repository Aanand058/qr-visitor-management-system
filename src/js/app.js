const App = {
    init() {
        this.setupForms();
        this.checkConfiguration();
    },

    checkConfiguration() {
        if (!window.WEB_APP_URL) {
            console.warn('WEB_APP_URL not configured, using local API endpoint');
        }
    },

    setupForms() {
        const visitorForm = document.getElementById("visitorForm");
        if (visitorForm) {
            visitorForm.addEventListener("submit", (e) => this.handleSubmit(e, "visitor"));
        }

        const parkingForm = document.getElementById("parkingForm");
        if (parkingForm) {
            parkingForm.addEventListener("submit", (e) => this.handleSubmit(e, "parking"));
            const licenseInput = document.getElementById("licensePlate");
            if (licenseInput) {
                licenseInput.addEventListener("input", function () {
                    this.value = this.value.toUpperCase();
                });
            }
        }
    },

    async handleSubmit(event, type) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const now = new Date();

        let data = {
            type,
            visitDate: now.toLocaleDateString(),
            visitTime: now.toLocaleTimeString()
        };

        formData.forEach((value, key) => {
            data[key] = key === "licensePlate" ? value.toUpperCase() : value;
        });

        // Show loading state immediately
        this.showMessage("⏳ Submitting, please wait...", "loading");

        try {
            const response = await fetch('/api/submit', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // Process response
            const result = await response.json();

            if (result.success) {
                this.showMessage("✅ " + (result.message || 'Form submitted successfully!'), 'success');
                form.reset();
            } else {
                this.showMessage("❌ " + (result.message || 'Error submitting form!'), 'error');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            this.showMessage("❌ Network error! Please try again.", "error");
        }
    },

    showMessage(message, type = "success") {
        this.clearMessages();
        const msgDiv = document.createElement("div");

        if (type === "success") {
            msgDiv.className = "success-message";
        } else if (type === "error") {
            msgDiv.className = "error-message";
        } else {
            msgDiv.className = "loading-message"; // New class for loading
        }

        msgDiv.textContent = message;
        const container = document.querySelector(".message-container");
        if (container) container.appendChild(msgDiv);
    },

    clearMessages() {
        document.querySelectorAll(".success-message, .error-message, .loading-message").forEach(msg => msg.remove());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

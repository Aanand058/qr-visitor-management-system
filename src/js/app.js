// src/js/app.js
const App = {
<<<<<<< HEAD
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbx5tFtVOTZw7-bvR6QS8VzZPO4iSz402UlzLnJzlXFV9-TAm5ubLBlOWZwe_SiQriL33Q/exec", // Replace with your Apps Script URL
=======
    WEB_APP_URL: window.WEB_APP_URL || '', // Fallback to local API endpoint
   
>>>>>>> 13d1371 (worked on .env setup and server)

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
        if (visitorForm) visitorForm.addEventListener("submit", (e) => this.handleSubmit(e, "visitor"));

        const parkingForm = document.getElementById("parkingForm");
        if (parkingForm) {
            parkingForm.addEventListener("submit", (e) => this.handleSubmit(e, "parking"));

            const licenseInput = document.getElementById("licensePlate");
            if (licenseInput) licenseInput.addEventListener("input", function () {
                this.value = this.value.toUpperCase();
            });
        }
    },

    async handleSubmit(event, type) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const now = new Date();

        let data = { type, visitDate: now.toLocaleDateString(), visitTime: now.toLocaleTimeString() };
        formData.forEach((value, key) => data[key] = key === "licensePlate" ? value.toUpperCase() : value);

        // Show loading state immediately
        this.showMessage("⏳ Submitting, please wait...", "loading");


        try {
            // Use local API endpoint for better error handling and validation
            const response = await fetch('/api/submit', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage(result.message || 'Form submitted successfully!', 'success');
                form.reset();
                
            } else {
                this.showMessage(result.message || 'Error submitting form!', 'error');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            this.showMessage("Network error! Please try again.", "error");
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


// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD

    // Visitor form
    const visitorForm = document.getElementById('visitorForm');
    if (visitorForm) {
      visitorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const now = new Date();
        const data = {
          type: 'Visitor',
          name: document.getElementById('visitorName').value,
          residentName: document.getElementById('residentName').value,
          unitNo: document.getElementById('unitNo').value,
          phone: document.getElementById('visitorPhone').value,
          visitDate: now.toLocaleDateString(),
          visitTime: now.toLocaleTimeString()
        };
        try {
          const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if(result.success){
            alert('Visitor Entry submitted!');
            e.target.reset();
          } else {
            alert('Error: ' + (result.error || 'Unknown error'));
          }
        } catch(err) {
          console.error('Error submitting visitor:', err);
          alert('Failed to submit visitor entry.');
        }
      });
    }
  
    // Parking form
    const parkingForm = document.getElementById('parkingForm');
    if (parkingForm) {
      parkingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const now = new Date();
        const data = {
          type: 'Parking',
          visitorName: document.getElementById('visitorName').value,
          residentName: document.getElementById('residentName').value,
          unitNo: document.getElementById('unitNo').value,
          carMake: document.getElementById('carMake').value,
          carModel: document.getElementById('carModel').value,
          carColor: document.getElementById('carColor').value,
          licensePlate: document.getElementById('licensePlate').value.toUpperCase(),
          visitDate: now.toLocaleDateString(),
          visitTime: now.toLocaleTimeString()
        };
        try {
          const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if(result.success){
            alert('Parking Permit submitted!');
            e.target.reset();
          } else {
            alert('Error: ' + (result.error || 'Unknown error'));
          }
        } catch(err) {
          console.error('Error submitting parking:', err);
          alert('Failed to submit parking permit.');
        }
      });
    }
  
  });
=======
    App.init();
});
>>>>>>> 13d1371 (worked on .env setup and server)
  
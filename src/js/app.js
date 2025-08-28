// src/js/app.js
const App = {
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbx5tFtVOTZw7-bvR6QS8VzZPO4iSz402UlzLnJzlXFV9-TAm5ubLBlOWZwe_SiQriL33Q/exec", // Replace with your Apps Script URL

    init() { this.setupForms(); },

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

        try {
            const response = await fetch(this.WEB_APP_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            this.showMessage(result.message, result.success ? "success" : "error");
            if (result.success) form.reset();
        } catch (err) {
            console.error(err);
            this.showMessage("Error submitting form!", "error");
        }
    },

    showMessage(message, type = "success") {
        this.clearMessages();
        const msgDiv = document.createElement("div");
        msgDiv.className = type === "success" ? "success-message" : "error-message";
        msgDiv.textContent = message;
        const container = document.querySelector(".message-container");
        if (container) container.appendChild(msgDiv);
    },

    clearMessages() {
        document.querySelectorAll(".success-message, .error-message").forEach(msg => msg.remove());
    }
};

// document.addEventListener("DOMContentLoaded", () => App.init());

//Diaglog Box
function showConfirmation(message = 'Form submitted successfully!') {
    const dialog = document.getElementById('confirmationDialog');
    const dialogMsg = document.getElementById('dialogMessage');
    const closeBtn = document.getElementById('closeDialog');

    if(dialog && dialogMsg && closeBtn) {
        dialogMsg.textContent = message;
        dialog.style.display = 'flex';

        closeBtn.onclick = () => {
            dialog.style.display = 'none';
        };

        // Optionally auto-close after 3 seconds
        setTimeout(() => { dialog.style.display = 'none'; }, 3000);
    }
}


document.addEventListener('DOMContentLoaded', () => {

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
  
// loading-dialog.js

// Initialize dialog functions and form handlers
function showLoading() {
    const overlay = document.getElementById("overlay");
    const spinner = document.getElementById("spinner");
    const status = document.getElementById("status");
    const closeBtn = document.getElementById("closeBtn");
    
    overlay.style.display = "block";
    spinner.style.display = "block";
    closeBtn.style.display = "none";
    status.textContent = "Submitting...";
    status.style.color = "#000000"; // black
  }
  
  function showSuccess() {
    const spinner = document.getElementById("spinner");
    const status = document.getElementById("status");
    const closeBtn = document.getElementById("closeBtn");
    
    spinner.style.display = "none";
    closeBtn.style.display = "inline-block";
    status.textContent = "✅ Submitted successfully!";
    status.style.color = "#000000"; // black
  }
  
  // You can add showError() if needed 
  function showError() {
    const spinner = document.getElementById("spinner");
    const status = document.getElementById("status");
    const closeBtn = document.getElementById("closeBtn");
    
    spinner.style.display = "none";
    closeBtn.style.display = "inline-block";
    status.textContent = "❌ Error occurred. Please try again.";
    status.style.color = "#000000"; // black
  }
  
  function hide() {
    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }
  
  // Initialize form listeners and close button
  document.addEventListener("DOMContentLoaded", () => {
    // Form event handling
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        showLoading();
  
        // Simulate API call or replace with real fetch
        setTimeout(() => {
          showSuccess();
          form.reset();
        }, 2000);
      });
    });
  
    // Close button
    const closeBtn = document.getElementById("closeBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        hide();
      });
    }
  });
  
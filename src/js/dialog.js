// dialog.js

/**
 * Show a confirmation dialog with a custom message
 * @param {string} message - The message to display
 * @param {number} autoCloseMs - Optional auto-close duration in ms (default 3000)
 */
function showConfirmation(message = 'Form submitted successfully!', autoCloseMs = 3000) {
    const dialog = document.getElementById('confirmationDialog');
    const dialogMsg = document.getElementById('dialogMessage');
    const closeBtn = document.getElementById('closeDialog');

    if (!dialog || !dialogMsg || !closeBtn) {
        console.warn('Dialog elements not found in DOM.');
        return;
    }

    dialogMsg.textContent = message;
    dialog.style.display = 'flex';

    closeBtn.onclick = () => {
        dialog.style.display = 'none';
    };

    if (autoCloseMs > 0) {
        setTimeout(() => {
            dialog.style.display = 'none';
        }, autoCloseMs);
    }
}

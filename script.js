// Function to update the countdown
function updateCountdown() {
    let seconds = 10;
    const countdownElement = document.getElementById('countdown');
    
    // Update the countdown every second
    const countdownInterval = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            location.reload(); // Refresh the page
        }
    }, 1000);
}

// Function to display current time
function displayCurrentTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

// Set up the auto-refresh
function setupAutoRefresh() {
    displayCurrentTime();
    updateCountdown();
    
    // Set the main refresh (as a backup in case countdown fails)
    setTimeout(() => {
        location.reload();
    }, 10000); // 10 seconds
}

// Initialize when page loads
window.onload = setupAutoRefresh;

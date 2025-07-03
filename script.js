// Set last refresh time
const now = new Date();
document.getElementById('last-refresh').textContent = now.toLocaleTimeString();

// Generate random data for demonstration
function generateRandomData() {
    // Update visitor count
    const visitors = Math.floor(Math.random() * 100) + 100;
    document.getElementById('visitors').textContent = visitors;
    
    // Update live data
    const liveData = Math.floor(Math.random() * 1000);
    document.getElementById('live-data').textContent = liveData;
    
    // Update stats
    document.getElementById('stat1').textContent = Math.floor(Math.random() * 500) + 200;
    document.getElementById('stat2').textContent = Math.floor(Math.random() * 10000) + 5000;
    document.getElementById('stat3').textContent = Math.floor(Math.random() * 1000000).toLocaleString();
    document.getElementById('stat4').textContent = Math.floor(Math.random() * 500) + 100;
    
    // Random uptime between 99.8% and 99.99%
    const uptime = (99.8 + Math.random() * 0.19).toFixed(2);
    document.getElementById('uptime').textContent = uptime + '%';
}

// Initialize timer
let seconds = 10;
const timerElement = document.getElementById('timer');
const refreshSecondsElement = document.getElementById('refresh-seconds');

function updateTimer() {
    seconds--;
    timerElement.textContent = seconds;
    refreshSecondsElement.textContent = seconds;
    
    if (seconds <= 0) {
        // Refresh the page
        location.reload();
    }
}

// Initialize the page
function init() {
    generateRandomData();
    
    // Update timer every second
    setInterval(updateTimer, 1000);
    
    // Update data every 3 seconds to show live changes
    setInterval(generateRandomData, 3000);
}

// Start when page loads
window.onload = init;

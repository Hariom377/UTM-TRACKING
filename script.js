// Feature 1: Social Templates
document.getElementById('platform-select').addEventListener('change', (e) => {
  const platform = e.target.value;
  if (!platform) return;
  
  const presets = {
    instagram: { source: 'instagram', medium: 'story' },
    tiktok: { source: 'tiktok', medium: 'video' },
    youtube: { source: 'youtube', medium: 'shorts' }
  };
  
  document.getElementById('utm-source').value = presets[platform].source;
  document.getElementById('utm-medium').value = presets[platform].medium;
  updateUTM();
});

// Feature 2: Emoji Campaign Generator
document.getElementById('generate-campaign').addEventListener('click', () => {
  const emojis = ['🚀', '🔥', '🎯', '✨', '💡', '🌟', '📈', '🫶'];
  const words = ['viral', 'boost', 'trend', 'growth', 'win', 'success', 'impact'];
  
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const year = new Date().getFullYear();
  
  const campaignName = `${randomWord}_${randomEmoji}_${year}`;
  document.getElementById('utm-campaign').value = campaignName;
  document.getElementById('campaign-result').textContent = campaignName;
  updateUTM();
});

// Feature 5: Link Health Check
function validateUTM() {
  const source = document.getElementById('utm-source').value;
  const campaign = document.getElementById('utm-campaign').value;
  const healthEl = document.getElementById('health-check');
  
  let message = '✅ Parameters look good!';
  let bgColor = '#4caf50';
  
  if (!source || !campaign) {
    message = '⚠️ Source and Campaign are required!';
    bgColor = '#ff9800';
  } else if (source.includes(' ')) {
    message = '❌ Use underscores instead of spaces (e.g., instagram_story)';
    bgColor = '#f44336';
  }
  
  healthEl.textContent = message;
  healthEl.style.backgroundColor = bgColor;
}

// Core UTM Generator
function updateUTM() {
  validateUTM();
  
  const baseUrl = document.getElementById('base-url').value;
  const source = document.getElementById('utm-source').value;
  const medium = document.getElementById('utm-medium').value;
  const campaign = document.getElementById('utm-campaign').value;
  
  if (!baseUrl) return;
  
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign
  });
  
  const trackedUrl = `${baseUrl}?${params.toString()}`;
  document.getElementById('generated-url').textContent = trackedUrl;
  
  // Feature 4: Update QR Code
  document.getElementById('qrcode').innerHTML = '';
  new QRCode(document.getElementById('qrcode'), {
    text: trackedUrl,
    width: 160,
    height: 160,
    colorDark: '#ffffff',
    colorLight: 'transparent'
  });
}

// Feature 3: One-Click Sharing
document.querySelectorAll('.sharing-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    const platform = button.dataset.platform;
    const text = "Check out this tracked link I made!";
    const url = document.getElementById('generated-url').textContent;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  });
});

// Initialize
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', updateUTM);
});
updateUTM();

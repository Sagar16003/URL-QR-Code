// Detect environment and set API base URL
let API_BASE_URL = 'http://localhost:3000'; // Default to local backend

// Check if running in production (not localhost/127.0.0.1)
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  // REPLACE THIS WITH YOUR RENDER BACKEND URL AFTER DEPLOYMENT
  // Example: API_BASE_URL = 'https://my-qr-backend.onrender.com';
  console.warn('Production environment detected. Please update API_BASE_URL in QR-Code-Generator.js');
  API_BASE_URL = 'https://YOUR-RENDER-BACKEND-URL.onrender.com';
}

// Function to validate URL using regular expression
function isValidURL(url) {
  var urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

// Function to generate QR code based on user input
async function generateQR() {
  // Get the value of the input field and trim any leading or trailing whitespace
  var url = document.getElementById("urlInput").value.trim();
  // Get the error message div element
  var errorMessageDiv = document.getElementById("errorMessage");
  // Get the QR code div element
  var qrCodeDiv = document.getElementById("qrcode");

  // Clear previous state
  qrCodeDiv.innerHTML = "";
  errorMessageDiv.textContent = "";

  // Check if the input field is not empty
  if (url !== "") {
    // If the URL is valid
    if (isValidURL(url)) {
      try {
        // Show loading state (optional, but good UX)
        qrCodeDiv.innerHTML = "Generating one-time link...";

        // Call Backend API
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
          throw new Error('Server error');
        }

        const data = await response.json();
        const trackingUrl = data.trackingUrl;

        // Clear loading text
        qrCodeDiv.innerHTML = "";

        // Generate a new QR code based on the TRACKING URL
        new QRCode(qrCodeDiv, trackingUrl);

        // Optional: Display the link for text copying
        const linkDisplay = document.createElement('p');
        linkDisplay.style.fontSize = '12px';
        linkDisplay.style.wordBreak = 'break-all';
        linkDisplay.innerText = `One-time link: ${trackingUrl}`;
        qrCodeDiv.appendChild(linkDisplay);

      } catch (error) {
        console.error(error);
        errorMessageDiv.textContent = "Failed to generate one-time link. Is the backend running? " + error.message;
        qrCodeDiv.innerHTML = "";
      }
    } else {
      // If the URL is not valid, display an error message
      errorMessageDiv.textContent = "Please enter a valid URL. Like https://www.google.com/";
    }
  } else {
    // If the input field is empty, display an error message
    errorMessageDiv.textContent = "Please enter a URL.";
  }
}

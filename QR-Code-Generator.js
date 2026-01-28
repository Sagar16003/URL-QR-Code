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
        const response = await fetch('http://localhost:3000/api/generate', {
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
        errorMessageDiv.textContent = "Failed to generate one-time link. Is the backend running?";
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

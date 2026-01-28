# One-Time Scan QR Code Generator

A full-stack web application that generates QR codes for **one-time use** links. Once a link is scanned or visited, it expires and cannot be accessed again.

## Features

*   **One-Time Use Links**: Securely redirects users to a target URL only once.
*   **Auto-Expiry**: Subsequent visits show a "Link Expired" message.
*   **Mobile Friendly**: Automatically detects your computer's LAN IP so QR codes work on mobile devices connected to the same Wi-Fi.
*   **Clean UI**: Responsive design for generating codes.

## Prerequisites

*   [Node.js](https://nodejs.org/) (installed on your machine)

## Installation & Setup

1.  **Clone or Download** this repository.
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```

## How to Run

1.  **Start the Backend Server**:
    Inside the `backend` folder, run:
    ```bash
    node server.js
    ```
    You should see a message like: `Server running on http://192.168.x.x:3000`

2.  **Open the Frontend**:
    Open the `index.html` file in the root directory using your web browser.

3.  **Generate a QR Code**:
    *   Enter a destination URL (e.g., `https://www.google.com`).
    *   Click **Generate QR Code**.
    *   Scan the QR code with your phone (ensure your phone is on the same Wi-Fi).

## Project Structure

*   **/backend**: Node.js/Express server that handles link generation and tracking.
    *   `server.js`: Main server logic.
    *   `tokenStore`: In-memory storage for tracking active links.
*   **index.html**: Main user interface.
*   **QR-Code-Generator.js**: Frontend logic to communicate with the backend.
*   **style.css**: Application styling.

## Troubleshooting

*   **"Failed to generate one-time link"**: Ensure the backend server is running (`node server.js`).
*   **Link not opening on phone**: Make sure your phone and computer are on the same Wi-Fi network. The server attempts to automatically detect your local IP.

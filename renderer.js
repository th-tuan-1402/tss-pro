

const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // Window controls
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            ipcRenderer.send('minimize-window');
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            ipcRenderer.send('maximize-window');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            ipcRenderer.send('close-window');
        });
    }

    // Authentication
    const loginButton = document.getElementById('login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            // Open the Google OAuth login page in the default browser
            window.open('http://localhost:57896/auth/google', '_blank');
        });
    }

    ipcRenderer.on('auth-token', (event, token) => {
        console.log('Received auth token in renderer:', token);
        localStorage.setItem('jwt_token', token);
        // You might want to update the UI or redirect the user here
        alert('Authentication successful!');
        // Example: update a status element
        const authStatus = document.getElementById('auth-status');
        if (authStatus) {
            authStatus.textContent = 'Authenticated';
            authStatus.style.color = 'green';
        }
    });

    // Check for existing token on load
    const existingToken = localStorage.getItem('jwt_token');
    const authStatus = document.getElementById('auth-status');
    if (existingToken) {
        console.log('Found existing JWT:', existingToken);
        if (authStatus) {
            authStatus.textContent = 'Authenticated (token found)';
            authStatus.style.color = 'green';
        }
    } else {
        if (authStatus) {
            authStatus.textContent = 'Not Authenticated';
            authStatus.style.color = 'red';
        }
    }


    // Example of a button click handler
    const startTtsButton = document.querySelector('.action-button.start-tts');
    if (startTtsButton) {
        startTtsButton.addEventListener('click', () => {
            const textInput = document.querySelector('.input-area textarea').value;
            console.log('Start TTS clicked with text:', textInput);
            // Here you would integrate with your TTS logic, potentially sending the JWT
        });
    }

    const stopTtsButton = document.querySelector('.action-button.stop-tts');
    if (stopTtsButton) {
        stopTtsButton.addEventListener('click', () => {
            console.log('Stop TTS clicked');
        });
    }

    const uploadFileButton = document.querySelector('.button-group .upload-file');
    if (uploadFileButton) {
        uploadFileButton.addEventListener('click', () => {
            console.log('Upload File clicked');
            // Implement file upload logic
        });
    }

    const deleteContentButton = document.querySelector('.button-group .delete-content');
    if (deleteContentButton) {
        deleteContentButton.addEventListener('click', () => {
            const textarea = document.querySelector('.input-area textarea');
            if (textarea) {
                textarea.value = ''; // Clear the textarea
                console.log('Content deleted');
            }
        });
    }

    // Add similar event listeners for other interactive elements as needed
});


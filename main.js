console.log('Hello World!');
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById('chatInput');
const chatbox = document.getElementById('chatbox');

async function displayMessage(message, isUser) {
    const msgElem = document.createElement('div');
    msgElem.textContent = message;
    msgElem.className = `chat-message ${isUser ? 'user-message' : 'assistant-message'}`;
    chatbox.appendChild(msgElem);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    
    // For assistant messages, add a slight delay before displaying
    if (!isUser) {
        msgElem.style.opacity = 0; // Start with opacity 0
        await new Promise(resolve => setTimeout(resolve, 300)); // Delay
        msgElem.style.opacity = 1; // Fade in
    }
}

async function callApi(apiUrl, prompt) {
    chatInput.value = "Typing...";
    chatInput.disabled = true;
    sendButton.disabled = true;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt})
    });

    chatInput.value = "";
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();
    return response.json();
}

chatInput.focus();

sendButton.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    displayMessage(message, true);
    chatInput.value = '';

    const apiUrl = message.startsWith('/image') ? 
        'https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==' : 
        'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==';

    try {
        const data = await callApi(apiUrl, message);
        if (data.status === 'success') {
            displayMessage(data.text, false);
        } else {
            displayMessage('An error occurred. Please try again.', false);
        } 
    } catch (error) {
        console.error('Error:', error);
displayMessage('An error occurred. Please try again.', false);
}
});

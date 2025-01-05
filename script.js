document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messageList = document.getElementById('messageList');
    const typingIndicator = document.getElementById('typingIndicator');

   
    function addMessage(text, isSent) {
        // Remove typing indicator first
        messageList.removeChild(typingIndicator);
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isSent ? 'sent' : 'received');
        messageDiv.textContent = text;
        messageList.appendChild(messageDiv);
        
        // Add typing indicator back at the end
        messageList.appendChild(typingIndicator);
        messageList.scrollTop = messageList.scrollHeight;
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
        messageList.scrollTop = messageList.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    async function handleSendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, true);
            messageInput.value = '';
            
            showTypingIndicator();
            
            try {
                const response = await fetch('http://localhost:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: message })
                });
                
                const data = await response.json();
                hideTypingIndicator();
                addMessage(data.response, false);
            } catch (error) {
                console.error('Error:', error);
                hideTypingIndicator();
                addMessage('Sorry, something went wrong!', false);
            }
        }
    }

    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});

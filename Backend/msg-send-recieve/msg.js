// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL1oILjLAoM3UN88th5E2LTrPW17ryc5c",
  authDomain: "web-whatsapp-clone-c0997.firebaseapp.com",
  projectId: "web-whatsapp-clone-c0997",
  storageBucket: "web-whatsapp-clone-c0997.appspot.com",
  messagingSenderId: "889809506152",
  appId: "1:889809506152:web:4bd5897128b6ce691c50dd",
  measurementId: "G-Q13M79JRQY",
};

// Check if Firebase is not initialized before initializing it
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const uidvalue = localStorage.getItem('phonenumber');
console.log(uidvalue);
const firestore = firebase.firestore();
const currentUserUID = uidvalue; // Replace with the UID of the logged-in user



document.addEventListener('DOMContentLoaded', function () {
  const messageInput = document.getElementById('message-input');
  const chatContainer = document.getElementById('rightmsgcontainer');
  const selectedUserId = sessionStorage.getItem('selectedUserPhoneNumber');
  const currentUserUID = localStorage.getItem('phonenumber');

 // Function to send a message
function sendMessage(messageText) {
  console.log('Sending message:', messageText);

  // Assuming you have a collection 'Messages' in Firestore
  const messagesCollection = firestore.collection('Messages');

  // Add the message to the 'Messages' collection
  const newMessageRef = messagesCollection.doc();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const messageData = {
      sender: currentUserUID,
      text: messageText,
      members: [currentUserUID, selectedUserId],
      timestamp: timestamp,
  };

  // Use set with merge to update the timestamp once it's received from the server
  newMessageRef.set(messageData, { merge: true }).then(() => {
      // Wait for the write operation to complete, then update the UI
      newMessageRef.get().then((doc) => {
          if (doc.exists) {
              const timestampFromServer = doc.data().timestamp;

              // Now, update the 'Conversations' collection with the last message
              const conversationsCollection = firestore.collection('Conversations');

              // Construct the conversation ID using the user IDs
              const conversationID = [currentUserUID, selectedUserId].sort().join('_');

              // Get the conversation document reference
              const conversationRef = conversationsCollection.doc(conversationID);

              // Update the 'lastMessage' field in the 'Conversations' collection
              conversationRef.set({
                  lastMessage: {
                      sender: currentUserUID,
                      text: messageText,
                      timestamp: timestampFromServer,
                  },
                  members: [currentUserUID, selectedUserId],
              }, { merge: true }).then(() => {
                  // Message sent successfully, you can perform any additional actions here
                  console.log('Message sent successfully');

                  // Update local storage with the new message
                  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
                  const newMessage = {
                      text: messageText,
                      sender: currentUserUID,
                      timestamp: timestampFromServer.toDate(), // Convert the server timestamp to a Date object
                  };
                  chatHistory.push(newMessage);
                  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

                  // Update UI to display the sent message
                  displayMessageWithTimestamp(messageText, 'msgfromuserleftspan', timestampFromServer.toDate());
              });
          }
      });
  });
}

// Function to format a timestamp
function formatTimestamp(timestamp) {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(timestamp);
}


// Function to display a message with timestamp
function displayMessageWithTimestamp(message, cssClass, timestamp) {
  console.log('Displaying message:', message);
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add(cssClass);

  const timestampElement = document.createElement('p');
  timestampElement.textContent = formatTimestamp(timestamp);
  timestampElement.classList.add(cssClass === 'msgfromuserleftspan' ? 'timestampsender' : 'timestampreceiver');

  messageElement.appendChild(timestampElement);

  // Check if the message is from the current user, and update the CSS class accordingly
  if (cssClass === 'msgfromuserleftspan') {
      chatContainer.appendChild(messageElement);
  } else {
      const rightContainer = document.getElementById('rightmsgcontainer');
      rightContainer.appendChild(messageElement);
  }

  console.log('Message displayed in UI:', message);
}



  messageInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const messageText = this.value.trim();
      if (messageText !== '') {
        sendMessage(messageText);
        this.value = ''; // Clear the input field
      }
    }
  });

  // Listen for incoming messages
  const conversationID = [currentUserUID, selectedUserId].sort().join('_');
  firebase.firestore().collection('Conversations')
    .doc(conversationID)
    .onSnapshot((doc) => {
      if (doc.exists) {
        const conversationData = doc.data();
        const lastMessage = conversationData.lastMessage;
        if (lastMessage.sender === selectedUserId) {
          displayMessageWithTimestamp(lastMessage.text, 'msgfromuserrightspan', new Date());
        }
      }
    });

  // Load chat history when the page loads
  // Function to load chat history
function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  console.log('Chat History:', chatHistory);

  chatHistory.forEach((message) => {
      console.log('Loading message from history:', message);
      displayMessageWithTimestamp(
          message.text,
          message.sender === currentUserUID ? 'msgfromuserleftspan' : 'msgfromuserrightspan',
          message.timestamp
      );
  });
}

});

document.addEventListener('DOMContentLoaded', function () {
    const currentUserUID = localStorage.getItem('phonenumber');
    const selectedUserId = sessionStorage.getItem('selectedUserPhoneNumber');

    // Function to update the active connections for the sender
    function updateActiveConnections(senderUID, receiverUID) {
        const activeConnectionsCollection = firebase.firestore().collection('ActiveConnections');
        const connectionID = [senderUID, receiverUID].sort().join('_');
        const connectionRef = activeConnectionsCollection.doc(connectionID);

        connectionRef.set({
            receiver: receiverUID,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    // Function to load active connections for the sender
    function loadActiveConnections(senderUID) {
        const activeConnectionsCollection = firebase.firestore().collection('ActiveConnections');

        // Query active connections for the sender
        activeConnectionsCollection
            .where('sender', '==', senderUID)
            .onSnapshot((querySnapshot) => {
                const pinnedProfileContainer = document.getElementById('pinned-profile-container');
                pinnedProfileContainer.innerHTML = ''; // Clear previous pinned profiles

                // Update the UI with the active connections
                querySnapshot.forEach((doc) => {
                    const connectionData = doc.data();
                    const receiverUID = connectionData.receiver;

                    // // Update UI to display the pinned profile
                    // displayPinnedProfile(receiverUID);
                });
            });
    }

    // // Function to display the pinned profile in the UI
    // function displayPinnedProfile(receiverUID) {
    //     const pinnedProfileContainer = document.getElementById('pinned-profile-container');
    //     const pinnedProfileTemplate = `
    //     <div class="pinned-profile">
    //       <p>${receiverUID}</p>
    //     </div>
    //   `;

    //     // Append the pinned profile to the container
    //     pinnedProfileContainer.innerHTML += pinnedProfileTemplate;
    // }

    // Example: Listen for incoming messages (adjust according to your structure)
    const conversationID = [currentUserUID, selectedUserId].sort().join('_');
    firebase.firestore().collection('Conversations')
        .doc(conversationID)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const conversationData = doc.data();
                const lastMessage = conversationData.lastMessage;
                if (lastMessage.sender === selectedUserId) {
                    // Update the active connections for the sender
                    updateActiveConnections(currentUserUID, selectedUserId);

                    // Load active connections for the sender
                    loadActiveConnections(currentUserUID);
                }
            }
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const currentUserUID = localStorage.getItem('phonenumber');

    // Function to update the pinned profiles for the sender
    function updatePinnedProfiles(senderUID, receiverUID) {
        const pinnedProfilesContainer = document.querySelector('.left');

        if (!pinnedProfilesContainer) {
            console.error("Pinned profiles container not found.");
            return;
        }

        const profileID = 'profile-' + receiverUID;

        // Check if the profile already exists in the pinned list
        if (!profileExistsInUI(profileID)) {
            // Append a new profile to the pinned list
            appendProfileToHomeScreen(pinnedProfilesContainer, profileID, receiverUID);

            // Log the message
            console.log(`Profile for ${receiverUID} has been pinned.`);
        }
    }

    // Function to check if the profile already exists in the UI
    function profileExistsInUI(profileID) {
        return document.getElementById(profileID) !== null;
    }

    // Function to append the profile to the home screen
    function appendProfileToHomeScreen(container, profileID, receiverUID) {
        const userData = getUserData(receiverUID);

        if (userData) {
            const profileElement = document.createElement('div');
            profileElement.classList.add('user');
            profileElement.setAttribute('id', profileID);

            profileElement.innerHTML = `
            <div class="user">
                <div class="userimg">
                    <img src="${userData.photoURL}" alt="Profile Image">
                </div>
                <div class="usernamediv">
                    <span class="username">${userData.name}</span>
                    <span class="lastmsg">${userData.lastMessage}</span>

                </div>
                <div class="lasttimemsgbadge">
                <span>${userData.timestamp}</span>
               </div>
                </div>
            `;

            container.appendChild(profileElement);
        }
    }

    // Function to get user data based on UID (replace this with your actual function)
    function getUserData(uid) {
        // Implement your logic to fetch user data from Firestore or any other source
        // Return an object with user details (e.g., { name: 'John Doe', photoURL: 'path/to/image.jpg' })
       const urlofsender = localStorage.getItem('userPhotoURL');
       const usernumber = localStorage.getItem('phonenumber');

        return {
            name: usernumber,
            photoURL: urlofsender,
        };
    }

    // Example: Listen for incoming messages (adjust according to your structure)
    const selectedUserId = sessionStorage.getItem('selectedUserPhoneNumber');

    firebase.firestore().collection('Conversations')
        .doc([currentUserUID, selectedUserId].sort().join('_'))
        .onSnapshot((doc) => {
            if (doc.exists) {
                const conversationData = doc.data();
                const lastMessage = conversationData.lastMessage;
                if (lastMessage.sender === selectedUserId) {
                    // Update the pinned profiles for the sender
                    updatePinnedProfiles(currentUserUID, selectedUserId);
                }
            }
        });
});

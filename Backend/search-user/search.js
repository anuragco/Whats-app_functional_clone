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
  
  // Initialize Firebase (your config remains the same)
  firebase.initializeApp(firebaseConfig);
  
  // Assuming you already have Firebase initialized
  
  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.querySelector('.user');
    const headerProfileImage = document.querySelector('.headerprofileimage img');
    const headerUsername = document.querySelector('.headerusername');
  
    // Event listener for search input
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.trim();
  
      // Call the function to search for users based on the query
      searchUsersByMobile(query);
    });
  
    // Event delegation for the click on the user container
    searchResultsContainer.addEventListener('click', function (event) {
      const userContainer = event.target.closest('.user');
      if (userContainer) {
        const userData = userContainer.dataset.userData;
        updateHeaderProfile(JSON.parse(userData));
      }
    });
  
    function searchUsersByMobile(query) {
      const firestore = firebase.firestore();
  
      // Query Firestore for users with mobile numbers matching the query
      firestore.collection('users')
        .where('phoneNumber', '==', query)
        .get()
        .then((querySnapshot) => {
          searchResultsContainer.innerHTML = ''; // Clear previous results
  
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            console.log('UserData from Firestore:', userData); // Log the userData
            displaySearchResult(userData);
          });
  
          if (querySnapshot.empty) {
            displaySearchResult(null); // Display a message for no results
          }
        })
        .catch((error) => {
          console.error('Error searching users:', error);
        });
    }
  
    function displaySearchResult(userData) {
      const userContainer = document.createElement('div');
      userContainer.classList.add('user');
  
      if (userData) {
        // Update user information if found
        userContainer.innerHTML = `
                  <div class="userimg">
                      <img src="${userData.photoURL}" alt="Profile Image">
                  </div>
  
                  <div class="usernamediv">
                      <span class="username">${userData.name}</span>
                  </div>
              `;
        // Store user data as a data attribute
        userContainer.dataset.userData = JSON.stringify(userData);
        if ('uid' in userData) {
          // Store the user ID in localStorage
          localStorage.setItem('selectedUserId', userData.uid);
        } else {
          console.error('UID not found in userData:', userData);
        }
  
      } else {
        // Display a message for no results
        userContainer.textContent = 'User not found.';
        console.log('User not found.');
      }
  
      searchResultsContainer.appendChild(userContainer);
    }
  
    function updateHeaderProfile(userData) {
      headerProfileImage.src = userData.photoURL;
      headerUsername.innerText = userData.name;
      
      // Clear the search input value
      const profilesearcchcontainer = document.getElementById('search-input');
      profilesearcchcontainer.value = '';
  
      // Store the phoneNumber in sessionStorage
      sessionStorage.setItem('selectedUserPhoneNumber', userData.phoneNumber);
      
      // For additional debugging, log the entire userData object
      console.log('userData:', userData);
  }
  
  
    // Add your existing code for chat functionality here
  });
  
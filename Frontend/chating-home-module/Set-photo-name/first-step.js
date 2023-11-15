// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAL1oILjLAoM3UN88th5E2LTrPW17ryc5c",
    authDomain: "web-whatsapp-clone-c0997.firebaseapp.com",
    projectId: "web-whatsapp-clone-c0997",
    storageBucket: "web-whatsapp-clone-c0997.appspot.com",
    messagingSenderId: "889809506152",
    appId: "1:889809506152:web:4bd5897128b6ce691c50dd",
    measurementId: "G-Q13M79JRQY",
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  document.addEventListener("DOMContentLoaded", () => {
    const isloginpresent = localStorage.getItem('islogin')

    if(!isloginpresent){
      window.location.href= '../../Login-Module/initial-screen/home.html'
    }
  })
  
  // Event listener for file input change
  document.getElementById('file-input').addEventListener('change', handleFileInputChange);
  
  // Event listener for image container click
  document.getElementById('image-container').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  
  // Event listener for the last verify button click
  document.getElementById('last-verify-button').addEventListener('click', handleLastVerifyButtonClick);
  
  // Handle file input change
  function handleFileInputChange(event) {
    const selectedImage = document.getElementById('selected-image');
    const fileInputContainer = document.getElementById('file-input-container');
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log('Selected file:', file);
  
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        selectedImage.src = e.target.result;
        selectedImage.style.display = 'block';
        fileInputContainer.style.display = 'none'; // Hide the file input container
  
        // Assume you have a Firebase Storage reference
        const storageRef = firebase.storage().ref();
  
        // Create a unique path for the image in storage
        const imagePath = `profile_images/${new Date().getTime()}_${file.name}`;
  
        // Upload the image to Firebase Storage
        const imageRef = storageRef.child(imagePath);
        imageRef.put(file)
          .then(handleImageUpload)
          .catch(handleImageUploadError);
      };
  
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid JPG or PNG image.');
      fileInput.value = '';
    }
  }
  
  // Handle image upload success
  function handleImageUpload(snapshot) {
    // Image uploaded successfully, get the public URL
    snapshot.ref.getDownloadURL()
      .then((downloadURL) => {
        // Store the downloadURL in localStorage
        localStorage.setItem('ProfileImage', downloadURL);
      })
      .catch((error) => {
        console.error('Error getting download URL:', error);
      });
  }
  
  // Handle image upload error
  function handleImageUploadError(error) {
    console.error('Error uploading image:', error.code, error.message);
    // Additional error handling if needed
}

  
 // Handle last verify button click
function handleLastVerifyButtonClick(event) {
  event.preventDefault();
  console.log('Handling last verify button click...');

  const username = document.getElementById('user-name').value;
  console.log('Username:', username);
  localStorage.setItem('Name', username);

  // Retrieve data from localStorage
  const name = localStorage.getItem('Name');
  const photoURL = localStorage.getItem('ProfileImage');
  const phoneNumber = localStorage.getItem('phonenumber');

  const firestore = firebase.firestore();
  
  // Use an observer to get the current user
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
          const uid = user.uid; // Get the UID of the authenticated user

          // Use the UID as the document ID in Firestore
          const userDocRef = firestore.collection('users').doc(uid);

          // Set user data in Firestore
          userDocRef.set({
              name: name,
              photoURL: photoURL,
              phoneNumber: phoneNumber,
              uid: phoneNumber,
          }, { merge: true })
              .then(() => {
                  console.log('Data stored successfully');
                  // Redirect to another page after successful set
                  window.location.href = '../Set-photo-name/Mainhome/web.html?success=true';
              })
              .catch((error) => {
                  console.error('Error creating document: ', error);
              });
      } else {
          // User is not signed in
          // Handle user authentication (e.g., sign in or register) before storing data in Firestore
          console.error('User is not signed in.');
      }
  });
}

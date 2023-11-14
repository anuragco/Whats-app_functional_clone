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

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const confirmationResultString = urlParams.get("confirmationResult");

  if (confirmationResultString) {
    const confirmationResult = JSON.parse(confirmationResultString);

    // Add event listener for OTP verification when the button is clicked
    document.getElementById("verifyotpnow").addEventListener("click", function (e) {
      e.preventDefault();

      const otpInput = document.getElementById("otp");
      const otpValue = otpInput.value.trim();

      const credential = firebase.auth.PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otpValue
      );

      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          // Check if the user's name and photoURL already exist in your database
          const user = firebase.auth().currentUser;
          const uid = user.uid;

          // Assuming you have a 'users' collection in Firestore
          const usersCollection = firebase.firestore().collection("users");

          usersCollection
            .doc(uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                // User data already exists, store photoURL in localStorage
                const userData = doc.data();
                localStorage.setItem("userPhotoURL", userData.photoURL);

                // Redirect to the main home section
                alert("User data already exists");
                window.location.href =
                  "../../chating-home-module/Set-photo-name/Mainhome/web.html";
              } else {
                // User data doesn't exist, redirect to the next screen
                alert("User data not found");
                window.location.href =
                  "../../chating-home-module/Set-photo-name/first-step.html"; // Replace with the actual path
              }
            })
            .catch(function (error) {
              console.error("Error checking user data:", error.message);
              alert("Error checking user data. Please try again.");
            });
        })
        .catch(function (error) {
          console.error("Error verifying OTP: " + error.message);
          alert("Invalid OTP. Please try again.");
        });
    });
  } else {
    window.location.href =
      "../../../Frontend/Login-Module/initial-screen/home.html";
  }
});

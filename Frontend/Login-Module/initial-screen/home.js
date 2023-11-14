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

// Initialize the reCAPTCHA verifier outside of the event listener
var appVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
  size: "invisible", // Set the size as 'invisible' for reCAPTCHA v3
  callback: function (response) {
    // Callback function if needed
  },
});

// ... Your Firebase configuration code ...

document
  .getElementById("phone-verification-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    var phoneNumber = document.getElementById("phone-number").value;
    const precontrycode = document.getElementById("country-code").value;
    // Update data in local storage
    localStorage.setItem("phonenumber", phoneNumber);

    const fullmobilenum = precontrycode + phoneNumber;
    // Ensure that the reCAPTCHA token is included when signing in with the phone number
    firebase
      .auth()
      .signInWithPhoneNumber(fullmobilenum, appVerifier)
      .then(function (confirmationResult) {
        // After sending OTP and redirecting to the OTP page
        const confirmationResultString = JSON.stringify(confirmationResult);
        window.location.href = `../OTP-Screen/otp.html?confirmationResult=${confirmationResultString}`;
      })
      .catch(function (error) {
        console.error("Error sending verification code: " + error.message);
      });
  });

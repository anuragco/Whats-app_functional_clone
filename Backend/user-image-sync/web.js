document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the profile image URL from localStorage
    const profileImageURL = localStorage.getItem('ProfileImage');
    let currentphotourl = localStorage.getItem('userPhotoURL');
    const isloginpresent = localStorage.getItem('islogin')

    // Update the image element with the profile image URL
    const profileImageElement = document.getElementById('profile-image');
    if (profileImageElement) {
        if (currentphotourl) {
            profileImageElement.src = currentphotourl;
        } else if (profileImageURL) {
            profileImageElement.src = profileImageURL;
        } else if (!isloginpresent){
             window.location.href= '../../../Login-Module/initial-screen/home.html'
        }else {
            console.log('No profile image URL found.');
        }
    }
});



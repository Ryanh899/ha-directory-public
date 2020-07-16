
var authHelper = {
  isLoggedIn() {
    var token = sessionStorage.getItem("token");
    if (token) {
      var userData = this.parseToken(token);
      var expirationDate = new Date(userData.exp * 1000);
      if (Date.now() > expirationDate) this.logOut();
    } else {
      alert("not logged in");
      window.location.assign("sign-in.html");
    }
  },
  parseToken(token) {
    return JSON.parse(window.atob(token.split(".")[1]));
  },
  logOut(path = "./sign-in.html") {
    sessionStorage.removeItem("token");
    window.location.assign(path);
  }
};
// ec2 api url 
const API_URL = "https://hadirectoryapi.com/api/"; 
const ZOHO_URL = "https://hadirectoryapi.com/zoho/"; 
const AUTH_URL = "https://hadirectoryapi.com/auth/"; 
// const AUTH_URL = "http://localhost:3000/auth/"; 
const ADMIN_URL = "https://hadirectoryapi.com/admin/"; 
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(str) {
  const isPhone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
    str
  );
  return isPhone;
}

$(document).ready(function() {
  
  $('body').on('click', '#existing-account', function() {
    sessionStorage.setItem('lastLocation', 'register');

    window.location.assign('sign-in.html')
  })

  $( '#back' ).on('click', function () {
    window.history.back()
})

  $("#submit-register").on("click", function() {
    event.preventDefault();

    const form = document.querySelector("form#register-form");
    const formData = new FormData(form);

    const firstName = document.querySelector("input#first_name");
    const lastName = document.querySelector("input#last_name");
    const email = document.querySelector("input#email");
    const password = document.querySelector("input#password");
    const phone = document.querySelector("input#phone");
    const confirm = document.querySelector("input#confirm_pswd");

    if ( formData.get('first_name') === '' || formData.get('last_name') === '' ) {
        console.log('pls provide a name')
        $(firstName).css("border", "solid");
        $(firstName).css("border-color", "red");
        $(lastName).css("border", "solid");
        $(lastName).css("border-color", "red");
    } else if (!validateEmail(formData.get("email"))) {
        console.log('invalid email')
      $(email).css("border", "solid");
      $(email).css("border-color", "red");
    } else if (!validatePhone(formData.get("phone"))) {
        console.log('invalid phone number')
      $(phone).css("border", "solid");
      $(phone).css("border-color", "red");
    } else if (formData.get("password").length < 8) {
        console.log('pswd length')
      $(password).css("border", "solid");
      $(password).css("border-color", "red");
    } else if (formData.get("confirm_pswd") !== formData.get("password")) {
        console.log('pswds dont match')
      $(confirm).css("border", "solid");
      $(confirm).css("border-color", "red");
      $(password).css("border", "solid");
      $(password).css("border-color", "red");
    } else {
      const userInfo = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password")
      };
      axios
        .post(`${AUTH_URL}register`, userInfo)
        .then(response => {
          console.log(response);
          if (sessionStorage.getItem('addListing')) {
            sessionStorage.setItem('routeToBilling', true); 
          }
          sessionStorage.setItem('lastLocation', 'register')
          window.location.assign("sign-in.html");
        })
        .catch(err => {
          $('#error-email').css('display', ''); 
        });
    }
  });
});

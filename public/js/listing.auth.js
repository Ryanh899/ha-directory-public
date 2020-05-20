
var authHelper = {
  isLoggedIn() {
    const token = sessionStorage.getItem("token");
    if (token) {
      var userData = this.parseToken(token);
      var expirationDate = new Date(userData.exp * 1000);
      if (Date.now() > expirationDate) this.logOut();
      return true;
    } else {
      return false;
    }
  },
  parseToken(token) {
    if (token) {
      return JSON.parse(window.atob(token.split(".")[1]));
    }
  },
  logOut() {
    sessionStorage.removeItem("token");
  }
};

// ec2 api url 
const API_URL = "https://hadirectoryapi.com/api/"; 
const ZOHO_URL = "https://hadirectoryapi.com/zoho/"; 
const AUTH_URL = "https://hadirectoryapi.com/auth/"; 
const ADMIN_URL = "https://hadirectoryapi.com/admin/"; 

$(document).ready(function() {
  const page = document.querySelector("div#page-container");
  const loader = document.querySelector("div#loader-div");
  const listingContainer = document.querySelector('div#listing-container')

  $(page).css("display", "none");

  const listingId = sessionStorage.getItem("currentAuthListing");

  myAxios
    .get(ADMIN_URL + "pendingListing/" + listingId)
    .then(response => {
      console.log(response);
      const listing = response.data[0]
       


        
      $(loader).css("display", "none");
      $(page).fadeIn();
      
    })
    .catch(err => {
      console.log(err);
    });

    $('body').on('click', '#back-button', function () {
        window.history.back()
    })
});

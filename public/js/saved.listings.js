var myAxios = axios.create({
  headers: {
    Authorization: "Bearer " + sessionStorage.getItem("token")
  }
});
myAxios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      return authHelper.logOut("./sign-in.html");
    } else {
      return Promise.reject(error);
    }
  }
);
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

  const backButton = document.querySelector('div#home-button')
  $('body').on('click', '#home-button', function () {
    window.location.assign('index.html')
  })


  const listingContainer = document.querySelector("div#listing-container");
  const user = localStorage.getItem("token");
  console.log(user) +
    (function getSavedListings() {
      myAxios
        .get(API_URL + "savedListings/" + user)
        .then(response => {
          console.log(response);
          const savedListings = response.data;
          savedListings.forEach(listing => {
            $(listingContainer).html = ''; 
            $(listingContainer).append(`<div style="margin-bottom: 1rem;" id="${listing.id}-div" class="listingItem ui grid">
              <div class="row">
                <div class="six wide middle aligned column">
                  <p class="listingTitle">
                    ${listing.business_title}
                  </p>
                  <p class="listingSubtitle">${listing.business_description}</p>
                </div>
                <div class="six wide column"></div>
                <div class="four wide column">
                  <a id="${listing.id}" class="viewButton">
                    <div style="color: white;" class="listing-buttons " id="${listing.id}">
                      <i style="pointer-events:none" class="eye icon"></i> View
                    </div>
                  </a>
                  <a id="${listing.id}" class="deleteButton">
                    <div style="color: white;" class="listing-buttons ">
                      <i style="pointer-events:none" style="color: red;" class="trash icon"></i>
                      Delete
                    </div>
                  </a>
                </div>
              </div>
            </div>
              `);
          });
        })
        .catch(err => {
          console.log(err);
        });
    })();


    $('body').on('click', '.viewButton', function(e) {
      const id = $(this).attr('id')
    
      sessionStorage.setItem('currentListing', id)
      window.location.assign('listing.html')
    })

    $('body').on('click', '.deleteButton', function(e) {
      const id = $(this).attr('id')
      
      myAxios.delete(API_URL + 'savedListings/delete/' + id + '/' + localStorage.getItem('token'))
        .then(response => {
          console.log(response)
          $(`#${id}-div`).fadeOut()
        })
        .catch(err => {
          console.log(err)
        })
    })
});

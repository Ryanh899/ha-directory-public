// Home page 

//scroll smooth function 
function scrollToAnchor(id){
  var div = $(`div#${id}`);
  $('html,body').animate({scrollTop: div.offset().top},'slow');
}

// ec2 api url 
const API_URL = "https://hadirectoryapi.com/api/"; 
const ZOHO_URL = "https://hadirectoryapi.com/zoho/"; 
const AUTH_URL = "https://hadirectoryapi.com/auth/"; 
const ADMIN_URL = "https://hadirectoryapi.com/admin/"; 

const loader = document.querySelector('div#home-loader'); 
const page = document.querySelector('div#page-container'); 

// init google maps function
function initialize() {
  geocoder = new google.maps.Geocoder();
}

// show modal
function showErrModal (modal, header, description, errHeader, errMessage) {
  $(header).text(errHeader)
  $(description).text(errMessage)

  $(modal).modal('show')
}

// gets current city and state from lat lng (ln 77)
function getCity (lat, lng, city) {
  return new Promise((resolve, reject) => {
  let latlng = { 'latLng': new google.maps.LatLng(lat, lng)}
    geocoder.geocode(latlng, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
       if (results[1]) {
       //find city and state
       let city = `${results[1].address_components[2].long_name}, ${results[1].address_components[4].short_name}`
       // returns city and state
       resolve(city)
  
       } else {
         resolve() 
       }
     } else {
      resolve() 
     }
   });
  })
}

// geocodes with address and returns result, called once (ln 89)
function changeLocation (city) {
  return new Promise((resolve, reject) => {
    let latlng = { 'address' : city }
      geocoder.geocode(latlng, function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
       console.log(results)
        resolve(results[0]);
       } else {
        resolve() 
       }
     });
    })
}

// recieves either coords or city called twice, sets location (coords, addr) in session storage and search bar (ln 104 340)
async function showPosition(position, city) {
  console.log(position)
  // if passed a city (ln 340)
  if (!city || city == null) {
    // sets coords in storage 
    sessionStorage.setItem("current-lat", position.coords.latitude);
    sessionStorage.setItem("current-lng", position.coords.longitude);
    // calls get city to turn coords into a city
    const currentAddress = await getCity(position.coords.latitude, position.coords.longitude); 
    // sets search bar placeholder as getCity result then shows page hides loader 
    console.log('current address: ' + currentAddress)
    $('#location').attr('placeholder', currentAddress); 
    $(loader).hide()
    $(page).fadeIn()

    // if passed coords (ln 106)
  } else {
    // calls changeLocation to turn city into coords 
    const currentAddress = await changeLocation(city); 
    // sets placeholder and hides loader shows page
    console.log('current address: ' + currentAddress); 
    $('#location').attr('placeholder', currentAddress); 
    $(loader).hide()
    $(page).fadeIn()
    // sets coords in storage
    sessionStorage.setItem("current-lat", currentAddress.geometry.location.lat());
    sessionStorage.setItem("current-lng", currentAddress.geometry.location.lng());
  }
}

// mobile check
function isMobile() {
  var check = false;
  (function(a){
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
      check = true;
  })(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function noLocation (err) {
  console.log(err)
  $(loader).css('display', 'none')
  $(page).fadeIn(); 
}

function checkPermission () {
  if (!isMobile()) {
    navigator.permissions.query({
      name: 'geolocation'
    }).then(function(result) {
      if (result.state == 'granted') {
          return true
      } else if (result.state == 'prompt') {
        console.log(result.state);
  
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          console.log(result.state === 'granted')
          if (result.state === 'granted') navigator.geolocation.getCurrentPosition(showPosition, noLocation);
        }) 
  
      } else if (result.state == 'denied') {
          console.log(result.state);
         return false
      }
      result.onchange = function() {
        console.log(result.state);
      }
  });
  } else if (isMobile() && "geolocation" in navigator) {
    $('#web-search').css('display', 'none'); 
    $('#mobile-search').css('display', ''); 
    return true; 
  } else {
    return false
  }
  
}

// gets coords with geolocation and calls show position
function getLocation(city) {
  const permission = checkPermission();
  if (permission) {
    if (navigator.geolocation && ![...arguments].length) {
      navigator.geolocation.getCurrentPosition(showPosition, noLocation);
    } else {
      $(loader).hide(); 
      $(page).fadeIn(); 
      // showErrModal('#error-modal', '#error-header', '#error-description', 'Location Error', "Please enable location services for the Hair Authority Directory");
    } 
  } else {
    console.log('nav query')
      $(loader).hide(); 
      $(page).fadeIn(); 
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        console.log(result.state)
        if (result.state === 'granted') navigator.geolocation.getCurrentPosition(showPosition, noLocation);
        else if ( result.state === 'prompt' ) navigator.geolocation.getCurrentPosition(showPosition, noLocation);
      }) 
      // showErrModal('#error-modal', '#error-header', '#error-description', 'Location Error', "Please enable location services for the Hair Authority Directory");
  }

}
// list of categories
const categories = [
  { title: "Dermatologist" },
  { title: "Hair Care Salons" },
  { title: "Hair Loss / Hair Care Products & Treatments" },
  { title: "Hair Replacement & Hair Systems" },
  { title: "Laser Therapy" },
  { title: "Medical / Hair Transplants" },
  { title: "Trichologist" },
  { title: "Medical Hair Restoration" },
  { title: "Wigs / Extensions & Hair Additions" }
];

// category button function
function categoryButtons (categories) {
  const catButtonDiv = document.createElement("div");
  catButtonDiv.className = "computer only";
  catButtonDiv.id = "append-cat-buttons";
  catButtonDiv.style.textAlign = 'center'
  const or = document.createElement("p");
  or.id = "or-text";
  or.style.marginTop = "1rem";
  or.style.color = "white";
  or.style.textAlign = "center";
  or.innerHTML = "<i class='small down arrow icon' ></i>Or click on a category button to search <i class='small down arrow icon' ></i> ";
  catButtonDiv.appendChild(or);
  $("#search-appendButtons").append(catButtonDiv);
  categories.forEach(category => {
    let button = document.createElement("button");
    button.className = "ui button catButtons";
    button.textContent = category.title;
    button.style.margin = ".5rem";
    button.style.color = "#1F7A8C";
    button.style.background = "white";
    button.style.fontFamily = "Lato";
    button.style.fontWeight = 500;
    $("#append-cat-buttons").append(button);
  });
}; 

// landing image carousel js
function slick() {
  $(".landing-images").slick({
    autoplay: true,
    infinite: false,
    speed: 1000,
    arrows: false,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
}

// READY 
$(document).ready(function() {
 
// selecting page and loader, hide page => show loader

$(loader).show(); 

// declare geocoder 
let geocoder; 

// init google maps and define geocoder
initialize(); 

// calling the function to get geolocation
getLocation();

// appends category buttons
categoryButtons(categories); 

// slick images 
setTimeout(slick(), 100)

// on search click
$("body").on("click", "a#search-button", async function() {
  // show loader hide page
  $(page).fadeOut(); 
  $(loader).show(); 

  // if mobile 
  if ( !isMobile() ) {
  // get search and location
  const search = document.querySelector("input#request").value.trim();
  const location = document.querySelector('input#location').value.trim(); 

  // if location use location 
  if ( location !== '' ) {
    await showPosition(null, location); 
    sessionStorage.setItem('location', location);
  }
  // else set search, use current location already in storage, send to search page
  sessionStorage.setItem("lastLocation", "index");
  sessionStorage.setItem("searchQuery", search);
  window.location.assign("search.listings.html");
  } else if ( isMobile() ) {
    // get search and location
  const search = document.querySelector("input#search-semantic").value.trim();

  // else set search, use current location already in storage, send to search page
  sessionStorage.setItem("lastLocation", "index");
  sessionStorage.setItem("searchQuery", search);
  window.location.assign("search.listings.html");
  }

});

// on search click
$("body").on("click", "button#search-button", async function() {
  // show loader hide page
  $(page).fadeOut(); 
  $(loader).show(); 

  // if mobile 
  if ( !isMobile() ) {
  // get search and location
  const search = document.querySelector("input#request").value.trim();
  const location = document.querySelector('input#location').value.trim(); 

  // if location use location 
  if ( location !== '' ) {
    await showPosition(null, location); 
    sessionStorage.setItem('location', location);
  }
  // else set search, use current location already in storage, send to search page
  sessionStorage.setItem("lastLocation", "index");
  sessionStorage.setItem("searchQuery", search);
  window.location.assign("search.listings.html");
  } else if ( isMobile() ) {
    // get search and location
  const search = document.querySelector("input#search-semantic").value.trim();

  // else set search, use current location already in storage, send to search page
  sessionStorage.setItem("lastLocation", "index");
  sessionStorage.setItem("searchQuery", search);
  window.location.assign("search.listings.html");
  }

});
// category button click
$("body").on("click", ".catButtons", function(e) {
  const search = $(e.target).text();

  sessionStorage.setItem("lastLocation", "index");
  sessionStorage.setItem("searchQuery", search);
  window.location.assign("search.listings.html");
});

// enter button search functionality
$("body").keyup(function(event) {
  console.log("pressed");
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // if user input click search button
    if ($("#request").val()) {
      $("#search-button").click();
    } else {
      return;
    }
  }
});

});

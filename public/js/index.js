// Home page 

//scroll smooth function 
function scrollToAnchor(id){
  var div = $(`div#${id}`);
  $('html,body').animate({scrollTop: div.offset().top},'slow');
}

// ec2 api url 
const API_URL = "http://ec2-34-201-189-88.compute-1.amazonaws.com/api/"; 

const loader = document.querySelector('div#home-loader'); 
const page = document.querySelector('div#page-container'); 

// init google maps function
function initialize() {
  geocoder = new google.maps.Geocoder();
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

// gets coords with geolocation and calls show position
function getLocation(city) {
  console.log([...arguments].length)
  if (navigator.geolocation && ![...arguments].length) {
    navigator.geolocation.getCurrentPosition(showPosition, null);
  } else if([...arguments].length) {
    console.log("Geolocation is not supported by this browser.");
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
          slidesToShow: 2,
          slidesToScroll: 2
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

$(page).hide(); 
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
  // get search and location
  const search = document.querySelector("input#request").value.trim();
  const location = document.querySelector('input#location').value.trim(); 

  // if location use location 
  if (location !== '') {
    await showPosition(null, location); 
    sessionStorage.setItem('location', location)
  }
  // else set search, use current location already in storage, send to search page
  sessionStorage.setItem("lastLocation", "index");
  sessionStorage.setItem("searchQuery", search);
  window.location.assign("search.listings.html");
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

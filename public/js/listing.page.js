// axios interceptor and creater


//auth helper functions
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

// API URL
// ec2 api url 
const API_URL = "https://hadirectoryapi.com/api/"; 
// const API_URL = "http://localhost:3000/api/"; 

const ZOHO_URL = "https://hadirectoryapi.com/zoho/"; 
const AUTH_URL = "https://hadirectoryapi.com/auth/"; 
const ADMIN_URL = "https://hadirectoryapi.com/admin/"; 
const frontUrl = 'https://hairauthoritydirectory.s3.amazonaws.com/'; 

// days of the week for business hours
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

// parse youtube
function YouTubeGetID(url) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

// get channel from user url
function getChannelFromUrl(url) {
  var pattern = new RegExp(
    "^(https?://)?(www.)?youtube.com/(user/)?([a-z-_0-9]+)/?([?#]?.*)",
    "i"
  );
  var matches = url.match(pattern);
  if (matches) {
    return matches[4];
  }

  return url;
}

function showSpecialSkills (skills) {
  console.log('Skills: ', skills); 
  if (skills === 'ISHRS') {
    $('#sticky').prepend(`<div id="special-skills-accordion" class="ui styled accordion" style="margin-top:1rem;" > <div id="special-skills-text"  class="active title ">  <img class="ui small centered image" src="./images/${skills}.png"> <span style="display:block;" >Member of the ${skills} </span> </div>   <div class="content"></div> </div>`)
  } else if (skills === 'Trichologist') {
    $('#sticky').prepend(`<div id="special-skills-accordion" class="ui styled accordion" style="margin-top:1rem;" > <div id="special-skills-text"  class="active title ">  <img class="ui small centered image" src="./images/WTS.png"> <span style="display:block;" >Member of the WTS </span> </div>   <div class="content"></div> </div>`)
  }
}

function getChannelIdFromUrl(url) {
  var pattern = /^(?:(http|https):\/\/[a-zA-Z-]*\.{0,1}[a-zA-Z-]{3,}\.[a-z]{2,})\/channel\/([a-zA-Z0-9_]{3,})$/;
  var matchs = url.match(pattern);
  if (!matchs === null) {
    return matchs[2];
  } else {
    return;
  }
}

function youtube_parser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

// on ready
$(document).ready(function() {
  // select dom elements
  const page = document.querySelector("div#listing-page-container");
  const loader = document.querySelector("div#loader-div");
  const listingColumn = document.querySelector("div#listing-column");
  const titleSection = document.querySelector("div#title-section");
  const contactLine = document.querySelector("hr#contact-hr");
  const locationAddr = document.querySelector("a#location-address");
  const carousel = document.querySelector("ul#content");

  // hide the page and let the loader run
  $(page).fadeOut(); 

  // on resize move rail
  $(window).bind("resize", function () {
    if ($(this).width() < 800) {
        $('#right-rail').removeClass('ui right very close rail'); 
    } 
}).trigger('resize');

  // function to initiate map
  function getGeolocation() {
    console.log("map");
    // navigator.geolocation.getCurrentPosition(drawMap);
    drawMap();
  }

  // function called by getGeolocation
  async function drawMap(geoPos) {
    // map center coords
    let geolocate;

    // if listing coords exist
    if (
      sessionStorage.getItem("listing-lat") !== "null" &&
      sessionStorage.getItem("listing-lng") !== "null"
    ) {
      console.log("COORDINATES");
      geolocate = new google.maps.LatLng(
        parseFloat(sessionStorage.getItem("listing-lat")),
        parseFloat(sessionStorage.getItem("listing-lng"))
      );

      // create map props for map generator
      let mapProp = {
        center: geolocate,
        zoom: 10,
        disableDefaultUI: true,
        zoomControl: false
      };
      // call google maps api to append the map to the #map div
      let map = new google.maps.Map(document.getElementById("map"), mapProp);
      // create a marker for the business
      let marker = new google.maps.Marker({
        position: geolocate,
        map: map,
        animation: google.maps.Animation.DROP
      });
      // reveal page and hide loader
      $("#images").css("dislplay", "");
      $(loader).css("display", "none");
      $(page).fadeIn(550)
    }
    // if the address exists
    else if (sessionStorage.getItem("listing-address") !== "null") {
      console.log("ADDRESS");
      // google geo coder init
      let geocoder = new google.maps.Geocoder();
      // get the address
      let full_address = sessionStorage.getItem("listing-address");
      console.log(full_address);
      // hit the google api with the address to get coordinates
      geocoder.geocode({ address: full_address }, function(results, status) {
        if (status == "OK") {
          console.log(results);
          geolocate = results[0].geometry.location;
          // create map props for map generator
          let mapProp = {
            center: geolocate,
            zoom: 10,
            disableDefaultUI: true,
            zoomControl: false
          };
          // call google maps api to append the map to the #map div
          let map = new google.maps.Map(
            document.getElementById("map"),
            mapProp
          );
          // create a marker for the business
          let marker = new google.maps.Marker({
            position: geolocate,
            map: map,
            animation: google.maps.Animation.DROP
          });
          // reveal page and hide loader
          $("#images").css("dislplay", "");
          $(loader).css("display", "none");
          $(page).fadeIn(550)
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
      // if no location get current location
    } else {
      // console.log("OTHER");
      // geolocate = new google.maps.LatLng(
      //   geoPos.coords.latitude,
      //   geoPos.coords.longitude
      // );
      //  // create map props for map generator
      //  let mapProp = {
      //   center: geolocate,
      //   zoom: 10,
      //   disableDefaultUI: true,
      //   zoomControl: false
      // };
      // // call google maps api to append the map to the #map div
      // let map = new google.maps.Map(
      //   document.getElementById("map"),
      //   mapProp
      // );
      // // create a marker for the business
      // let marker = new google.maps.Marker({
      //   position: geolocate,
      //   map: map,
      //   animation: google.maps.Animation.DROP
      // });
      // reveal page and hide loader
      $("#images").css("dislplay", "");
      $(loader).css("display", "none");
      $(page).fadeIn(550)
    }
  }

  // grabbing location from session storage
  let location = {
    lat: sessionStorage.getItem("listing-lat"),
    lng: sessionStorage.getItem("listing-lng")
  };

  // calling function to init map
  getGeolocation();

  // getting the current listing id from session storage
  const currentListing = sessionStorage.getItem("currentListing");

  // function to parse phone number for dom
  function splitPhone(number) {
    if (number) {
      let newNumber = number.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3");
      console.log(newNumber);
      return newNumber;
    } else {
      return;
    }
  }

  console.log(currentListing);
  // if there is a listing in session storage
  if (currentListing) {
    // hit the api for the listing data by the id
    myAxios
      .get(API_URL + "listing/" + currentListing)
      .then(async response => {
        // then hide page
        // $(page).css("display", "none");
        console.log(response); 

        // assign listing to the response
        const listing = response.data;
        // free / premium plan
         if (listing.plan === "d2f4f1f0-1ad5-4c3a-912d-6646a5a46d08") {
                   // parse phone number
                   splitPhone(listing.phone);
                    $('#hours-column').css('display', 'none')
                    $('#social-media').css('display', 'none')
                   // filter images for null values
                   let filteredImg = listing.images.filter(
                     x => x.image_path !== "true" && x.image_path !== ""
                   );
         
                   // map images into an arr of dom elements
                   const images = await filteredImg.map(image => {
                     if (image.image_path !== "false") {
                       // p tag
                       let thisImage = document.createElement("img");

                       let src = image.image_path.split('.')[0]
                       // src
                       thisImage.src = `https://hairauthoritydirectory.s3.amazonaws.com/${src}-458x425.jpeg`;
                       // margin and padding
                      //  thisImage.style.padding = "1rem 0 0 1rem";
                       thisImage.style.margin = "auto 0 0 0";
                       // class name
                       thisImage.className = "ui image carousel-images";
         
                       return thisImage;
                     }
                   });
         
                   // then filter those images for undefined
                   let filteredImgs = images.filter(x => x !== undefined);
         
                   // create image slider element
                   let imageSlider = document.createElement("div");
                   // class name
                   imageSlider.className = "image-slider";
                   // id
                   imageSlider.id = "image-slider-id";
                   // map through and append images to slider element
                   filteredImgs.forEach(image => {
                     imageSlider.appendChild(image);
                   });
                   // append and hide images
                   $("#images").append(imageSlider);
                   $("#images").css("dislplay", "none");
         
                   // if category prepend to title section
                   if (listing.category !== null) {
                     $(titleSection).prepend(
                       `<p  class="listing_category" >${listing.category}</p>  `
                     );
                   }
         
                   if (!listing.claimed) {
                     $('#right-rail').prepend(`<button id="claim-button" style="background: orange; color: white; " class="ui button" >Claim Your Business</button>`)
                   }
         
                     
                   $('#last-divider').append(`<div class="active section" style="color: black; font-size: 18px; font-family:Raleway; font-weight: 400;"> ${listing.business_title}</div>`)
         
                   // prepend title to title section
                   $(titleSection).prepend(
                     '<h1 style="margin-top: 0rem" class="listing_h1" >' +
                       listing.business_title +
                       "</h1>"
                   );
         
                   // RAIL
                   // if phone else hide div
                   if (listing.phone) {
                     $("#phone-content").append(
                       `<a class="contact-info" >${listing.phone}</a>`
                     );
                   } else {
                     $("#phone-div").css("display", "none");
                   }
         
                   // if email else hide div
                   if (listing.email) {
                     $("#email-content").append(
                       `<a class="contact-info" >${listing.email}</a>`
                     );
                   } else {
                     $("#email-div").css("display", "none");
                   }
         
                   // if website else hide div
                   if (listing.website) {
                     $("#website-content").append(
                       `<a href="${listing.website}" id="website-link" class="contact-info" >${listing.website}</a>`
                     );
                   } else {
                     $("#website-div").css("display", "none");
                   }
         
                   // // if address else hide div
                   if (listing.full_address) {
                     $("#directions-content").append(
                       `<a href="http://maps.google.com/?q=${listing.full_address}" id="direction-link" class="contact-info" >${listing.full_address}</a>`
                     );
                     $("#get-direct").append(
                       `<a href="http://maps.google.com/?q=${listing.full_address}" id="location-address"><i class="directions icon" ></i>${listing.full_address}</a>`
                     );
                   } else {
                     $("#directions-div").css("display", "none");
                   }
         
                   // if description append else hide the section
                   if (listing.business_description) {
                     // $("#section-header").append(
                     //   `<p id="listing_description" >${listing.business_description}</p>`
                     // );
                     $('#description-content').html(listing.business_description)
                   } else {
                     $("#about-section").css("display", "none");
                   }
         
                   //HOURS
                   // arr of listing values
                   const hours = Object.values(listing);
                   // map arr of listing keys, return dom elements for each day of available business hours
                   let mapHours = Object.keys(listing).map((x, index) => {
                     if (weekDays.some(n => n === x)) {
                       let thisDay = document.createElement("p");
                       thisDay.className = "hours-text";
                       thisDay.textContent = `${x}: ${hours[index].opening_hours}-${hours[index].closing_hours}`;
                       return thisDay;
                     } else {
                       return null;
                     }
                   });
         
          //STANDARD PLAN
          // EXCLUDES: FAQ's, hours, announcements, events
        } else if (listing.plan === 'ea78d785-2a2c-4b74-b578-fab3509b669c') {
                   // parse phone number
                   splitPhone(listing.phone);

                   // filter images for null values
                   let filteredImg = listing.images.filter(
                     x => x.image_path !== "true" && x.image_path !== ""
                   );
         
                   // map images into an arr of dom elements
                   const images = await filteredImg.map(image => {
                     if (image.image_path !== "false") {
                       // p tag
                       let thisImage = document.createElement("img");
                       // src
                       thisImage.src = `https://hairauthoritydirectory.s3.amazonaws.com/${image.image_path}`;
                       // margin and padding
                      //  thisImage.style.padding = "1rem 0 0 1rem";
                       thisImage.style.margin = "auto 0 0 0";
                       // class name
                       thisImage.className = "ui image carousel-images";
         
                       return thisImage;
                     }
                   });
         
                   // then filter those images for undefined
                   let filteredImgs = images.filter(x => x !== undefined);
         
                   // create image slider element
                   let imageSlider = document.createElement("div");
                   // class name
                   imageSlider.className = "image-slider";
                   // id
                   imageSlider.id = "image-slider-id";
                   // map through and append images to slider element
                   filteredImgs.forEach(image => {
                     imageSlider.appendChild(image);
                   });
                   // append and hide images
                   $("#images").append(imageSlider);
                   $("#images").css("dislplay", "none");
         
                   // if category prepend to title section
                   if (listing.category !== null) {
                     $(titleSection).prepend(
                       `<p  class="listing_category" >${listing.category}</p>  `
                     );
                   }
         
                   if (!listing.claimed) {
                     $('#right-rail').prepend(`<button id="claim-button" style="background: orange; color: white;" class="ui button" >Claim Your Business</button>`)
                   }
         
                     
                   $('#last-divider').append(`<div class="active section" style="color: black; font-size: 18px; font-family:lato; font-weight: 500;">${listing.business_title}</div>`)
         
                   // prepend title to title section
                   $(titleSection).prepend(
                     '<h1 style="margin-top: 0rem" class="listing_h1" >' +
                       listing.business_title +
                       "</h1>"
                   );
         
                   // RAIL
                   // if phone else hide div
                   if (listing.phone) {
                     $("#phone-content").append(
                       `<a class="contact-info" >${listing.phone}</a>`
                     );
                   } else {
                     $("#phone-div").css("display", "none");
                   }
         
                   // if email else hide div
                   if (listing.email) {
                     $("#email-content").append(
                       `<a class="contact-info" >${listing.email}</a>`
                     );
                   } else {
                     $("#email-div").css("display", "none");
                   }
         
                   // if website else hide div
                   if (listing.website) {
                     $("#website-content").append(
                       `<a href="${listing.website}" id="website-link" class="contact-info" >${listing.website}</a>`
                     );
                   } else {
                     $("#website-div").css("display", "none");
                   }
         
                   // // if address else hide div
                   if (listing.full_address) {
                     $("#directions-content").append(
                       `<a href="http://maps.google.com/?q=${listing.full_address}" id="direction-link" class="contact-info" >${listing.full_address}</a>`
                     );
                     $("#get-direct").append(
                       `<a href="http://maps.google.com/?q=${listing.full_address}" id="location-address"><i class="directions icon" ></i>${listing.full_address}</a>`
                     );
                   } else {
                     $("#directions-div").css("display", "none");
                   }
         
                   // END OF RAIL
         
                   // SOCIAL MEDIA
                   // if instagram append button
                   if (listing.instagram) {
                     $("#social-media").append(
                       `<a class="contact-info" href="${listing.instagram}" ><button style="background: #3f729b;"  class="ui circular facebook icon button">
                           <i style="background: #3f729b;" class="instagram icon"></i>
                         </button></a>`
                     );
                   }
         
                   // if linked-in
                   if (listing.linkedin) {
                     $("#social-media").append(
                       `<a class="contact-info" href="${listing.linkedin}" ><button class="ui circular facebook icon button">
                           <i class="linkedin icon"></i>
                         </button></a>`
                     );
                   }
         
                   // if facebook
                   if (listing.facebook) {
                     $("#social-media").append(
                       `<a class="contact-info" href="${listing.facebook}" ><button class="ui circular facebook icon button">
                           <i class="facebook icon"></i>
                         </button></a>`
                     );
                   }
         
                   // if twitter
                   if (listing.twitter) {
                     $("#social-media").append(
                       `<a class="contact-info" href="${listing.twitter}" ><button class="ui circular facebook icon button">
                           <i class="twitter icon"></i>
                         </button></a>`
                     );
                   }
         
                     // if twitter
                     if (listing.youtube_channel) {
                     $("#social-media").append(
                       `<a class="contact-info" href="${listing.youtube_channel}" ><button class="ui circular youtube icon button">
                           <i class="youtube icon"></i>
                         </button></a>`
                     );
                   }

                   if (listing.youtube) {
                    $("#social-media").append(
                      `<a class="contact-info" href="${listing.youtube}" ><button class="ui circular youtube icon button">
                          <i class="youtube icon"></i>
                        </button></a>`
                    );
                  }
         
                   // if description append else hide the section
                   if (listing.business_description) {
                     // $("#section-header").append(
                     //   `<p id="listing_description" >${listing.business_description}</p>`
                     // );
                     $('#description-content').html(listing.business_description)
                   } else {
                     $("#about-section").css("display", "none");
                   }
         
                   // if youtube append embed
                   if (listing.youtube) {
                     $("#youtube-section").append(`<div
                     id="youtube-hr"
                     style="padding: 0px;"
                     class="sixteen wide column"
                   > </div>`);
                     let ytUrl = listing.youtube.split("/");
         
                     if (ytUrl.some(x => x === "user")) {
                       console.log("USER");
                       let username = getChannelFromUrl(listing.youtube);
                       $("#youtube-col").append(
                         `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed?listType=user_uploads&list=${username}&origin=${frontUrl}"  ></div>`
                       );
                       $("#youtube-embed").embed();
                     } else if (ytUrl.some(x => x === "channel")) {
                       console.log("CHANNEL");
                       let channelId = await getChannelIdFromUrl(listing.youtube);
                       console.log(channelId);
                       if (channelId) {
                         console.log("CHANNEL ID ");
                         $("#youtube-col").append(
                           `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/videoseries?list=${channelId}&origin=${frontUrl}"  ></div>`
                         );
                         $("#youtube-embed").embed();
                       } else {
                         console.log("CHANNEL ID ELSE");
                         let split = listing.youtube.split("/");
                         if (split[split.length - 1].length > 10) {
                           let channelId = split[split.length - 1];
                           let changeChannelId = channelId.split("");
                           if (changeChannelId[1] === "C") {
                             changeChannelId[1] = "U";
                           }
                           console.log(changeChannelId.join(""));
                           let newChannelId = changeChannelId.join("");
                           $("#youtube-col").append(
                             `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/videoseries?list=${newChannelId}&origin=${frontUrl}"  ></div>`
                           );
                           $("#youtube-embed").embed();
                         } else {
                           let channelId = split[split.length - 2];
                           let changeChannelId = channelId.split("");
                           if (changeChannelId[1] === "C") {
                             changeChannelId[1] = "U";
                           }
                           console.log(changeChannelId.join(""));
                           let newChannelId = changeChannelId.join("");
                           $("#youtube-col").append(
                             `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/videoseries?list=${channelId}&origin=${frontUrl}" ></div>`
                           );
                           $("#youtube-embed").embed();
                         }
                       }
                     } else {
                       let vidId = listing.youtube.split('v=')[1]; 
                       console.log(vidId);
                       $("#youtube-col").append(
                         `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/${vidId}&origin=${frontUrl}"  ></div>`
                       );
                       $("#youtube-embed").embed();
                     }
                   }
        } else {
// parse phone number
splitPhone(listing.phone);

// filter images for null values
let filteredImg = listing.images.filter(
  x => x.image_path !== "true" && x.image_path !== ""
);

let smallestHeight = 1000;  

// map images into an arr of dom elements
const images = await filteredImg.map(image => {
  // console.log(image)
  if (image.image_path !== "false" && !image.featured_image) {
    // p tag
    let thisImage = new Image(); 
    thisImage.onload = function () {
      console.log(thisImage.height)
      if (thisImage.width < 750) {
      // console.log("width: " + thisImage.width)
      if (thisImage.height < smallestHeight && thisImage.height > 320) {
        smallestHeight = thisImage.height; 
        console.log(smallestHeight)
        $('#images-column').css('max-height', smallestHeight + 'px')
        $('#image-slider-id').css('max-height', smallestHeight + 'px')
      } else {
        thisImage.height = '320px'
        console.log(`image is ${thisImage.height}`)
      }
    } else {
      console.log('image is: ' + thisImage.width + 'wide, ' + thisImage.src); 
      thisImage.remove(); 
    }

    }
    // let src = image.image_path.split('.')[0]; 
    // console.log(src)
    // src
    thisImage.src = `https://hairauthoritydirectory.s3.amazonaws.com/${image.image_path}`;
    // margin and padding
    // thisImage.style.padding = "1rem 0 0 1rem";
    thisImage.style.margin = "auto 0 0 0";
    // class name
    thisImage.className = "ui image carousel-images";
    return thisImage;
  } else if (image.image_path !== "false" && image.featured_image) {

  }
});

// then filter those images for undefined
let filteredImgs = images.filter(x => x !== undefined);

console.log(filteredImgs); 
// create image slider element
let imageSlider = document.createElement("div");
// class name
imageSlider.className = "image-slider";
// id
imageSlider.id = "image-slider-id";
// map through and append images to slider element
filteredImgs.forEach(image => {
  imageSlider.appendChild(image);
});
// append and hide images
$("#images").append(imageSlider);



$("#images").css("dislplay", "none");

// if category prepend to title section
if (listing.category !== null) {
  $(titleSection).prepend(
    `<p  class="listing_category" >${listing.category}</p>  `
  );
}

if (!listing.claimed) {
  $('#top-rail').prepend(`<div style="padding: 0px;" class="ui basic segment" ><button id="claim-button" style="background: orange; color: white;" class="ui button" >Claim Your Business</button></div>`)
}
$('.ui.sticky')
  .sticky({
    context: '#listing-column'
  })
;

  
$('#last-divider').append(`<div class="active section" style="color: black; font-size: 18px; font-family:lato; font-weight: 500;">${listing.business_title}</div>`)

// prepend title to title section
$(titleSection).prepend(
  '<h1 style="margin-top: 0rem" class="listing_h1" >' +
    listing.business_title +
    "</h1>"
);

// RAIL
// if phone else hide div
if (listing.phone) {
  $("#phone-content").append(
    `<a class="contact-info" >${listing.phone}</a>`
  );
} else {
  $("#phone-div").css("display", "none");
}

// if email else hide div
if (listing.email) {
  $("#email-content").append(
    `<a class="contact-info" >${listing.email}</a>`
  );
} else {
  $("#email-div").css("display", "none");
}

// if website else hide div
if (listing.website) {
  $("#website-content").append(
    `<a href="${listing.website}" id="website-link" class="contact-info" >${listing.website}</a>`
  );
} else {
  $("#website-div").css("display", "none");
}

// // if address else hide div
if (listing.full_address) {
  $("#directions-content").append(
    `<a href="http://maps.google.com/?q=${listing.full_address}" id="direction-link" class="contact-info" >${listing.full_address}</a>`
  );
  $("#get-direct").append(
    `<a href="http://maps.google.com/?q=${listing.full_address}" id="location-address"><i class="directions icon" ></i>${listing.full_address}</a>`
  );
} else {
  $("#directions-div").css("display", "none");
}

// END OF RAIL

// SOCIAL MEDIA
// if instagram append button
if (listing.instagram) {
  $("#social-media").append(
    `<a class="contact-info" href="${listing.instagram}" ><button style="background: #3f729b;"  class="ui circular facebook icon button">
        <i style="background: #3f729b;" class="instagram icon"></i>
      </button></a>`
  );
}

// if linked-in
if (listing.linkedin) {
  $("#social-media").append(
    `<a class="contact-info" href="${listing.linkedin}" ><button class="ui circular facebook icon button">
        <i class="linkedin icon"></i>
      </button></a>`
  );
}

// if facebook
if (listing.facebook) {
  $("#social-media").append(
    `<a class="contact-info" href="${listing.facebook}" ><button class="ui circular facebook icon button">
        <i class="facebook icon"></i>
      </button></a>`
  );
}

// if twitter
if (listing.twitter) {
  $("#social-media").append(
    `<a class="contact-info" href="${listing.twitter}" ><button class="ui circular facebook icon button">
        <i class="twitter icon"></i>
      </button></a>`
  );
}

  // if twitter
  if (listing.youtube_channel) {
  $("#social-media").append(
    `<a class="contact-info" href="${listing.youtube_channel}" ><button class="ui circular youtube icon button">
        <i class="youtube icon"></i>
      </button></a>`
  );
}


if (listing.youtube) {
  $("#social-media").append(
    `<a class="contact-info" href="${listing.youtube}" ><button class="ui circular youtube icon button">
        <i class="youtube icon"></i>
      </button></a>`
  );
}

// if description append else hide the section
if (listing.business_description) {
  // $("#section-header").append(
  //   `<p id="listing_description" >${listing.business_description}</p>`
  // );
  $('#description-content').html(listing.business_description)
} else {
  $("#about-section").css("display", "none");
}

console.log($('.carousel-images')[0])


//HOURS
// arr of listing values
const hours = Object.values(listing);
// map arr of listing keys, return dom elements for each day of available business hours
let mapHours = Object.keys(listing).map((x, index) => {
  if (weekDays.some(n => n === x)) {
    let thisDay = document.createElement("div");
    thisDay.className = "hours-text";
    thisDay.innerHTML = `<span style="font-weight: 400;" >${x}</span>: ${hours[index].opening_hours}-${hours[index].closing_hours}`;
    return thisDay;
  } else {
    return null;
  }
});

// get day of week
const d = new Date();
let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

const today = weekday[d.getDay()]; 
console.log(today)

if (Object.keys(listing).includes(today)) {
  const todaysHours = listing[today]; 
  const open = todaysHours.opening_hours.split('').slice(0, 5).join(''); 
  const close = todaysHours.closing_hours.split('').slice(0, 5).join('');

  if (Date.parse(`2009/07/13 ${open}:00`) > Date.parse(`2009/07/13 ${close}:00`)) {
    $('#sticky').prepend(`<div class="ui styled accordion" style="margin-top:1rem;" > <div id="currentHours" class="active title ">   <i class="dropdown icon"></i> <span style="color: green;" class="listing_p" >Open Now</span>: ${todaysHours.opening_hours}-${todaysHours.closing_hours} </div>   <div id="hours-accordion" class="content"></div> </div>`)
  } else {
    $('#sticky').prepend(`<div class="ui styled accordion" style="margin-top:1rem;" > <div class="active title ">   <i class="dropdown icon"></i> <span style="color: red"; class="listing_p" >Closed Now: ${todaysHours.opening_hours}-${todaysHours.closing_hours}</span> </div>   <div id="hours-accordion" class="content"></div> </div>`)
  }
} else {
  $('#sticky').prepend(`<div class="ui styled accordion" style="margin-top:1rem;" > <div class="active title ">   <i class="dropdown icon"></i> <span style="color: red"; class="listing_p" >Closed Today</span> </div>   <div id="hours-accordion" class="content"></div> </div>`)
}

// if hours arr has content append them
if (mapHours.length > 25) {
  console.log(mapHours);
  mapHours.forEach(day => {
    $("#hours-accordion").append(day);
  });
  // else say no hours available
} else {
  console.log('else')
  $("#hours-column").css('display', 'none'); 
}

$('.ui.accordion')
  .accordion()

showSpecialSkills(sessionStorage.getItem('logoSearch'))

// if youtube append embed
if (listing.youtube) {
  $("#youtube-section").append(`<div
  id="youtube-hr"
  style="padding: 0px;"
  class="sixteen wide column"
> </div>`);
  let ytUrl = listing.youtube.split("/");

  if (ytUrl.some(x => x === "user")) {
    console.log("USER");
    let username = getChannelFromUrl(listing.youtube);
    $("#youtube-col").append(
      `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed?listType=user_uploads&list=${username}&origin=${frontUrl}"  ></div>`
    );
    $("#youtube-embed").embed();
  } else if (ytUrl.some(x => x === "channel")) {
    console.log("CHANNEL");
    let channelId = await getChannelIdFromUrl(listing.youtube);
    console.log(channelId);
    if (channelId) {
      console.log("CHANNEL ID ");
      $("#youtube-col").append(
        `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/videoseries?list=${channelId}&origin=${frontUrl}"  ></div>`
      );
      $("#youtube-embed").embed();
    } else {
      console.log("CHANNEL ID ELSE");
      let split = listing.youtube.split("/");
      if (split[split.length - 1].length > 10) {
        let channelId = split[split.length - 1];
        let changeChannelId = channelId.split("");
        if (changeChannelId[1] === "C") {
          changeChannelId[1] = "U";
        }
        console.log(changeChannelId.join(""));
        let newChannelId = changeChannelId.join("");
        $("#youtube-col").append(
          `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/videoseries?list=${newChannelId}&origin=${frontUrl}"  ></div>`
        );
        $("#youtube-embed").embed();
      } else {
        let channelId = split[split.length - 2];
        let changeChannelId = channelId.split("");
        if (changeChannelId[1] === "C") {
          changeChannelId[1] = "U";
        }
        console.log(changeChannelId.join(""));
        let newChannelId = changeChannelId.join("");
        $("#youtube-col").append(
          `<div id="youtube-embed" class="ui embed youtube" data-url="https://www.youtube.com/embed/videoseries?list=${channelId}&origin=${frontUrl}" ></div>`
        );
        $("#youtube-embed").embed();
      }
    }
  } else if (listing.youtube.split('v=')) {

  } else if (listing.youtube.split('youtu.be/')) {
    let vidId = listing.youtube.split('youtu.be/')[1]; 
    console.log(listing.youtube)
    console.log(vidId);

    $("#youtube-col").append(
      `<div id="youtube-embed" class="ui embed youtube" data-url="http://www.youtube.com/embed/${vidId}"  ></div>`
    );
    $("#youtube-embed").embed();
    } else {
    let split = listing.youtube.split('&')[0]; 
    let vidId = split.split('=')[1]
    console.log(listing.youtube)
    console.log(vidId);

    $("#youtube-col").append(
      `<div id="youtube-embed" class="ui embed youtube" data-url="http://www.youtube.com/embed/${vidId}"  ></div>`
    );
    $("#youtube-embed").embed();
  }
}

if (listing.faqs && listing.faqs[0].faq_answer !== 'N/A') {
  $('#faq-section').append(`
  <div id="faq" class="sixteen wide column">
    <p id="section-title">FAQ's</p>
  </div>`)
  listing.faqs.forEach((faq, index) => { 
    if (faq.faq_answer !== 'N/A') {
      $("#faq").append(
        `<p class="faq-header" >Question #${index + 1}</p>`
      );
      $("#faq").append(`<p class="hours-text" >${faq.faq}</p>`);
      $("#faq").append(`<p class="faq-header" >Answer</p>`);
      $("#faq").append(`<p class="hours-text" >${faq.faq_answer}</p>`);
    }
  });
}

        }
       
        // END OF .THEN FROM AXIOS
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    window.history.back()
  }

  $("body").on("click", "#back-button", function() {
    sessionStorage.removeItem("listing-address");
    window.history.back();
  });

  $("body").on("click", "#back-crumb", function() {
    sessionStorage.removeItem("listing-address");
    window.history.back();
  });

  $('body').on('click', 'img.carousel-images', function () {
    console.log('clicked')
    let clickedImage = $(this).attr('src'); 
    console.log(clickedImage)
    $('#image-src').attr('src', clickedImage);
    $('#image-modal').modal('show')
  })

  $("body").on("click", "#claim-button", function() {
    const currentListing = sessionStorage.getItem('currentListing')

    if (sessionStorage.getItem('token')) {

      sessionStorage.setItem('lastLocation', 'listing'); 
      sessionStorage.setItem('claimListing', JSON.stringify({ timeStamp: new Date(), value: currentListing })); 
      sessionStorage.removeItem('currentListing');
      window.location.assign('billing__new.html'); 
    } else {

      sessionStorage.removeItem('currentListing');
      sessionStorage.setItem('lastLocation', 'listing'); 
      sessionStorage.setItem('claimListing', JSON.stringify({ timeStamp: new Date(), value: currentListing })); 
      window.location.assign('sign-in.html');
    }
  });
});

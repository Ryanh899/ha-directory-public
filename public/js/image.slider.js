$(document).ready(setTimeout(function () {
    const page = document.querySelector("div#page-container");
    const loader = document.querySelector("div#loader-div");

    $(".image-slider").slick({
        // dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        focusOnSelect: true,         
        pauseOnHover: true, 
        useCSS: true, 
        centerMode: true, 
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
            }
          },
          {
            breakpoint: 750,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });
}, 500))


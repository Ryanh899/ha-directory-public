$( function() {
    var data = [
         "Dermatologist" ,
         "Hair Care Salons" ,
         "Hair Loss / Hair Care Products & Treatments" ,
         "Hair Replacement & Hair Systems" ,
         "Laser Therapy" ,
         "Medical / Hair Transplants" ,
         "Trichologist" ,
         "Medical Hair Restoration" ,
         "Wigs / Extensions & Hair Additions" 
      ]
 
    $( "#request" ).autocomplete({
      source: data, 
      focus: function ( event, ui ) {
        $( "#request" ).val( ui.item.label );
        return false;
      }, 
      select: function ( event, ui ) {
          $('#request').val( ui.item.label ); 

          return false;
      }, 

    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        console.log(ul)
        console.log(item)
        return $( "<p class='autocomplete-text' >" + item.label + "</p>")
          .appendTo( ul );
      };

  } );
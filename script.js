$("document").ready(function(){


  //If you select the module button, display the module drop down
  $("#module").on('click', (e) =>{ $("#dropmenu").css({"display":"block"});})

  //If you click anywhere else, hide the module drop down
  $('html').click(function(e) {
      if(!$(e.target).hasClass('btn'))
      {
        $( "#dropmenu" ).slideUp("medium",function(){})
      }
  });



})

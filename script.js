$("document").ready(function(){


  //Sample Data

  // create an array with nodes
  var moduleOneNodes = new vis.DataSet([
  { id: 1, label: "PS10100" },
  { id: 2, label: "PS10101" },
  { id: 3, label: "DI10100" },
  { id: 4, label: "PS10102" },
  { id: 5, label: "DI10101" },
  ]);

  var edges = new vis.DataSet([
     ]);

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: moduleOneNodes,
    edges: edges,
  };
  var options = {};
  var network = new vis.Network(container, data, options);


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

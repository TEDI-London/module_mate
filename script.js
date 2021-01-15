$("document").ready(function(){


  //Sample Data

  // create an array with nodes
  var ENG1101 = new vis.DataSet([
  { id: 1, label: "PS10100" },
  { id: 2, label: "PS10101" },
  { id: 3, label: "DI10100" },
  { id: 4, label: "PS10102" },
  { id: 5, label: "DI10101" },
  ]);

  var ENG1102= new vis.DataSet([
  { id: 6, label: "test1" },
  { id: 7, label: "test2" },
  { id: 8, label: "test3" },
  { id: 9, label: "test4" },
  { id: 10, label: "test5" },
  ]);

  var edges = new vis.DataSet([
     ]);

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: ENG1101,
    edges: edges,
  };
  var options = {
    physics:{
      enabled: false
    },
    manipulation:{
      enabled:true,
      addNode: true,
      addEdge: true,
      editEdge: true,
      deleteNode: true,
      deleteEdge: true
    }
  };


  //If you select the module button, display the module drop down
  $("#module").on('click', (e) =>{ $("#dropmenu").css({"display":"block"});})

  //If you click anywhere else, hide the module drop down
  $('html').click(function(e) {
      if(!$(e.target).hasClass('btn'))
      {
        $( "#dropmenu" ).slideUp("medium",function(){})
      }
  });

  $("#ENG1102").on('click',(e) => {
    var data = {
      nodes: ENG1102,
      edges: edges,
    };

      var network = new vis.Network(container, data, options);

  })

  $("#ENG1101").on('click',(e) => {
    var data = {
      nodes: ENG1101,
      edges: edges,
    };

      var network = new vis.Network(container, data, options);

  })

  var network = new vis.Network(container, data, options);


})

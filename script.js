$("document").ready(function(){


  //Sample Data

  // create an array with nodes
  var ENG1101 = new vis.DataSet([
  { id: 1, label: "PS10100" },
  { id: 2, label: "PS10101" },
  { id: 3, label: "DI10100" },
  { id: 4, label: "PS10102" },
  { id: 5, label: "DI10101" },
  { id: 6, label: "PS10103" },
  { id: 7, label: "PS10104" },
  { id: 8, label: "DI10102" },
  { id: 9, label: "DI10103" },
  { id: 10, label: "DI10104" },
  { id: 11, label: "DI10105" },
  { id: 12, label: "DI10106" },
  { id: 13, label: "DI10108" },
  { id: 14, label: "ST10100" },
  { id: 15, label: "ST10101" },
  { id: 16, label: "ST10102" }
  ]);

  var ENG1102= new vis.DataSet([
  { id: 20, label: "ST10103" },
  { id: 21, label: "ST10104" },
  { id: 22, label: "ST10105" },
  { id: 23, label: "ST10106" },
  { id: 24, label: "EE10101" },
  { id: 25, label: "EE10102" },
  { id: 26, label: "EE10103" },
  { id: 27, label: "EE10104" },
  { id: 28, label: "EE10105" },
  { id: 29, label: "ME10103" },
  { id: 30, label: "ME10104" },
  { id: 31, label: "ME10105" },
  { id: 32, label: "ME10106" },
  { id: 33, label: "BS10100" }
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
  $("#module").on('click', (e) =>{ $("#dropmenu").show();})

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

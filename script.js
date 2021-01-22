$("document").ready(function(){

var mods = ["Yo","Yoo","Yooo"];

mods.forEach((item) => {
  console.log(item)
})

  //Pull List of Modules
  $.ajax({url: "modules.json", success: function(result){
   result.forEach((item) =>{
     $("#modules").append("<option value=\""+item.Module_ID+"\" id=\""+item.Module_ID+"\">"+item.Module_Title+"</option>")
     console.log(item.Module_Title)
   })
 }});

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

  var ENG1102 = new vis.DataSet([
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

  var ENG1201 = new vis.DataSet([
    { id: 34, label: "DI10107" },
    { id: 35, label: "ST10107" },
    { id: 36, label: "EE10106" },
    { id: 37, label: "EE10107" },
    { id: 38, label: "SU10100" },
    { id: 39, label: "CS10100" },
    { id: 40, label: "CS10101" },
    { id: 41, label: "CS10102" },
    { id: 42, label: "CS10103" }

  ])



  var edges = new vis.DataSet([
     ]);

  // create a network
  var container = document.getElementById("mynetwork");
  //var data = {
  //  nodes: ENG1101,
  //  edges: edges,
//  };

  function getMapHeight() {
    return (window.innerHeight - 120);

  }

  var options = {
    height: getMapHeight() + "px",
    physics:{
      enabled: true
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


/*
  //If you select the module button, display the module drop down
  $("#module").on('click', (e) =>{ $("#dropmenu").show();})

  //If you click anywhere else, hide the module drop down
  $('html').click(function(e) {
      if(!$(e.target).hasClass('btn'))
      {
        $( "#dropmenu" ).slideUp("medium",function(){})
      }
  });
*/
  //What we need to do is get a list of these values
  // For each

/*
  $("#ENG1102").on('click',(e) => {
    var data = {
      nodes: ENG1102,
      edges: edges,
    };

      var network = new vis.Network(container, data, options);

  })
*/
/*
  $("#ENG1101").on('click',(e) => {
    var data = {
      nodes: ENG1101,
      edges: edges,
    };

      var network = new vis.Network(container, data, options);

  }) */

/*
  $("#ENG1201").on('click',(e) => {
    var data = {
      nodes: ENG1201,
      edges: edges,
    };

      var network = new vis.Network(container, data, options);

  })
*/
  //var network = new vis.Network(container, data, options);

  var nodeCounter = 0;


  $("#modules").on('change',function(){
    console.log(this.value);
    const current = this.value
    //on change we should pull these nodes.
    //then we can worry about displaying them.
    $.ajax({url: "nodes.json", success: function(result){
      console.log(result)

      const liveNodes = result.filter(node => node.Module == current)

      console.log(liveNodes)
      //for each of these nodes we need to append it to the dataset object, or rather create a data set object.

      //Create a new dataset

      let currentnodes = new vis.DataSet();
      console.log(typeof(liveNodes))

      //Then for each of the life nodes, current nodes.add

      liveNodes.forEach(function(node){
        nodeCounter = nodeCounter + 1;
        currentnodes.add([{id:nodeCounter, label:node.Node_Title, shape:"dot"}])
      })

      var data = {
        nodes: currentnodes,
        edges: edges,
      };

        var network = new vis.Network(container, data, options);




    }});

  })




})

$("document").ready(function(){


  //Pull List of Modules
  $.ajax({url: "modules.json", success: function(result){
   result.forEach((item) =>{
     $("#modules").append("<option value=\""+item.Module_ID+"\" id=\""+item.Module_ID+"\">"+item.Module_Title+"</option>")
     console.log(item.Module_Title)
   })
 }});



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

  var liveNodes;
  var displayedNodes;
  var network;

  $("#modules").on('change',function(){
    console.log(this.value);
    const current = this.value
    //on change we should pull these nodes.
    //then we can worry about displaying them.
    $.ajax({url: "nodes.json", success: function(result){
      console.log(result)

      liveNodes = result.filter(node => node.Module == current)
      //for each of these nodes we need to append it to the dataset object, or rather create a data set object.
      //Create a new dataset

      var currentnodes = new vis.DataSet();

      //Then for each of the life nodes, current nodes.add

      liveNodes.forEach(function(node){
        nodeCounter = nodeCounter + 1;
        currentnodes.add([{id:node.Code, label:node.Node_Title, shape:"dot", color:"#f0d700"}])
      })

      //perhaps write the code to pull the edges too.

      var data = {
        nodes: currentnodes,
        edges: edges,
      };

      network = new vis.Network(container, data, options);

      displayedNodes = currentnodes;
    }});



  })

    $("#save").on('click', function(){
      var exportEdges =[{}]
      console.log("clicked!")
      console.log(liveNodes);
      liveNodes.forEach(node=>{

        console.log(node.Code)
        console.log(network.getConnectedNodes(node.Code,"to"));
        exportEdges[node.Code] = network.getConnectedNodes(node.Code,"to");

      })

      console.log("The export edges are");
      console.log(exportEdges)

      //write to a file
    })




})

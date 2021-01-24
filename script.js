const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
};



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


  var nodeCounter = 0;

  var liveNodes;
  var displayedNodes;
  var network;
  var currentModule;

  $("#modules").on('change',function(){
    console.log(this.value);

    const current = this.value;
    currentModule = current;
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
      console.log(currentModule);
      let file = ""
      liveNodes.forEach(node=>{

        //console.log(node.Code)
        //console.log(network.getConnectedNodes(node.Code,"to"));
        exportEdges[node.Code] = network.getConnectedNodes(node.Code,"to");
        let connects = network.getConnectedNodes(node.Code,"to");
        console.log(node.Code);
        //Loop through connects.
        connects.forEach((c) =>{

          console.log(c)
          console.log("next connection!")
          file = file + node.Code + "," + c + "\n";

        })

      })
      //write to a file
      let d = new Date();
      let month = d.getMonth()+ 1
      let day = d.getDate();
      let filename = currentModule + "[" + day + "/" + month + "]";

        downloadToFile(file,filename,"text/csv;charset=utf-8");
    })




})

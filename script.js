const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
};



$("document").ready(function(){

  //Variable to keep track of all the row ID's
  var rowIDs = [];

  //Pull List of Modules
  $.ajax({url: "modules.json", success: function(result){
   result.forEach((item) =>{
     $("#modules").append("<option value=\""+item.Module_ID+"\" id=\""+item.Module_ID+"\">"+item.Module_Title+"</option>")
     console.log(item.Module_Title)
   })
 }});

 //pull list of nodes add to modal
 $.ajax({url: "nodes.json", success: function(result){
  result.forEach((item) =>{
    let newRow = "";
    let rowID = "row_" + item.Code;
    rowIDs.push(rowID)
    newRow = newRow + "<tr><td> <div class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" id=\""+ rowID + "\"><label class=\"custom-control-label\" \"></label></div></td>";
    newRow = newRow + "<td>" + item.Node_Title + "</td>";
    newRow = newRow + "<td>" + item.Code + "</td>";
    newRow = newRow + "<td>" + item.Branch + "</td>";
    newRow = newRow + "<td>" + item.Module + "</td></tr>";

    $("#nodeTable").append(newRow)
  })
  }});

  $( "#target" ).click(function() {
    //Get a list of all the checked boxes.
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  });


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
  var currentnodes = new vis.DataSet();

  $("#modules").on('change',function(){
    currentnodes = new vis.DataSet();
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
      //Then for each of the life nodes, current nodes.add
      liveNodes.forEach(function(node){
        nodeCounter = nodeCounter + 1;
        currentnodes.add([{id:node.Code, label:node.Node_Title, shape:"dot", color:"#f0d700", core:node.Core}])
      })
      //perhaps write the code to pull the edges too.
      var data = {
        nodes: currentnodes,
        edges: edges,
      };
      network = new vis.Network(container, data, options);
      displayedNodes = currentnodes;

      setCore = document.getElementById("setCore");
      setOptional = document.getElementById("setOptional");

      network.on('click',function(properties){
        if(properties.nodes.length > 0){
          if(setCore.checked == true){
            console.log("Set Core")
            x=properties.nodes[0];
            let clickedNode = currentnodes.get(x);
            clickedNode.color = "#f0d700";
            clickedNode.core = "TRUE";
            //node.Core = "TRUE";
            console.log(clickedNode)
            currentnodes.update(clickedNode)
            //if the property was checked
          }
          else{
            if(setOptional.checked == true){
              console.log("Set Optional")
              x=properties.nodes[0];
              let clickedNode = currentnodes.get(x);
              clickedNode.color = "RGB(117,117,117)";
              clickedNode.core = "FALSE";
              console.log(clickedNode)
              currentnodes.update(clickedNode)

            }
          //alert("Nothing selected")
        }
      }})
      }});
  })

    $("#save").on('click', function(){

      var exportEdges =[{}]
      console.log("clicked!")
      console.log(currentModule);
      let file = ""
      let file2 = ""
      liveNodes.forEach(node=>{

        //console.log(node.Code)
        //console.log(network.getConnectedNodes(node.Code,"to"));
        exportEdges[node.Code] = network.getConnectedNodes(node.Code,"to");
        let connects = network.getConnectedNodes(node.Code,"to");
        console.log(node.Code);
        networkNode = currentnodes.get(node.Code);
        file2 = file2 + node.Node_Title+"," +node.Code + "," + networkNode.core + "\n"
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
      let filename = currentModule +"_EE" + "[" + day + "/" + month + "]";
        let filename2 = currentModule +"_NE" + "[" + day + "/" + month + "]";

        downloadToFile(file,filename,"text/csv;charset=utf-8");
        downloadToFile(file2,filename2,"text/csv;charset=utf-8");
    })



    //Set the check to uncheck when you check the other
    setCore = document.getElementById("setCore");
    setOptional = document.getElementById("setOptional");

    setCore.onchange = function(){
      setOptional.checked=false
    }

    setOptional.onchange = function(){
      setCore.checked= false
    }


    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("import");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }


})

//A function that downloads the CSV file client side.
const downloadToFile = (content, filename, contentType) => {
  const contentContainer = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  contentContainer.href= URL.createObjectURL(file);
  contentContainer.download = filename;
  contentContainer.click();

	URL.revokeObjectURL(contentContainer.href);
};

//A function that returns the appropriate node colour depending on whether it is
//core or optional
function getColour(corevalue){
  if(corevalue == "TRUE"){
    return "#f0d700"
  }
  else{
    return "RGB(117,117,117)"
  }
}

//Set Optional
//Given a network, this function updates core and optional status on click
//of each node.
function setOpt(properties,currentnodes){

  //Checks if you've actually clicked on a node.
  //If this value is 0 then a user hasn't selected a node
  //They have selected a blank area on the network -- therefore nothing should happen.
  if(properties.nodes.length > 0){
    //If the set core check box has been ticked.
    if(setCore.checked == true){
      //Gets the ID of the current node clicked
      x=properties.nodes[0];
      //Obtains the node object of the clicked node
      let clickedNode = currentnodes.get(x);
      //Modifes the colour and core fields appropriately
      clickedNode.color = "#f0d700";
      clickedNode.core = "TRUE";
      //Updates the list of current nodes with the new node.
      currentnodes.update(clickedNode)
    }
    else{
      //If core hasn't been selected && set optional is true
      if(setOptional.checked == true){
        //X is the ID of the clicked node.
        x=properties.nodes[0];
        //Obtain node object with ID x
        let clickedNode = currentnodes.get(x);
        //Update properties accordingly.
        clickedNode.color = "RGB(117,117,117)";
        clickedNode.core = "FALSE";
        currentnodes.update(clickedNode)
      }
    }

  }
}



$("document").ready(function(){
  //Variable to keep track of all the row ID's
  var rowIDs = [];

  //Pull List of Modules
  $.ajax({url: "modules.json", success: function(result){
    //Append each module to the drop down list on the left of the page.
   result.forEach((item) =>{
     $("#modules").append("<option value=\""+item.Module_ID+"\" id=\""+item.Module_ID+"\">"+item.Module_Title+"</option>")
   })
 }});


 //pull list of nodes add to modal
 $.ajax({url: "nodes.json", success: function(result){
  result.forEach((item) =>{
    let newRow = "";
    let rowID = "row_" + item.Code + "_" + item.Node_Title;
    rowIDs.push(rowID)
    //Populates information from the nodes into the table
    newRow = newRow + "<tr><td> <div class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" id=\""+ rowID + "\"><label class=\"custom-control-label\" \"></label></div></td>";
    newRow = newRow + "<td>" + item.Node_Title + "</td>";
    newRow = newRow + "<td>" + item.Code + "</td>";
    newRow = newRow + "<td>" + item.Branch + "</td>";
    newRow = newRow + "<td>" + item.Module + "</td></tr>";

    $("#nodeTable").append(newRow)
  })
  }});


  // create a network
  var container = document.getElementById("mynetwork");

  // Used to determine the prefered size of the window.
  //Potential Enhancement: Update this function resize of window?
  function getMapHeight() {
    return (window.innerHeight - 120);

  }
  //Define properties and attributes of editor.
  //MaxVelocity set to 3 to reduce 'spaghetti'
  //Disabled addNode and Delete node for now as additional code needs to be written
  //To define this behaviour (i.e. updating the relevant variables)
  var options = {
    height: getMapHeight() + "px",
    physics:{
      enabled: true,
      maxVelocity: 3
    },
    manipulation:{
      enabled:true,
      addNode: false,
      addEdge: true,
      editEdge: true,
      deleteNode: false,
      deleteEdge: true
    }
  };


  var nodeCounter = 0;
  var liveNodes;
  var displayedNodes;
  var network;
  var currentModule ="CUSTOM_";
  var currentnodes = new vis.DataSet();
  var edges = new vis.DataSet([]);


  $("#modules").on('change',function(){
    currentnodes = new vis.DataSet();
    edges = new vis.DataSet([]);
    const current = this.value;
    currentModule = current;
    //Pull the list of nodes
    $.ajax({url: "nodes.json", success: function(result){
      liveNodes = result.filter(node => node.Module == current)
      //for each of these nodes we need to append it to the dataset object, or rather create a data set object.
      //Create a new dataset
      //Then for each of the life nodes, current nodes.add
      liveNodes.forEach(function(node){
        nodeCounter = nodeCounter + 1;
        colour = getColour(node.Core);
        currentnodes.add([{id:node.Code, label:node.Node_Title, shape:"dot", color:colour, core:node.Core}])
      })
      }});


      //pull the edges for the current module
      $.ajax({url: "edges.json", success: function(result){

        liveEdges = result.filter(node => node.module == current)
        liveEdges.forEach((item) => {
          for (var key of Object.keys(item)) {
            if(key == "module"){
              continue;
            }
            if(typeof(item[key]) == 'object'){
              let nodelist = item[key]
              nodelist.forEach((n)=>{
                edges.add([{from:key,to:n}])
              })
            }
            else{
              edgepair = `{from: ${key}, to: ${item[key]}}`
              edges.add([{from:key,to:item[key]}])
            }

          }
        });

      }});

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
        console.log("Clicked on the network")
        if(properties.nodes.length > 0){
          if(setCore.checked == true){
            console.log("Set Core")
            x=properties.nodes[0];
            let clickedNode = currentnodes.get(x);
            clickedNode.color = "#f0d700";
            clickedNode.core = "TRUE";
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
        }
      }});
  });


  //The import nodes button
  $( "#target" ).click(function() {
    //Get a list of all the checked boxes.
    currentnodes = new vis.DataSet();
    edges = new vis.DataSet([]);

    liveNodes = [];
    let count = 0;

    //Iterate through the list of nodes that could be imported.
    rowIDs.forEach((i) => {
      //Pull relevant details
      let curr = document.getElementById(i);
      let node_code = i.slice(4,11)
      let node_title = i.slice(12,)
      if(curr.checked){
        count = count + 1;
        currentnodes.add([{id:node_code,shape:"dot", color:"#f0d700", core:"TRUE", label:node_title}])
        //When the node is added to the network, save it's data in the live nodes
        //array. This is done because the liveNodes array is the data
        //that is exported on save.
        let newNode = {}
        newNode["Node_Title"] = node_title;
        newNode["Code"] = node_code;
        newNode["Core"]= "TRUE";
        liveNodes[count]=newNode;
      }
      //Ensure's that unchecked nodes are removed from the network.
      else{
        currentnodes.remove([{id:node_code}])
        //TO-DO - Remove from the live nodes array also.
        //I think you could implement it like this
        //someArray.filter(function(el) { return el.Code != node_code; });

      }

      var data = {
        nodes: currentnodes,
        edges: edges,
      };
      network = new vis.Network(container, data, options);
      displayedNodes = currentnodes;

      network.on('click', function(properties){
        setOpt(properties,currentnodes);
      })

    });

    var modal = document.getElementById("myModal");
    modal.style.display = "none";

  });

//Export files on save
    $("#save").on('click', function(){

      var exportEdges =[{}]
      let edgeFile = ""
      let file2 = ""
      liveNodes.forEach(node=>{

        exportEdges[node.Code] = network.getConnectedNodes(node.Code,"to");
        let connects = network.getConnectedNodes(node.Code,"to");
        networkNode = currentnodes.get(node.Code);
        file2 = file2 + node.Node_Title+"," +node.Code + "," + networkNode.core + "\n"
        //Loop through connects.
        connects.forEach((c) =>{
          edgeFile = edgeFile + node.Code + "," + c + "\n";
        })

      })
      //write to a file
      let currentDate = new Date();
      let month = currentDate.getMonth()+ 1
      let day = currentDate.getDate();
      let edgeFileName = currentModule +"_EDGES" + "[" + day + "/" + month + "]";
      let nodeFileName = currentModule +"_NODES" + "[" + day + "/" + month + "]";

      downloadToFile(edgeFile,edgeFileName,"text/csv;charset=utf-8");
      downloadToFile(file2,nodeFileName,"text/csv;charset=utf-8");
    })

//Upload Nodes Button functionality
    $("#getFile").change(function() {
      //Empty the current nodes and edges
      currentnodes = new vis.DataSet();
      edges = new vis.DataSet([]);
      liveNodes = [];
      //Pull the file from Client side, create a reader to read it.
      filename = this.files[0]
      let reader = new FileReader();
      reader.readAsText(filename)
      reader.onload = function() {
        //Convert CSV file to an array of strings.
        let array = reader.result.split("\n");
        //For each row in the array, pull the title ID and corevalue.
        array.forEach((i, count)=>{

          let data = {}
          let elements = i.split(",");
          let title = elements[0];
          let id = elements[1];
          let corevalue = elements[2];
          data["Node_Title"] = title;
          data["Code"] = id;
          data["Core"]= corevalue;

          //I can't remember what edge case I was excluding here
          //I assume there was a blank node coming through?
          if(!title){
            return;
          }

          //Add new node to dataset + network
          liveNodes[count]=data;
          colour = getColour(corevalue)
          currentnodes.add([{id:id, label:title, shape:"dot", color:colour, core:corevalue}])

        })

      };

      //Refresh Network
      var data = {
        nodes: currentnodes,
        edges: edges,
      };
      network = new vis.Network(container, data, options);
      displayedNodes = currentnodes;

      //Since we're creating a new network we need to reimplement
      // the on click functionality
      network.on('click', function(properties){
          setOpt(properties,currentnodes);
        })


    });

//Uploaded Edges Button Functionality
    $("#getFile2").change(function(){
      //Empty the current edges
      edges = new vis.DataSet([]);
      //Pull the file from Client side, create a reader to read it.
      let filename = this.files[0]
      let reader = new FileReader();
      reader.readAsText(filename);
      reader.onload = function() {
      let array = reader.result.split("\n");

      array.forEach((item) => {
        if(item){
          let elements = item.split(",");
          let to = elements[0];
          let from = elements[1];

          let edgepair = `{from: ${from}, to: ${to}}`;
          edges.add([{from:from,to:to}])

        }
      });

      }
      var data = {
        nodes: currentnodes,
        edges: edges,
      };

      network = new vis.Network(container, data, options);
      displayedNodes = currentnodes;

      network.on('click', function(properties){
            setOpt(properties,currentnodes);
      })

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

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
};

function getColour(corevalue){
  if(corevalue == "TRUE"){
    return "#f0d700"
  }
  else{
    return "RGB(117,117,117)"
  }
}

function setOpt(properties,currentnodes){

  if(properties.nodes.length > 0){
    if(setCore.checked == true){
      console.log("here")
      x=properties.nodes[0];
      let clickedNode = currentnodes.get(x);
      clickedNode.color = "#f0d700";
      clickedNode.core = "TRUE";
      console.log(clickedNode)
      currentnodes.update(clickedNode)
    }
    else{
      if(setOptional.checked == true){
        console.log("there")
        x=properties.nodes[0];
        let clickedNode = currentnodes.get(x);
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
   result.forEach((item) =>{
     $("#modules").append("<option value=\""+item.Module_ID+"\" id=\""+item.Module_ID+"\">"+item.Module_Title+"</option>")
     //console.log(item.Module_Title)
   })
 }});


 //pull list of nodes add to modal
 $.ajax({url: "nodes.json", success: function(result){
  result.forEach((item) =>{
    let newRow = "";
    let rowID = "row_" + item.Code + "_" + item.Node_Title;
    rowIDs.push(rowID)
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
      enabled: true,
      maxVelocity: 3
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
  var edges = new vis.DataSet([]);


  $("#modules").on('change',function(){
    currentnodes = new vis.DataSet();
    edges = new vis.DataSet([]);
    //console.log(this.value);

    const current = this.value;
    currentModule = current;
    //Pull the list of nodes
    $.ajax({url: "nodes.json", success: function(result){
      //console.log(result)
      liveNodes = result.filter(node => node.Module == current)
      //console.log("The liveNodes are")
      //console.log(typeof(liveNodes))
      //console.log(liveNodes)
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
            //console.log(typeof(item[key]))
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
      }});
  });
  //The import nodes button
  $( "#target" ).click(function() {
    //Get a list of all the checked boxes.
    currentnodes = new vis.DataSet();
    edges = new vis.DataSet([]);

    liveNodes = [];
    let count = 0;
    rowIDs.forEach((i) => {
      //let d = {}
      let curr = document.getElementById(i);
      //console.log("Import " + i.slice(4,11) +" " +i.slice(12,))
      let n = i.slice(4,11)
      let t = i.slice(12,)
      //d["Node_Title"] = t;
      //d["Code"] = n;
      //d["Core"]= "TRUE";
      //liveNodes[count]=data;
      if(curr.checked){
        count = count + 1;
        currentnodes.add([{id:n,shape:"dot", color:"#f0d700", core:"TRUE", label:t}])
        //liveNodes.push({"Node_Title":t})
        let d = {}
        d["Node_Title"] = t;
        d["Code"] = n;
        d["Core"]= "TRUE";
        liveNodes[count]=d;


      }
      else{
        currentnodes.remove([{id:n}])

      }
      //console.log("The live nodes are now ")
      //console.log(liveNodes)

      var data = {
        nodes: currentnodes,
        edges: edges,
      };
      network = new vis.Network(container, data, options);
      displayedNodes = currentnodes;

      network.on('click', function(properties){
        setOpt(properties,currentnodes);
      })
      //network.on('click',setOptional("hello"));

    });

    var modal = document.getElementById("myModal");
    modal.style.display = "none";

  });

    $("#save").on('click', function(){

      var exportEdges =[{}]
      let file = ""
      let file2 = ""
      liveNodes.forEach(node=>{

        //console.log(node.Code)
        //console.log(network.getConnectedNodes(node.Code,"to"));
        exportEdges[node.Code] = network.getConnectedNodes(node.Code,"to");
        let connects = network.getConnectedNodes(node.Code,"to");
        //console.log(node.Code);
        networkNode = currentnodes.get(node.Code);
        file2 = file2 + node.Node_Title+"," +node.Code + "," + networkNode.core + "\n"
        //Loop through connects.
        connects.forEach((c) =>{

          //console.log(c)
          //console.log("next connection!")
          file = file + node.Code + "," + c + "\n";

        })

      })
      //write to a file
      let d = new Date();
      let month = d.getMonth()+ 1
      let day = d.getDate();
      let filename = currentModule +"_EDGES" + "[" + day + "/" + month + "]";
      let filename2 = currentModule +"_NODES" + "[" + day + "/" + month + "]";

      downloadToFile(file,filename,"text/csv;charset=utf-8");
      downloadToFile(file2,filename2,"text/csv;charset=utf-8");
    })

    //Pull uploaded files
    $("#getFile").change(function() {
      //Pull the file from Client side, create a reader to read it.

      //Empty the current nodes and edges
      currentnodes = new vis.DataSet();
      edges = new vis.DataSet([]);

      liveNodes = [];


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

          if(!title){
            return;
          }

          liveNodes[count]=data;
          colour = getColour(corevalue)
          //console.log(`The title is ${title} \n the id is ${id} \n and the core value is ${corevalue}`);
          currentnodes.add([{id:id, label:title, shape:"dot", color:colour, core:corevalue}])

        })

        //console.log("The live nodes are")
        //console.log(liveNodes)

      };

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

    $("#getFile2").change(function(){
      edges = new vis.DataSet([]);
      let filename = this.files[0]
      let reader = new FileReader();
      reader.readAsText(filename);
      reader.onload = function() {
      //console.log(reader.result);
      let array = reader.result.split("\n");

      array.forEach((item) => {
        if(item){
          //console.log("NewEdge")
          //console.log(item)
          let elements = item.split(",");
          let to = elements[0];
          let from = elements[1];

          let edgepair = `{from: ${from}, to: ${to}}`;
          //console.log(edgepair)
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

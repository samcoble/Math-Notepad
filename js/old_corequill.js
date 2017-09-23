var MQ = MathQuill.getInterface(2);

// Settings
var in_boxes = 241;

// Setup each input box
function initInput(nom,ladex,init_latex) {
	var answerSpan = document.getElementById(nom);
	var latexSpan = document.getElementById(ladex);
  	var mathField = MQ.MathField(answerSpan, {
    handlers: {
      edit: function() { // useful event handlers
         latexSpan.textContent = mathField.latex(); // simple API
      }
  	}
  });
  	mathField.latex(init_latex);
  MQ.config(new_config)
}

// Setup each input box
function initInput_void(nom,ladex) {
  var answerSpan = document.getElementById(nom);
  var latexSpan = document.getElementById(ladex);
    var mathField = MQ.MathField(answerSpan, {
    handlers: {
      edit: function() { // useful event handlers
         latexSpan.textContent = mathField.latex(); // simple API
      }
    }
  });
  MQ.config(new_config)
}

// Config object for mathquill
var new_config = {
  spaceBehavesLikeTab: false,
  leftRightIntoCmdGoes: 'up',
  restrictMismatchedBrackets: false,
  sumStartsWithNEquals: true,
  supSubsRequireOperand: true,
  charsThatBreakOutOfSupSub: '+-=<>',
  autoSubscriptNumerals: true,
  autoCommands: 'pi theta sqrt',
  autoOperatorNames: 'sin cos tan sec csc cot sinh cosh tanh sech csch coth arcsin arccos arctan arccsc arcsec arctan ln log',
  substituteTextarea: function() {
    return document.createElement('textarea');
  },
  handlers: {
    // edit: function() { latex = mathField.latex(); },
    // enter: function() { submitLatex(latex); }
  }
}

// Loops init all boxes and makes them blank

for (var i = 0; i < $('#inBoxes .in').length; i++) { 
    initInput($('#inBoxes .in')[i].id, $('#inBoxes .la')[i].id, "");
}


function getCellDelta(id) {

      // var W1 = $(id).width();
      var max = $("#inBoxes").width();
      var W1 = 31/100*max;
      var W2 = $(id).children(".mq-root-block").width();
      return W1 - W2;
}


function initBoxWidths() {

  for (var i = 0; i < 80; i++)
  { 

    var Term = 1 + i*3;

    if (getCellDelta("#in"+Term)>0) {
      document.getElementById("in"+Term).style.width = "31%";
      document.getElementById("in"+(Term+1)).style.width = "31%";
    }

    if (getCellDelta("#in"+Term)<0) {

      var max = $("#inBoxes").width();
      var new_width_a = 31/100*max-getCellDelta("#in"+Term);
      var new_width_b = 31/100*max+getCellDelta("#in"+Term);

      document.getElementById("in"+Term).style.width = new_width_a+"px";
      document.getElementById("in"+(Term+1)).style.width = new_width_b+"px";

    }
  }
}

//initBoxWidths();


document.onkeypress = function (e) {
    e = e || window.event;
    //alert(e.keyCode);

    //var focusedElement = document.activeElement.parentElement.parentElement.id;
    //console.log(getCellDelta("#"+focusedElement));




    if (e.keyCode === 13)
    {
    	// var focusedElement = document.activeElement.parentElement.parentElement.id;
    	var action = 0;

    	if (document.getElementById(focusedElement).classList.contains("justify_left")) {action = 1;}
    	if (document.getElementById(focusedElement).classList.contains("justify_center")) {action = 2;}
    	if (document.getElementById(focusedElement).classList.contains("justify_right")) {action = 3;}

		switch (action) {
		    case 1:
		        document.getElementById(focusedElement).classList.add("justify_center");
		        document.getElementById(focusedElement).classList.remove("justify_left");
		        break;
		    case 2:
		        document.getElementById(focusedElement).classList.add("justify_right");
		        document.getElementById(focusedElement).classList.remove("justify_center");
		        break;
		    case 3:
		        document.getElementById(focusedElement).classList.add("justify_left");
		        document.getElementById(focusedElement).classList.remove("justify_right");
		        break;
		}
    }
};


/*

function saveDownload() {

	var filename = document.getElementById("save_file_name").value;
	var combined_text = "";

	for (var i = 0; i < $('body .la').length; i++)
	{ 
	    combined_text += ($('body .la')[i].innerHTML + "\n")
	}

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(combined_text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}


function loadFile()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();

    fileReader.onloadend = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        var lines = textFromFileLoaded.split('\n');

		for(var line = 0; line < lines.length; line++)
		{
	    	console.log(lines[line]);
	    	initInput($('#inBoxes .in')[line].id, $('#inBoxes .la')[line].id, lines[line]);
	    }
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}


$("#btn_load").click(function() 
{
	loadFile();
});

$("#btn_save").click(function() 
{
	saveDownload();
});


*/




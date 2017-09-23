var chosenEntry = null;
var chosenEntry_name = undefined;

function waitForIO(writer, callback)
{
  // Set a watchdog to avoid eventual locking:
  var start = Date.now();
  // Wait for a few seconds
  var reentrant = function() {
    if (writer.readyState===writer.WRITING && Date.now()-start<4000)
    {
      setTimeout(reentrant, 100);
      return;
    }
    if (writer.readyState===writer.WRITING)
    {
      console.error("Write operation taking too long, aborting!"+
        " (current writer readyState is "+writer.readyState+")");
      writer.abort();
    } 
    else {callback();}
  };
  setTimeout(reentrant, 100);
}


function writeFileEntry(writableEntry, opt_blob, callback) 
{
  if (!writableEntry)
  {
    //output.textContent = 'Nothing selected.';
    return;
  }

  // Retains file name when saving
  chosenEntry_name = writableEntry.name;


  writableEntry.createWriter(function(writer)
  {
    writer.onwriteend = callback;

    // If we have data, write it to the file. Otherwise, just use the file we
    // loaded.
    if (opt_blob) {
      writer.truncate(opt_blob.size);
      waitForIO(writer, function() {
        writer.seek(0);
        writer.write(opt_blob);
      });
    } 
    else {
      chosenEntry.file(function(file) {
        writer.truncate(file.fileSize);
        waitForIO(writer, function() {
          writer.seek(0);
          writer.write(file);
        });
      });
    }
  });
}


function loadFileEntry(Entry) 
{
  chosenEntry = Entry;
	chosenEntry_name = Entry.name;

  	Entry.file(function(file) {
    readAsText(Entry, function(result) {
    $("hidden_transfer").val(result);

    var lines = result.split('\n');
    var settings = lines[0].split('/')

		$("#columns").val(settings[0]);
		$("#rows").val(settings[1]);
		$("#distribution").val(settings[2]);

		save_options();
		createGrid(editor_settings);

		for (i = 1; i <= settings[0]; i++)
		{
			for (j = 1; j <= settings[1]; j++)
			{
				var n = (i-1)*settings[1]+j;
				if (lines[n] !== undefined)
				{
		            // Fixes the interp of symbols: & > <

		            var str_fixed = lines[n].replace("&amp;", "&");
		            var str_fixed = str_fixed.replace("&gt;", ">");
		            var str_fixed = str_fixed.replace("&lt;", "<");

		            mq_field_set("col"+i+"row"+j, "latex_col"+i+"row"+j, str_fixed);

		        } else {
		        	mq_field_void("col"+i+"row"+j, "latex_col"+i+"row"+j);
		        }
			}
		}


      
    });
    //displayEntryData(chosenEntry);
  });
}




function saveAs()
{
  var combined_text = "";

  // Dimensions of the grid are stored to unpack with an open file function
  combined_text += (editor_settings.columns + "/" + editor_settings.rows + "/" + editor_settings.distribution + "\n");

  for (i = 1; i <= editor_settings.columns; i++)
  {
    for (j = 1; j <= editor_settings.rows; j++)
    {
      // combined_text += ($("#latex_col"+i+"row"+j)[0].innerHTML + "\n");
    	combined_text += (mq_field_get("col"+i+"row"+j) + "\n");
    }
  }

  $("#hidden_transfer").val(combined_text);

  var file_name = "untitled";
  if (chosenEntry_name!=undefined) {file_name = chosenEntry_name;}

  var config = {type: 'saveFile', suggestedName: file_name, accepts: [{ description: 'Text files (*.txt)',
                   extensions: ['txt']}]};


    chrome.fileSystem.chooseEntry(config, function(writableEntry) {
    var blob = new Blob([document.getElementById('hidden_transfer').value], {type: 'text/plain'});
    writeFileEntry(writableEntry, blob, function(e) {



      // Write completion message
      // output.textContent = ' Write complete :)';
    });
  });

}


/*
$("#tool_bar").find("#new_file").click(function()
{	
	var combined_text = "";
	var config = {type: 'saveFile', suggestedName: "noname", accepts: [{ description: 'Text files (*.txt)',extensions: ['txt']}]};
	combined_text += (editor_settings.columns + "/" + editor_settings.rows + "/" + editor_settings.distribution + "\n");
	$("#hidden_transfer").val(combined_text);

	console.log(document.getElementById('hidden_transfer').value);



	chrome.fileSystem.chooseEntry(config, function(writableEntry) {
	    var blob = new Blob([document.getElementById('hidden_transfer').value], {type: 'text/plain'});
	    writeFileEntry(writableEntry, blob, function(e) {

	      // Write completion message
	      // output.textContent = ' Write complete :)';
	    });
	});
	deleteGrid();
	createGrid(editor_settings);
});
*/


function readAsText(fileEntry, callback)
{
  fileEntry.file(function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      callback(e.target.result);
    };

    reader.readAsText(file);
  });
}


function openFile()
{
  var accepts = [{
    mimeTypes: ['text/*'],
    extensions: ['js', 'css', 'txt', 'html', 'xml', 'tsv', 'csv', 'rtf']
  }];
  chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function(theEntry) {
    if (!theEntry) {
      // Old status of file operations code
      // output.textContent = 'No file selected.'; 
      return;
    }
    // Use local storage to retain access to this file
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
    loadFileEntry(theEntry);
  });
}



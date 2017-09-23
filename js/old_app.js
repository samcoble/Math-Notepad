var chosenEntry = null;
var chooseFileButton = document.querySelector('#choose_file');
// var chooseDirButton = document.querySelector('#choose_dir');
var saveFileButton = document.querySelector('#save_file');
var newFileButton = document.querySelector('#new_file');
var saveOptionsButton = document.querySelector('#save_settings');
var toggleSettings = document.querySelector('#toggle_settings');
var printButton = document.querySelector('#print_button');
var output = document.querySelector('output');
var textarea = document.querySelector('textarea');


// Settings Variables
var font_size;
var line_spacing;

function errorHandler(e)
{
  console.error(e);
}

// Saves options to chrome.storage
function save_options() 
{
  var font_size_stored = document.getElementById('font_size_setting').value;
  var line_spacing_stored = document.getElementById('line_spacing_setting').value;
  chrome.storage.sync.set({
    font_size: font_size_stored,
    line_spacing: line_spacing_stored
  });
}

// Load options from chrome.storage
function restore_options() 
{
  chrome.storage.sync.get({
    font_size: '100',
    line_spacing: '40'
  }, function(items) {
    font_size = items.font_size.concat("%");
    line_spacing = items.line_spacing.concat("px");
    
    document.getElementById('font_size_setting').value = items.font_size;
    document.getElementById('line_spacing_setting').value = items.line_spacing;

    load_settings();
  });
}

function load_settings() 
{

  $('.in').css('height', line_spacing);
  $('#inBoxes').css('font-size', font_size);
}

function displayEntryData(theEntry) {
  if (theEntry.isFile) {
    chrome.fileSystem.getDisplayPath(theEntry, function(path) {
      document.querySelector('#file_path').innerHTML = path;
    });
    /* Code to get file size
    theEntry.getMetadata(function(data) {
      document.querySelector('#file_size').innerHTML = data.size+" bytes";
    });
    */
  }
  else {
    document.querySelector('#file_path').value = theEntry.fullPath;
    // document.querySelector('#file_size').textContent = "N/A";
  }
}

/* Something important I think */
function readAsText(fileEntry, callback) {
  fileEntry.file(function(file) {
    var reader = new FileReader();

    reader.onerror = errorHandler;
    reader.onload = function(e) {
      callback(e.target.result);
    };

    reader.readAsText(file);
  });
}

function writeFileEntry(writableEntry, opt_blob, callback) {
  if (!writableEntry) {
    output.textContent = 'Nothing selected.';
    return;
  }

  writableEntry.createWriter(function(writer) {

    writer.onerror = errorHandler;
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
  }, errorHandler);
}

/* No idea what this does */
function waitForIO(writer, callback) {
  // set a watchdog to avoid eventual locking:
  var start = Date.now();
  // wait for a few seconds
  var reentrant = function() {
    if (writer.readyState===writer.WRITING && Date.now()-start<4000) {
      setTimeout(reentrant, 100);
      return;
    }
    if (writer.readyState===writer.WRITING) {
      console.error("Write operation taking too long, aborting!"+
        " (current writer readyState is "+writer.readyState+")");
      writer.abort();
    } 
    else {
      callback();
    }
  };
  setTimeout(reentrant, 100);
}



// For files, read the text content into the textarea
function loadFileEntry(_chosenEntry) {
  chosenEntry = _chosenEntry;
  chosenEntry.file(function(file) {
    readAsText(chosenEntry, function(result) {
     textarea.value = result;

      var lines = result.split('\n');

      for(var line = 0; line < in_boxes-1; line++)
      {
          if(lines[line] !== undefined)
          {
            // Fixes the interp of symbols: & > <
            var str_fixed = lines[line].replace("&amp;", "&");
            var str_fixed = str_fixed.replace("&gt;", ">");
            var str_fixed = str_fixed.replace("&lt;", "<");

            initInput($('#inBoxes .in')[line].id, $('#inBoxes .la')[line].id, str_fixed);
          } else 
          {
            initInput_void($('#inBoxes .in')[line].id, $('#inBoxes .la')[line].id);
          }
      }

      

    });
    // Update display.
    saveFileButton.disabled = false; // allow the user to save the content
    saveFileButton.classList.remove("button_disabled")
    displayEntryData(chosenEntry);
  });
}

newFileButton.addEventListener('click', function(e) {

  var config = {type: 'saveFile', suggestedName: "noname", accepts: [{ description: 'Text files (*.txt)',
                   extensions: ['txt']}]};

  // My ghetto method for new file
  chrome.fileSystem.chooseEntry(config, function(writableEntry) {
    var blob = new Blob([""], {type: 'text/plain'});
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(writableEntry)});
    loadFileEntry(writableEntry);
  });

  for(var i = 0; i < in_boxes-1; i++)
  {
    initInput($('#inBoxes .in')[i].id, $('#inBoxes .la')[i].id, "");
  }

  // Update display.
  saveFileButton.disabled = false; // allow the user to save the content
  saveFileButton.classList.remove("button_disabled")

}); // End of newFileButton

/* Useless? */
// For directories, read the contents of the top-level directory (ignore sub-dirs)
// and put the results into the textarea, then disable the Save As button
function loadDirEntry(_chosenEntry) {
  chosenEntry = _chosenEntry;
  if (chosenEntry.isDirectory) {
    var dirReader = chosenEntry.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
       dirReader.readEntries (function(results) {
        if (!results.length) {
          textarea.value = entries.join("\n");
          //saveFileButton.disabled = true; // don't allow saving of the list
          //saveFileButton.classList.add("button_disabled")
          displayEntryData(chosenEntry);
        } 
        else {
          results.forEach(function(item) { 
            entries = entries.concat(item.fullPath);
          });
          readEntries();
        }
      }, errorHandler);
    };

    readEntries(); // Start reading dirs.    
  }
}

function loadInitialFile(launchData) {
  if (launchData && launchData.items && launchData.items[0]) {
    loadFileEntry(launchData.items[0].entry);
  } 
  else {
    // See if the app retained access to an earlier file or directory
    chrome.storage.local.get('chosenFile', function(items) {
      if (items.chosenFile) {
        // If an entry was retained earlier, see if it can be restored
        chrome.fileSystem.isRestorable(items.chosenFile, function(bIsRestorable) {
          // The entry is still there, load the content
          // console.info("Restoring " + items.chosenFile);
          chrome.fileSystem.restoreEntry(items.chosenFile, function(chosenEntry) {
            if (chosenEntry) {
              chosenEntry.isFile ? loadFileEntry(chosenEntry) : loadDirEntry(chosenEntry);
            }
          });
        });
      }
    });
  }
}


/* Ghetto print code. Hides, print is called, reverts back */
printButton.addEventListener('click', function(e) {

  document.querySelector("#top_bar").classList.remove("top_bar_default");
  document.querySelector("#top_bar").classList.add("top_bar_print");

  document.querySelector("#inBoxes").classList.remove("inBoxes_default");
  document.querySelector("#inBoxes").classList.add("inBoxes_print");

  document.querySelector("#html").classList.remove("scroll_overflow");
  document.querySelector("#html").classList.add("hide_overflow");

  document.querySelector("#body").classList.remove("scroll_overflow");
  document.querySelector("#body").classList.add("hide_overflow");

  //document.querySelector("#html").classList.remove("font_size_default");
  //document.querySelector("#html").classList.add("font_size_print");

  window.print();

  document.querySelector("#top_bar").classList.remove("top_bar_print");
  document.querySelector("#top_bar").classList.add("top_bar_default");

  document.querySelector("#inBoxes").classList.remove("inBoxes_print");
  document.querySelector("#inBoxes").classList.add("inBoxes_default");

  document.querySelector("#html").classList.remove("hide_overflow");
  document.querySelector("#html").classList.add("scroll_overflow");

  document.querySelector("#body").classList.remove("hide_overflow");
  document.querySelector("#body").classList.add("scroll_overflow");

  //document.querySelector("#html").classList.remove("font_size_print");
  //document.querySelector("#html").classList.add("font_size_default");

});

chooseFileButton.addEventListener('click', function(e) {
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
    // use local storage to retain access to this file
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
    loadFileEntry(theEntry);
  });
});
/* Useless directory function
chooseDirButton.addEventListener('click', function(e) {
  chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry) {
    if (!theEntry) {
      output.textContent = 'No Directory selected.';
      return;
    }
    // use local storage to retain access to this file
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
    loadDirEntry(theEntry);
  });
});
*/
saveFileButton.addEventListener('click', function(e) {


  var combined_text = "";

  for (var i = 0; i < $('body .la').length; i++)
  { 
      combined_text += ($('body .la')[i].innerHTML + "\n")
  }
  textarea.value = combined_text;


  var config = {type: 'saveFile', suggestedName: chosenEntry.name, accepts: [{ description: 'Text files (*.txt)',
                   extensions: ['txt']}]};


  chrome.fileSystem.chooseEntry(config, function(writableEntry) {
    var blob = new Blob([textarea.value], {type: 'text/plain'});
    writeFileEntry(writableEntry, blob, function(e) {
      // Write completion message
      // output.textContent = ' Write complete :)';
    });
  });
});

saveOptionsButton.addEventListener('click', function(e) 
{
  save_options();
  restore_options();
});

toggleSettings.addEventListener('click', function(e) 
{
  $("#settings_pane").toggleClass("hidden");
});

saveOptionsButton.addEventListener('click', function(e) 
{
  $("#settings_pane").toggleClass("hidden");
});


// Support dropping a single file onto this app.
var dnd = new DnDFileController('body', function(data) {
  chosenEntry = null;
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    if (item.kind == 'file' &&
        item.type.match('text/*') &&
        item.webkitGetAsEntry()) {
      chosenEntry = item.webkitGetAsEntry();
      break;
    }
  };

  if (!chosenEntry) {
    output.textContent = "Sorry. That's not a text file.";
    return;
  } 
  else {
    loadFileEntry(chosenEntry);
    output.textContent = "";
  }

  readAsText(chosenEntry, function(result) {
    textarea.value = result;
  });
  // Update display.
  saveFileButton.disabled = false;
  saveFileButton.classList.remove("button_disabled")
  displayEntryData(chosenEntry);
});


restore_options();
loadInitialFile(launchData);
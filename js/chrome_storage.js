/* Chrome Storage API */


// Defaults
var editor_settings = {
    font_size:    "100",
    line_spacing: "55",
    columns:      "4",
    rows:         "30",
    distribution: "1818",
    theme:        "light",
    hover_inset:   true,
    row_overflow: true
};


function update_settings()
{
  editor_settings.font_size = $("#font_size").val();
  editor_settings.line_spacing = $("#line_spacing").val();
  editor_settings.columns = $("#columns").val();
  editor_settings.rows = $("#rows").val();
  editor_settings.distribution = $("#distribution").val();

  load_settings(editor_settings);

  return editor_settings;
}

function load_settings(settings_get_obj)
{
  $("#font_size").val(settings_get_obj.font_size);
  $("#line_spacing").val(settings_get_obj.line_spacing);
  $("#columns").val(settings_get_obj.columns);
  $("#rows").val(settings_get_obj.rows);
  $("#distribution").val(settings_get_obj.distribution);

  $('#grid').css('font-size', settings_get_obj.font_size+"%");

  set_theme(settings_get_obj.theme);

  createGrid(settings_get_obj);

  editor_settings = settings_get_obj;
}
  
// Saves options to chrome.storage
function save_options() 
{
  chrome.storage.sync.set({
    editor_settings_stored: update_settings()
  });
}

// Load options from chrome.storage
function restore_options() 
{
  chrome.storage.sync.get({
    editor_settings_stored: editor_settings
  }, function(items) {
    load_settings(items.editor_settings_stored);
  });
  
}

function set_theme(theme)
{
  switch(theme)
  {
      case "light":
          $("html").removeClass("html_dark"); $("html").addClass("html_light");
          $("#tool_bar").removeClass("tool_bar_dark"); $("#tool_bar").addClass("tool_bar_light");
          $("#grid").removeClass("grid_dark"); $("#grid").addClass("grid_light");
          break;
      case "dark":
          $("html").removeClass("html_light"); $("html").addClass("html_dark");
          $("#tool_bar").removeClass("tool_bar_light"); $("#tool_bar").addClass("tool_bar_dark");
          $("#grid").removeClass("grid_light"); $("#grid").addClass("grid_dark");
          break;
      default:
          break;
  }
}

function set_hover_inset(bool)
{
  switch(bool)
  {
      case false:
          $(".in").removeClass("hover_inset"); $(".in").addClass("hover_no_inset");
          $("#hover_inset").removeClass("setting_toggle_button_enabled"); $("#hover_inset").addClass("setting_toggle_button_disabled");
          editor_settings.hover_inset = false;
          break;
      case true:
          $(".in").removeClass("hover_no_inset"); $(".in").addClass("hover_inset");
          $("#hover_inset").removeClass("setting_toggle_button_disabled"); $("#hover_inset").addClass("setting_toggle_button_enabled");
          editor_settings.hover_inset = true;
          break;
      default:
          break;
  }
}

function set_overflow(bool)
{
  switch(bool)
  {
      case false:
          $(".in").removeClass("overflow_visible"); $(".in").addClass("overflow_hidden");
          $("#row_overflow").removeClass("setting_toggle_button_enabled"); $("#row_overflow").addClass("setting_toggle_button_disabled");
          editor_settings.row_overflow = false;
          break;
      case true:
          $(".in").removeClass("overflow_hidden"); $(".in").addClass("overflow_visible");
          $("#row_overflow").removeClass("setting_toggle_button_disabled"); $("#row_overflow").addClass("setting_toggle_button_enabled");
          editor_settings.row_overflow = true;
          break;
      default:
          break;
  }
}


























/* app.js is called after all html */

/* Global Init */

var cursor_init = undefined;
var pane_init = undefined;

/* Drag any webview frame by grip */
$(".webview_frame_grip").mousedown(function(ei) {
    var rt = $(this);
    cursor_init = [ei.clientX, ei.clientY];
    pane_init = [rt.parent()[0].offsetLeft, rt.parent()[0].offsetTop];

    $(document).mousemove(function(e)
    {
        //cursor_init = cursor_init==undefined ? [e.clientX, e.clientY] : cursor_init;
        //pane_init = pane_init==undefined ? [rt.parent()[0].offsetLeft, rt.parent()[0].offsetTop] : pane_init;
        rt.parent().css("top", pane_init[1]+(e.clientY-cursor_init[1]) + 'px').css("left", pane_init[0]+(e.clientX-cursor_init[0]) + 'px');
        
        if (e.clientX >= chrome.app.window.getAll()[0].innerBounds["width"]) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
        if (e.clientX <= 0) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
        if (e.clientY >= chrome.app.window.getAll()[0].innerBounds["height"]-30) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
        if (e.clientY <= 0) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
    });
}).mouseup(function () {
    $(document).unbind('mousemove');
    cursor_init = undefined; pane_init = undefined;
});


/* Resize any webview frame by tow */
$(".webview_frame_resize").mousedown(function(ei) {
    var rt = $(this);
    cursor_init = [ei.clientX, ei.clientY];
    pane_init = [($(this).parent().css("width")).replace("px","")*1, ($(this).parent().css("height")).replace("px","")*1]

    $(document).mousemove(function(e)
    {
        rt.parent().css("height", pane_init[1]+(e.clientY-cursor_init[1]) + 'px').css("width", pane_init[0]+(e.clientX-cursor_init[0]) + 'px');
        
        if (e.clientX >= chrome.app.window.getAll()[0].innerBounds["width"]) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
        if (e.clientX <= 0) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
        if (e.clientY >= chrome.app.window.getAll()[0].innerBounds["height"]-30) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
        if (e.clientY <= 0) {$(document).unbind('mousemove'); cursor_init = undefined; pane_init = undefined;}
    });
}).mouseup(function () {
    $(document).unbind('mousemove');
    cursor_init = undefined; pane_init = undefined;
});


$(window).ready(function()
{
	restore_options();

});


function setWebviewURL(webview_frame_id, url) {$('#'+webview_frame_id+' .webview').attr('src', url);}



$(document).keyup(function(event)
{
    if (event.altKey && event.which==16)
    {
    	var relative_url = 'http://m.wolframalpha.com/input/?i=';
        setWebviewURL("webview_wolfram", relative_url+encodeURIComponent(mq_field_get($('.mq-focused').attr('id'))));
		$("#webview_wolfram").removeClass("hidden");
	}

    // Command: 91
    // s key: 83

    if (event.ctrlKey && event.which==83) {saveAs();}
    if (event.ctrlKey && event.which==79) {openFile();}

});


$(document).keyup(function(event)
{
    if (event.altKey)
    {
        switch(event.which)
        {
            case 37:
                shift_box("left", $('.mq-focused'));
                break;
            case 38:
                shift_box("up", $('.mq-focused'));
                break;
            case 39:
                shift_box("right", $('.mq-focused'));
                break;
            case 40:
                shift_box("down", $('.mq-focused'));
                break;
            default:
                break;
        }
    }  
});

/* File IO */

$("#tool_bar").find("#save_as").click(function() {
  saveAs();
});

$("#tool_bar").find("#open_file").click(function() {
    openFile();
});

/* Toggle webview panes */

// The x button
$(".webview_frame_hide").click(function() {
    $(this).parent().addClass("hidden");
});

$("#toggle_octave").click(function()
{
    $("#webview_octave").toggleClass("hidden");
});

$("#toggle_wolfram").click(function()
{
	$("#webview_wolfram").toggleClass("hidden");
});

$("#toggle_youtube").click(function()
{
    $("#webview_youtube").toggleClass("hidden");
});

/* Toggle buttons */

$("#hover_inset").click(function()
{
	set_hover_inset(!editor_settings.hover_inset);
});

$("#row_overflow").click(function()
{
	set_overflow(!editor_settings.row_overflow);
});

/* Set theme buttons */

$("#light").click(function()
{
	set_theme("light");
	editor_settings.theme = "light";
});

$("#dark").click(function()
{
	set_theme("dark");
	editor_settings.theme = "dark";
});

/* Save settings and visual toggle */

$("#save_settings").click(function()
{
	save_options();
	$("#editor_settings_pane").toggleClass("hidden");
});

$("#toggle_settings").click(function()
{
  $("#editor_settings_pane").toggleClass("hidden");
  $("#editor_resource_pane").addClass("hidden");
});

/* Toggle resource pane */

$("#toggle_resources").click(function()
{
  $("#editor_resource_pane").toggleClass("hidden");
  $("#editor_settings_pane").addClass("hidden");
});

$('#editor_resource_pane a').click(function()
{
	$("#editor_resource_pane").addClass("hidden");
});











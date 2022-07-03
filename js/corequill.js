var MQ = MathQuill.getInterface(2);


function addMQField(element)
{
  var n = $("in").length;
  $("#"+element).append('<span class="in" id="in'+n+'"></span>');
  $("#"+element).append('<span class="ln" id="ln'+n+'"></span>');
  mq_field_void("in"+n, "ln"+n);
}


function mq_field_get(id) {return(MQ.MathField(document.getElementById(id)).latex());}

// Rewrite this it's so trash
function mq_field_void(id,id_latex) 
{
  var answerSpan = document.getElementById(id);
  var latexSpan = document.getElementById(id_latex);
    var mathField = MQ.MathField(answerSpan, {
    handlers: {
      edit: function() { // useful event handlers
         latexSpan.textContent = mathField.latex(); // simple API
      }
    }
  });
    mathField.latex()
  MQ.config(new_config)
}

// Setup each input box
function mq_field_set(id,id_latex,latex_string)
{
  var ans = document.getElementById(id);
  var latex = document.getElementById(id_latex);
    var mathField = MQ.MathField(ans, {
    handlers: {
      edit: function() { // useful event handlers
         latex.textContent = mathField.latex(); // simple API
      }
    }
  });
    mathField.latex(latex_string);
  MQ.config(new_config)
}


function mq_field_focus(id) {MQ.MathField(document.getElementById(id)).focus();}
function mq_field_blur(id) {MQ.MathField(document.getElementById(id)).blur();}

function get_cr(cur_box)
{
  var box_cr;
  while (box_cr==undefined)
  {
    var str_fixed = cur_box.attr('id').replace("col", "");
    var str_fixed = str_fixed.replace("row", ",");
    var box_cr = str_fixed.split(",");
  }
  return box_cr;
}

function shift_box(dir, cur_box)
{

  box_cr = get_cr(cur_box);
  var prev = mq_field_get("col"+box_cr[0]+"row"+box_cr[1]);
  switch(dir) {
    case "up":
      if (box_cr[1]!=1)
      {
        var next = mq_field_get("col"+(box_cr[0]*1)+"row"+(box_cr[1]*1-1));
        mq_field_set("col"+box_cr[0]+"row"+(box_cr[1]*1-1), "latex_col"+box_cr[0]+"row"+(box_cr[1]*1-1), prev);
        mq_field_set("col"+box_cr[0]+"row"+box_cr[1], "latex_col"+box_cr[0]+"row"+box_cr[1], next);
        mq_field_blur("col"+box_cr[0]+"row"+box_cr[1]);
        mq_field_focus("col"+box_cr[0]+"row"+(box_cr[1]*1-1));
      }
      break;
    case "down":
      if (box_cr[1]!=1*editor_settings.rows)
      {
        var next = mq_field_get("col"+(box_cr[0]*1)+"row"+(box_cr[1]*1+1));
        mq_field_set("col"+box_cr[0]+"row"+(box_cr[1]*1+1), "latex_col"+box_cr[0]+"row"+(box_cr[1]*1+1), prev);
        mq_field_set("col"+box_cr[0]+"row"+box_cr[1], "latex_col"+box_cr[0]+"row"+box_cr[1], next);
        mq_field_blur("col"+box_cr[0]+"row"+box_cr[1]);
        mq_field_focus("col"+box_cr[0]+"row"+(box_cr[1]*1+1));
      }
      break;
    case "left":
      if (box_cr[0]!=1)
      {
        var next = mq_field_get("col"+(box_cr[0]*1-1)+"row"+(box_cr[1]));
        mq_field_set("col"+(box_cr[0]*1-1)+"row"+box_cr[1], "latex_col"+(box_cr[0]*1-1)+"row"+box_cr[1], prev);
        mq_field_set("col"+box_cr[0]+"row"+box_cr[1], "latex_col"+box_cr[0]+"row"+box_cr[1], next);
        mq_field_blur("col"+box_cr[0]+"row"+box_cr[1]);
        mq_field_focus("col"+(box_cr[0]*1-1)+"row"+box_cr[1]);
      }
      break;
    case "right":
      if (box_cr[0]!=1*editor_settings.columns)
      {
        var next = mq_field_get("col"+(box_cr[0]*1+1)+"row"+(box_cr[1]));
        mq_field_set("col"+(box_cr[0]*1+1)+"row"+box_cr[1], "latex_col"+(box_cr[0]*1+1)+"row"+box_cr[1], prev);
        mq_field_set("col"+box_cr[0]+"row"+box_cr[1], "latex_col"+box_cr[0]+"row"+box_cr[1], next);
        mq_field_blur("col"+box_cr[0]+"row"+box_cr[1]);
        mq_field_focus("col"+(box_cr[0]*1+1)+"row"+box_cr[1]);
      }
      break;

    default:
      break;
  }
}


function deleteGrid()
{
  $("#grid").html("");
  $("#hidden_latex").html("");
}


function checkArray(arr, l)
{
  var arr_fixed = arr;
  while (arr.length < l)
  {
    arr_fixed.push("1");
  }
  return arr_fixed;
}

function sumArray(arr, l)
{
  var rtn = 0;
  var i = 0;
  while (i < l)
  {
    rtn += arr[i]*1;
    i++;
  }
  return rtn;
}


function add_cols(start_col, len, callback)
{
  for (i = start_col; i < (1*start_col+1*len); i++)
  {
    $("#grid").append('<div class="col" id="col'+i+'"></div>');
    $("#hidden_latex").append('<div id="latex_col'+i+'"></div>');
    if (i==(1*start_col+1*len)) {callback();}
  }
}

function remove_cols(start_col, len, callback)
{
  for (i = start_col; i < (1*start_col+1*len); i++)
  {
    $("#col"+i).remove();
    $("#latex_col"+i).remove();
    if (i==(1*start_col+1*len)) {callback();}
  }
}

function add_rows(start_row, rows, col, settings_obj)
{
  for (j = start_row; j < (1*start_row+1*rows); j++)
  {
    $("#col"+col).append('<span class="in" id="col'+col+'row'+j+'"></span>');
    $("#latex_col"+col).append('<span class="la" id="latex_col'+col+'row'+j+'"></span>');
    //mq_field_void("col"+col+"row"+j, "latex_col"+col+"row"+j);

    if (j==(1*start_row+1*rows)) {setup_grid(settings_obj);}
  }
}

function remove_rows(start_row, rows, col, settings_obj)
{
  for (j = start_row; j < (1*start_row+1*rows); j++)
  {
    $("#col"+col+"row"+j).remove();
    $("#latex_col"+col+"row"+j).remove();
    if (j==(1*start_row+1*rows)) {setup_grid(settings_obj);}
  }
}

function setup_cols(settings_obj, callback)
{
  if ((settings_obj.columns-$("#grid .col").length)<0)
  {
    remove_cols(1*settings_obj.columns+1, (-1*(settings_obj.columns-$("#grid .col").length)), callback(settings_obj));
  }
  if ((settings_obj.columns-$("#grid .col").length)>0)
  {
    add_cols($("#grid .col").length+1, (settings_obj.columns-$("#grid .col").length), callback(settings_obj));
  }
  if ((settings_obj.columns-$("#grid .col").length)==0) {callback(settings_obj);}
}

function setup_rows(settings_obj)
{
  for (i = 1; i <= settings_obj.columns; i++)
  {
    if ((settings_obj.rows-$("#col"+i+" .in").length)<0)
    {
      remove_rows(1*settings_obj.rows+1, -1*(settings_obj.rows-$("#col"+i+" .in").length), i, settings_obj);
    }
    if ((settings_obj.rows-$("#col"+i+" .in").length)>0)
    {
      add_rows($("#col"+i+" .in").length+1, (settings_obj.rows-$("#col"+i+" .in").length), i, settings_obj);
    }
    if (i==settings_obj.columns && (settings_obj.rows-$("#col"+i+" .in").length)==0) {setup_grid(settings_obj);}
  }
}

function setup_grid(settings_obj)
{
  var m = 100/settings_obj.columns;
  var a = checkArray((""+settings_obj.distribution).split(""), settings_obj.columns);
  var s = sumArray(a, settings_obj.columns);
  var x = 100/(m*s);

  for (i = 1; i <= settings_obj.columns; i++)
  {
    $('#col'+i).css('width', x*m*a[i-1]+'%');

    for (j = 1; j <= settings_obj.rows; j++)
    {
      mq_field_void("col"+i+"row"+j, "latex_col"+i+"row"+j);
    }
  }



  $('.in').css('height', settings_obj.line_spacing);
  set_hover_inset(settings_obj.hover_inset);
  set_overflow(settings_obj.row_overflow);
}

function createGrid(settings_obj)
{


  setup_cols(settings_obj, setup_rows);

}



// Config object for mathquill
var new_config = {
  spaceBehavesLikeTab: false,
  leftRightIntoCmdGoes: 'up',
  restrictMismatchedBrackets: false,
  sumStartsWithNEquals: false,
  supSubsRequireOperand: true,
  charsThatBreakOutOfSupSub: '+-=<>',
  autoSubscriptNumerals: true,
  autoCommands: 'pi theta sqrt phi omega',
  autoOperatorNames: 'sin cos tan sec csc cot sinh cosh tanh sech csch coth arcsin arccos arctan arccsc arcsec arctan ln log',
  substituteTextarea: function() {
    return document.createElement('textarea');
  },
  handlers: {
    // edit: function() { latex = mathField.latex(); },
    // enter: function() { submitLatex(latex); }
  }
}

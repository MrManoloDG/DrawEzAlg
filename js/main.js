


require('./js/classes/code_struct.js');
var $array_functions = {};
var $array_main;
var $active_fun = 'main';
var $active = null;
var $canvas;
var $lang;
var $file_path = '';



function btn_struct(str) {
	$('#'+$active).removeClass("active-btn");
	$active = str;
	$('#'+$active).addClass("active-btn");
}

function change_function(fun, cl){
	return new Promise(function (resolve) {
		if($active_fun === fun && cl){
			modal_config_function(fun);
		}else{
			$('.'+$active_fun+' .nav-link').removeClass('active');
			$('.'+fun+' .nav-link').addClass('active');
			$array_functions[$active_fun]['flow'] = $array_main;
			$array_main = $array_functions[fun]['flow'];
			$active_fun = fun;
		}

		refrescar($canvas).then(function () {
			dibujar($canvas);
		});
		resolve();
	});
}

function zoom_in(){
	$canvas.scaleCanvas({
		scale: 1.2
	});
	refrescar($canvas).then(function () {
		dibujar($canvas);
	});

}

function zoom_out(){
	$canvas.scaleCanvas({
		scale: 0.8
	});
	refrescar($canvas).then(function () {
		dibujar($canvas);
	});
}

function show_tabVar() {
    $("#sidebar").css( 'width', '300px');
    $("#sidebar-btn").addClass("d-none");
}

function hidde_tabVar() {
    $("#sidebar").css( 'width', '0');
    $("#sidebar-btn").removeClass("d-none");
}

function debug_step(b) {


	if(($debug_id === 0 && $debug_function === 'main') || $debug_error){
		
		$('#outputShow p').html("");
		$debug_struct = $array_main;
		$debug_stack.push(['main', $array_main]);
		$debug_error=false;
		eval("$promesas = [];");
		if(b){
			$('#run_step').prop("disabled", true);
		}else {
			$('#run_step_inFunction').prop("disabled", true);
		}
	}
	try {
		debug_next_step(b);
	}
	catch(error) {
		$('#outputShow p').html($('#outputShow p').html()  +'<span class=\'text-warning\'>Error: ' + error.message + '</span><br>');
		// expected output: ReferenceError: nonExistentFunction is not defined
		// Note - error messages will vary depending on browser
	}
}

function run_code() {
	$('#outputShow p').html("");
	let $new_line = "\n";
	let run = 'let $promesas = [];\n\n';

	run += run_functions();

	$run_let_function_assings = [];
	run += '<-$declarations-> ' + run_arr($array_functions['main']['flow']);
	let declarations = '';
	for(let i = 0; i<$run_let_function_assings.length; i++){
				declarations += 'let '+ $run_let_function_assings[i] +';\n';	
	}
	run = run.replace("<-$declarations->", declarations);

    try {
			alert(run);
			eval(run);
    }
    catch(error) {
		console.error(error);
        $('#outputShow p').html($('#outputShow p').html()  +'<span class=\'text-warning\'>Error: ' + error.message + '</span><br>');
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}

function code() {
	modal_code();
}

function save(){
	let json = JSON.stringify($array_functions);
	let $fs = require('fs');
	if($file_path === ''){
		let { dialog,app} = require('electron').remote;
		let options = {
			defaultPath: app.getPath('documents') + '/draw.json',
		};
		dialog.showSaveDialog(null, options, (path) => {
			$file_path = path;
			let arrfile = path.split("/");
			let filename = arrfile[arrfile.length -1];

			$('title').text("DrawEzAlg - " + filename );
			try {
				$fs.writeFileSync(path , json, 'utf-8');
			}
			catch(e) {new Error(e.message); }
		});
	}
	else{
		try { $fs.writeFileSync($file_path , json, 'utf-8'); }
		catch(e) {new Error(e.message); }
	}


}




function open_file(){
	// Check for the various File API support.
	if (window.File && window.FileReader) {
		let file = document.getElementById('file').files[0];
		if(file){
			getAsText(file);
		}
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
}

function getAsText(readFile) {

	let reader = new FileReader();
	// Read file into memory as UTF-8
	reader.readAsText(readFile, "UTF-8");
	// Closure to capture the file information.
	reader.onload = (function(theFile) {
		return function(e) {
			let extension = theFile.name.split(".")[1];
			if( extension === "json" || extension === "JSON"){
				$file_path = theFile.path;
				$('title').text("DrawEzAlg - " + theFile.name );

				let json = JSON.parse(e.target.result);

				$array_functions={};
				$('#functions-nav .nav-item').each(function (e) {
					if(!$(this).hasClass('main') && !$(this).hasClass('function')){
						$(this).remove();
					}
				});
				
				for(let index in json){
					$array_functions[index] = {};
					$array_functions[index]['param'] = json[index]['param'];
					$array_functions[index]['flow'] = [];
					$array_functions[index]['type'] = json[index]['type'];
					$array_functions[index]['ioparam'] = json[index]['ioparam'];
					$array_functions[index]['desc'] = json[index]['desc'];
					if(index !== 'main') $('#functions-nav > .nav-item:eq(-2)').after('<li class="nav-item '+ index+'" onclick="change_function(\''+ index +'\',true)"><a class="nav-link">'+ index +'</a></li>');
					load_arr(json[index]['flow'], $array_functions[index]['flow']);
				}
				$array_main = $array_functions['main']['flow'];
				refrescar($canvas).then(function () {
					dibujar($canvas);
				});
			}else{
				alert("The file does not have json extension");
			}

		};
	})(readFile);
}

function change_language(lang){
	$.ajax({
			url : "./lang/"+ lang +".json",
			dataType: "text",
			success : function (data)
			{
				$lang = JSON.parse(data);
				$('#info').text($lang['config']['info']);
				$('#languages').text($lang['config']['languages']);
				$('#about').text($lang['config']['about']);
				$('#es').text($lang['languages']['es']);
				$('#en').text($lang['languages']['en']);
				$('#save').text($lang['save']);
				$('#delete').text($lang['delete']);
				$('#cancel').text($lang['cancel']);

				refrescar($canvas).then(function () {
					dibujar($canvas);
				});
			}
		}
	);
}



$(document).ready(function() {
    $array_functions['main']={};
    $array_functions['main']['param'] = $array_main;
	$array_functions['main']['flow']=[];
	$array_functions['main']['type'] = '';
	$array_functions['main']['ioparam'] = '';
	$array_functions['main']['desc'] = '';

	let ln = window.navigator.language||navigator.browserLanguage;

	change_language(ln);

	$canvas = $('#canvas');
	$array_main = $array_functions['main']['flow'];
	let JCanvas = require( './js/jcanvas.js' );
	JCanvas( $, window);

	$('#outputShow').resizable();

	let width = window.innerWidth - 20; // ancho
	let height = window.innerHeight - $('#buttons').height() - 5; // alto
	$('#contenedor').css("width", width + "px");
	$('#contenedor').css("height", height + "px");

	$( window ).resize(function() {
		let width = window.innerWidth - 20; // ancho
		let height = window.innerHeight - $('#buttons').height() - 5; // alto
		$('#contenedor').css("width", width + "px");
		$('#contenedor').css("height", height + "px");
	});

	$('#contenedor').animate({
		scrollLeft: 980
	}, 100);

	$('#file').change(function () {
		open_file();
	});



});

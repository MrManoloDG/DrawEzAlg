


require('./js/classes/code_struct.js');
var $array_functions = {};
var $array_main;
var $active_fun = 'main';
var $active = null;
var $canvas;
var $lang;



function btn_struct(str) {
	$('#'+$active).removeClass("active-btn");
	$active = str;
	$('#'+$active).addClass("active-btn");
}

function change_function(fun){
	if($active_fun === fun && fun !== 'main'){
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
}

function zoom_in(){
	$canvas.scaleCanvas({
		scale: 1.2
	});
}

function zoom_out(){
	$canvas.scaleCanvas({
		scale: 0.8
	});
}

function run_code() {
	let $new_line = "\n";
	let run = 'let $buffer_out = "";\n' +
		'let $promesas = [];\n\n';

	for(let index in $array_functions){
	    if(index !== 'main'){
	        run += 'function '+ index +'(' + $array_functions[index]['param'] + '){\n' +
                run_arr($array_functions[index]['flow']) +
                '}\n\n';
        }
    }
	run += run_arr($array_functions['main']['flow']) +
        '//alert($buffer_out);\n';
	alert(run);
    try {
			eval(run);
    }
    catch(error) {
        alert(error);
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}

function code() {
	modal_code();
}

function save(){
	let FileSaver = require('file-saver');
	let json = JSON.stringify($array_functions);
	console.log(json);
	let blob = new Blob([json], {type: "text/plain;charset=utf-8"});
	let date = new Date();
	FileSaver.saveAs(blob, "draw"+date.getTime()+".json");
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
					if(index !== 'main') $('#functions-nav > .nav-item:eq(-2)').after('<li class="nav-item '+ index+'" onclick="change_function(\''+ index +'\')"><a class="nav-link">'+ index +'</a></li>');
					console.log(index);
					console.log(json);
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
				$('#close').text($lang['close']);

				refrescar($canvas).then(function () {
					dibujar($canvas);
				});
			}
		}
	);
}



$(document).ready(function() {
    $array_functions['main']={};
    $array_functions['main']['param']=$array_main;
	$array_functions['main']['flow']=[];
	let ln = x=window.navigator.language||navigator.browserLanguage;

	change_language(ln);

	$canvas = $('#canvas');
	$array_main = $array_functions['main']['flow'];
	let JCanvas = require( './js/jcanvas.js' );
	JCanvas( $, window);


	let width = window.innerWidth - 20; // ancho
	let height = window.innerHeight - $('#buttons').height() - 30; // alto
	$('#contenedor').css("width", width + "px");
	$('#contenedor').css("height", height + "px");

	$( window ).resize(function() {
		let width = window.innerWidth - 20; // ancho
		let height = window.innerHeight - $('#buttons').height() - 30; // alto
		$('#contenedor').css("width", width + "px");
		$('#contenedor').css("height", height + "px");
	});

	$('#contenedor').animate({
		scrollLeft: 2000
	}, 100);

	$('#file').change(function () {
		open_file();
	});



});

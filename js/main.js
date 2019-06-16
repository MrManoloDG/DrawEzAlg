
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



function code() {
	modal_code();
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



var JCanvas = require( './js/jcanvas.js' );
require('./js/classes/code_struct.js');
var array_main;
var active = null;
var canvas;



function btn_struct(str) {
	active = str;
	console.log(active);
}

function zoom_in(){
	canvas.scaleCanvas({
		scale: 1.2
	});
}

function zoom_out(){
	canvas.scaleCanvas({
		scale: 0.8
	});
}

$(document).ready(function() {



	canvas = $('#canvas');
	array_main = new Array();
	JCanvas( $, window);
	//Codigo para probar
	dibujar(canvas);

	let width = window.innerWidth - 20; // ancho
	let height = window.innerHeight - $('#buttons').height() - 10; // alto
	$('#contenedor').css("width", width + "px");
	$('#contenedor').css("height", height + "px");

	$( window ).resize(function() {
		let width = window.innerWidth - 20; // ancho
		let height = window.innerHeight - $('#buttons').height() - 10; // alto
		$('#contenedor').css("width", width + "px");
		$('#contenedor').css("height", height + "px");
	});

	$('#contenedor').animate({
		scrollLeft: 2000
	}, 100);
	//fin codigo para prueba
	/*
	function dibujar(){
		//console.log("Funcion dibujar()********");
		var x = 500,y = 150;
		// Draw text
		dibujar_inicio(x,y,$canvas);
		y += $canvas.measureText('inicio').width+5 / 2;
		dibujar_linea(x,y,x,y+100,0,$canvas,array,true,'main');
		y += 100;
		for (var i = 0; i < array.length; i++) {
			array[i].dibujar(x,y,i,$canvas);
			y += $canvas.getLayer('maino'+i).height + 10;
			dibujar_linea(x,y,x,y+100,i+1,$canvas,array,true,'main');
			y += 100;
		}
		y += $canvas.measureText('inicio').width + 20 / 2;
		dibujar_fin(x,y,$canvas);

		//console.log("fin funcion dibujar *******");
	}

	$canvas.clearCanvas();
	dibujar();

	$canvas.getLayers().forEach(function(element) {
		$canvas.removeLayer(element.name);
	});


	setInterval(function () {
		$canvas.clearCanvas();
		$canvas.getLayers().forEach(function(element) {
			//console.log(element.name);
			$canvas.removeLayer(element.name);
		});
		//console.log(array);
		dibujar();
	}, 500);
	*/



});

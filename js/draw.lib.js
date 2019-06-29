const $textpx = 11;
const $y_desp = 40; 

function get_mult_width_repeat(arr) {
	let arr_if = [];
	let arr_repeat = [];
	if(Array.isArray(arr)){
		arr_if = arr.filter( e => e.type === 'if' );
		arr_repeat = arr.filter( e => e.type === 'while' || e.type ==='for');
	}
	let max_arr = 0;
	if(arr_if.length !== 0 ){
		for(let i = 0; i < arr_if.length; i++){
			max_arr = Math.max(get_mult_width_if(arr_if[i].yes,true),get_mult_width_if(arr_if[i].false,false),max_arr);
		}
		max_arr = 1 + max_arr*1;
	}
	if (arr_repeat.length !== 0){
		for (let i = 0; i < arr_repeat.length ; i++) {
			max_arr = Math.max(get_mult_width_repeat(arr_repeat[i].loop),max_arr);
		}
		max_arr = 1 + max_arr*1;
	} 
	if(max_arr === 0 ) return 1;
	else return max_arr;
}

function get_mult_width_if(arr, way) {
	let arr_if = [];
	let arr_repeat = [];
	if(Array.isArray(arr)){
		arr_if = arr.filter( e => e.type === 'if' );
		arr_repeat = arr.filter( e => e.type === 'while' || e.type ==='for');
	}
	let max_arr = 0;
	if(arr_if.length !== 0 ){
		if(way){
			for(let i = 0; i < arr_if.length; i++){
				max_arr = Math.max(get_mult_width_if(arr_if[i].no,way),max_arr);
			}
		}else {
			for(let i = 0; i < arr_if.length; i++){
				max_arr = Math.max(get_mult_width_if(arr_if[i].yes,way),max_arr);
			}
		}
		max_arr =  1 + max_arr*1;
	}
	if (arr_repeat.length !== 0){
		for (let i = 0; i < arr_repeat.length ; i++) {
			max_arr = Math.max(get_mult_width_repeat(arr_repeat[i].loop),max_arr);
		}
		max_arr =  1 + max_arr*1;
	} 
	if(max_arr === 0 ) return 1;
	else return max_arr;

}

function refrescar(canvas) {
	const promise = new Promise(function (resolve) {
		while(canvas.getLayers().length > 0){
			limpiar(canvas);
		}
		resolve(canvas);
	});

	return promise;
}

function limpiar(canvas) {
	canvas.clearCanvas();
	canvas.getLayers().forEach(function(element) {
		canvas.removeLayer(element.name);
	});
}

function dibujar(canvas) {

	var x = 1500 ,y = 150;
	// Draw text
	draw_init(x,y,canvas);
	y += canvas.measureText('inicio').height*2 + 1;
	draw_line(x,y,x,y+100,0,canvas,$array_main,true,$active_fun);
	y += 100;
	for (var i = 0; i < $array_main.length; i++) {
		$array_main[i].draw(x,y,i,canvas,$array_main);
		y += canvas.getLayer($active_fun+'o'+i).height + 10;
		draw_line(x,y,x,y+100,i+1,canvas,$array_main,true,$active_fun);
		y += 100;
	}
	y += canvas.measureText('inicio').height*2 + 5;
	draw_end(x,y,canvas);
	console.log("******** Dibujado Completo ********");
}

function draw_init(x,y,canvas) {
	canvas.drawText({
		layer: true,
		name: 'inicio',
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: ($active_fun === 'main')? $lang['start'] : $active_fun + '(' + $array_functions[$active_fun]['param'] + ')'
	});
	// Draw circle as wide as the text
	canvas.drawPath({
		layer: true,
		closed: false,
		name: 'o_inicio',
		strokeStyle: '#000',
		strokeWidth: 2,
		p1: {
			type: 'arc',
			x: x - canvas.measureText('inicio').width, y: y,
			start: 180, end: 360,
			radius: canvas.measureText('inicio').height*2
		},
		p2: {
			type: 'line',
			x1: x - canvas.measureText('inicio').width, y1: y + canvas.measureText('inicio').height*2,
			x2: x + canvas.measureText('inicio').width, y2: y + canvas.measureText('inicio').height*2
		},
		p3: {
			type: 'quadratic',
			x1: x + canvas.measureText('inicio').width, y1: y - canvas.measureText('inicio').height*2
		},
		p4: {
			type: 'arc',
			x: x + canvas.measureText('inicio').width, y: y,
			start: 0, end: 180,
			radius: canvas.measureText('inicio').height*2,
			closed: false,
		},
		p5: {
			type: 'line',
			x1: x + canvas.measureText('inicio').width, y1: y - canvas.measureText('inicio').height*2,
			x2: x - canvas.measureText('inicio').width, y2: y - canvas.measureText('inicio').height*2
		},
		mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
		},
		click: function(layer){
			modal_config_function($active_fun);
		}
	})
}

function draw_end(x,y,canvas) {
	let text = '';
	if($active_fun !== 'main' && $array_functions[$active_fun]['type'] === 'function') text = $lang['return'] + " sol";
	else text = $lang['end'];
	
	canvas.drawText({
		layer: true,
		name: 'fin',
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	}).drawPath({
		layer: true,
		closed: false,
		name: 'o_fin',
		strokeStyle: '#000',
		strokeWidth: 2,
		p1: {
			type: 'arc',
			x: x - canvas.measureText('inicio').width, y: y,
			start: 180, end: 360,
			radius: canvas.measureText('inicio').height*2
		},
		p2: {
			type: 'line',
			x1: x - canvas.measureText('inicio').width, y1: y + canvas.measureText('inicio').height*2,
			x2: x + canvas.measureText('inicio').width, y2: y + canvas.measureText('inicio').height*2
		},
		p3: {
			type: 'quadratic',
			x1: x + canvas.measureText('inicio').width, y1: y - canvas.measureText('inicio').height*2
		},
		p4: {
			type: 'arc',
			x: x + canvas.measureText('inicio').width, y: y,
			start: 0, end: 180,
			radius: canvas.measureText('inicio').height*2,
			closed: false,
		},
		p5: {
			type: 'line',
			x1: x + canvas.measureText('inicio').width, y1: y - canvas.measureText('inicio').height*2,
			x2: x - canvas.measureText('inicio').width, y2: y - canvas.measureText('inicio').height*2
		},
	})

}


function draw_line(x1,y1,x2,y2,i,canvas,array, arrow ,struct) {
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: struct +'l'+i,
		rounded: true,
		endArrow: arrow,
		arrowRadius: 15,
		arrowAngle: 90,
		x1: x1, y1: y1,
		x2: x2, y2: y2,
		mouseover: function(layer) {
			$(this).css('cursor','copy');
			layer.strokeStyle = '#FFEB3B'
	  	},
		mouseout: function(layer) {
			layer.strokeStyle = '#000';
		},
		click: function (layer) {

			switch($active){
				case 'if':
					array.splice(i,0,new If_Struct(struct));
					break;

				case 'while':
					array.splice(i,0,new While_Struct(struct));
					break;

				case 'assign':
					array.splice(i,0,new Assign_Struct(struct));
					break;

				case 'out':
					array.splice(i,0,new Out_Struct(struct));
					break;

				case 'in':
					array.splice(i,0,new In_Struct(struct));
					break;

				case 'for':
					array.splice(i,0,new For_Struct(struct));
					break;

				case 'function':
					array.splice(i,0,new Function_Struct(struct));
					break;
			}
			refrescar(canvas).then(function () {
				dibujar(canvas);
			});
			//dibujar(canvas);
		}
	});
}


function draw_if(x,y,i,canvas,o,parent_arr) {
	y+=$y_desp;
	let text = '';
	if(o.condition !== ''){
		if(o.condition.length > 18){
			text = o.condition.substring(0,18) + "...";
		}else{
			text = o.condition;
		}
	}else{
		text = $lang['condition'];
	}
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	})
	.drawPath({
	  layer: true,
		name: o.parent+'o'+i,
	  strokeStyle: '#000',
	  strokeWidth: 2,
		height: (canvas.measureText(o.parent+'t'+i).width),
		closed:true,
	  p1: {
	    type: 'line',
	    x1: x, y1: y - canvas.measureText(o.parent+'t'+i).height*2,
	    x2: x + 30 + canvas.measureText(o.parent+'t'+i).width, y2: y,
	    x3: x, y3: y + canvas.measureText(o.parent+'t'+i).height*2,
	    x4: x - 30 - canvas.measureText(o.parent+'t'+i).width, y4: y,
			x5: x, y5: y - canvas.measureText(o.parent+'t'+i).height*2,
	  },
	  mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
			canvas.attr('title', o.condition);
		},
	  mouseout: function(layer){
			canvas.removeAttr('title');
	  	},
	  click: function(layer) {
	  	  //alert("Click on: if " + layer.name);

		  modal_if(o,layer, canvas,parent_arr,i);

		}
	}).drawText({
		layer: true,
		name: o.parent+'t-no'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x + 60 + canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: $lang['no']
	}).drawText({
		layer: true,
		name: o.parent+'t-yes'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x - 60 - canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: $lang['yes']
	});

	let arrow = false;
	let arr_yes = o.yes;
	let arr_no = o.no;
	let multp_yes_width = get_mult_width_if(arr_yes,true);
	let multp_no_width = get_mult_width_if(arr_no,false);
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'lh1if'+i,
		x1: x + 30 + canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x + (130 * multp_no_width) + canvas.measureText(o.parent+'t'+i).width, y2: y
	}).drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'lh2if'+i,
		x1: x - 30 - canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x - (130 * multp_yes_width) - canvas.measureText(o.parent+'t'+i).width, y2: y
	});
	//Array SI
	let xh2 = (x - (130 * multp_yes_width) - canvas.measureText(o.parent+'t'+i).width);
	let yh2 = y;

	if(arr_yes.length>0)  arrow = true;
	draw_line(xh2,yh2,xh2,yh2+100,0,canvas,arr_yes,arrow,o.parent+'if'+i+'yes-');
	yh2 += 100;

	for (let j = 0; j < arr_yes.length; j++) {
		arr_yes[j].parent = o.parent+'if'+i+'yes-';
		arr_yes[j].draw(xh2,yh2,j,canvas,arr_yes);
		yh2 += canvas.getLayer(o.parent+'if'+i+'yes-'+'o'+j).height + 10;
		if(j >= arr_yes.length-1) arrow = false;
		draw_line(xh2,yh2,xh2,yh2+100,j+1,canvas,arr_yes, arrow,o.parent+'if'+i+'yes-');
		yh2 += 100;
	}
	//Array No
	let xh1 = (x + (130 * multp_no_width) + canvas.measureText(o.parent+'t'+i).width);
	let yh1 = y;
	if(arr_no.length>0)  arrow = true;
	draw_line(xh1,yh1,xh1,yh1+100,0,canvas,arr_no, arrow,o.parent+'if'+i+'no-');
	yh1 += 100;
	for (let j = 0; j < arr_no.length; j++) {
		arr_no[j].parent = o.parent+'if'+i+'no-';
		arr_no[j].draw(xh1,yh1,j,canvas,arr_no);
		yh1 += canvas.getLayer(o.parent+'if'+i+'no-'+'o'+j).height + 10;
		if(j >= arr_no.length-1) arrow = false;
		draw_line(xh1,yh1,xh1,yh1+100,j+1,canvas,arr_no, arrow,o.parent+'if'+i+'no-');
		yh1 += 100;
	}

	//Completar lado desigual
	if(yh1 > yh2){
		draw_line(xh2,yh2,xh2,yh1,arr_yes.length + 1,canvas,arr_yes, arrow,o.parent+'if'+i+'yes-');
		yh2 = yh1;
	}else if( yh2 > yh1){
		draw_line(xh1,yh1,xh1,yh2,arr_no.length +1,canvas,arr_no, arrow,o.parent+'if'+i+'no-');
	}

	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'l_end_if'+i,
		x1: xh1, y1: yh2,
		x2: xh2, y2: yh2
	});
	canvas.getLayer(o.parent+'o'+i).height = yh2 - (y - canvas.measureText(o.parent+'t'+i).height*2 - 2);
	//
}

function draw_assign(x,y,i,canvas, o,parent_arr) {
	
	y+=$y_desp;
	let text = "";
	text += o.variable + " <- " + o.value ;
	
	if(text !== " <- "){
		if(text.length > 18){
			text = text.substring(0,18) + "...";
		}else{
			text = text;
		}
	}else{
		text = $lang['assign'];
	}
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y:  y - $y_desp/2,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text === " <- " ? $lang['assign'] : text
	}).drawRect({
		layer:true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'o'+i,
		fromCenter: true,
		x: x  , y: y - $y_desp/2,
		width: (canvas.measureText(o.parent+'t'+i).width + 30),
		height:  canvas.measureText(o.parent+'t'+i).height + 15 ,
		mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
			canvas.attr('title', o.variable + " <- " + o.value);
		},
	  	mouseout: function(layer){
			canvas.removeAttr('title');
	  	},
		click: function(layer) {
			//alert("Click on: Assing" + layer.name);
			modal_assign(o,layer,canvas,parent_arr,i);
		}
	});

}

function draw_input(x,y,i,canvas, o,parent_arr) {
	y+=$y_desp;

	let text = '';
	if(o.variable !== ''){
		if(o.variable.length > 18){
			text = o.variable.substring(0,18) + "...";
		}else{
			text = o.variable;
		}
	}else{
		text = $lang['input'];
	}
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	});
	let height = canvas.measureText(o.parent+'t'+i).height + 20;
	let width = canvas.measureText(o.parent+'t'+i).width + 20;
	canvas.drawPath({
		layer: true,
		name: o.parent+'o'+i,
		strokeStyle: '#000',
		strokeWidth: 2,
		height: height*2,
		closed:true,
		p1: {
			type: 'line',
			x1: x - width, y1: y + height,
			x2: x - width, y2: y - height/2 + 5,
			x3: x + width, y3: y - height,
			x4: x + width, y4: y + height,
			x5: x - width, y5: y + height,
		},
		mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
			canvas.attr('title', o.variable);
		},
	  	mouseout: function(layer){
			canvas.removeAttr('title');
	  	},
		click: function(layer) {
			//alert("Click on: lectura " + layer.name);
			modal_input(o,layer,canvas,parent_arr,i);

		}
	})
}

function draw_output(x,y,i,canvas,o,parent_arr) {
	y+=$y_desp;
	let text = '';

	if(o.buffer_out !== ''){
		if(o.buffer_out.length > 18){
			text = o.buffer_out.substring(0,18) + "...";
		}else{
			text = o.buffer_out;
		}
	}else{
		text = $lang['output'];
	}

	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	});
	let height = canvas.measureText(o.parent+'t'+i).height + 20;
	let width = canvas.measureText(o.parent+'t'+i).width + 20;
	canvas.drawPath({
		layer: true,
		name: o.parent+'o'+i,
		strokeStyle: '#000',
		strokeWidth: 2,
		height: height*2,
		closed:false,
		p1: {
			type: 'line',
			x1: x + width/2, y1: y + height,
			x2: x - width/2, y2: y + height,
			x3: x - ($y_desp + width/2), y3: y,
			x4: x - width/2, y4: y - height,
			x5: x + width/2, y5: y - height
		},
		p2:	{
			type: 'arc',
			x: x + width/2, y: y,
			start: 0, end: 180,
			radius: height
		},
		mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
			canvas.attr('title', o.buffer_out);
		},
	  	mouseout: function(layer){
			canvas.removeAttr('title');
	  	},
		click: function(layer) {
			//alert("Click on: escritura " + layer.name);
			modal_output(o,layer,canvas,parent_arr,i);

		}
	})
}

function draw_function(x,y,i,canvas, o,parent_arr) {
	y+=$y_desp;
	let text = '';
	if(o.name !== ''){
		if(o.name.length > 18){
			text = o.name.substring(0,18) + "...";
		}else{
			text = o.name;
		}
	}else{
		text = $lang['function'];
	}
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	});
	let height = canvas.measureText(o.parent+'t'+i).height + 20;
	let width = canvas.measureText(o.parent+'t'+i).width + 20;
	canvas.drawRect({
		layer:true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'o'+i,
		fromCenter: true,
		x: x  , y: y,
		width: width*2,
		height:  height*2,
		mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
			canvas.attr('title', o.name + '(' + o.param + ')');
		},
	  	mouseout: function(layer){
			canvas.removeAttr('title');
	  	},
		click: function(layer) {
			//alert("Click on: lectura " + layer.name);

			modal_function(o,layer,canvas,parent_arr,i);

		}
	}).drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent +i+'line1',
		x1: x - width/2 - 10, y1: y - height,
		x2: x - width/2 - 10, y2: y + height
	}).drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent +i+'line2',
		x1: x + width/2 + 10, y1: y - height,
		x2: x + width/2 + 10, y2: y + height
	})
}


function draw_while(x,y,i,canvas,o,parent_arr) {
	y+=$y_desp;
	let text = '';
	if(o.condition !== ''){
		if(o.condition.length > 18){
			text = o.condition.substring(0,18) + "...";
		}else{
			text = o.condition;
		}
	}else{
		text = $lang['condition'];
	}
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	})
	.drawPath({
		layer: true,
		name: o.parent+'o'+i,
		strokeStyle: '#000',
		strokeWidth: 2,
		height: (canvas.measureText(o.parent+'t'+i).width),
		closed:true,
		p1: {
			type: 'line',
			x1: x, y1: y - canvas.measureText(o.parent+'t'+i).height*2,
			x2: x + 30 + canvas.measureText(o.parent+'t'+i).width, y2: y,
			x3: x, y3: y + canvas.measureText(o.parent+'t'+i).height*2,
			x4: x - 30 - canvas.measureText(o.parent+'t'+i).width, y4: y,
			x5: x, y5: y - canvas.measureText(o.parent+'t'+i).height*2,
		},
		mouseover: function(layer) {
			$(this).css('cursor', 'pointer');
			canvas.attr('title', o.condition);
		},
	  	mouseout: function(layer){
			canvas.removeAttr('title');
	  	},
		click: function(layer) {
			//alert("Click on: while " + layer.name);

			modal_while(o,layer,canvas,parent_arr,i);

		}
	})
	.drawText({
		layer: true,
		name: o.parent+'t-no'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x + 60 + canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: $lang['no']
	});

	let arr = o.loop;
	let multp_width = get_mult_width_repeat(arr);
	let yloop = y + canvas.measureText(o.parent+'t'+i).height*2;
	let arrow = false;
	if(arr.length>0)  arrow = true;
	draw_line(x,yloop,x,yloop+100,0,canvas,arr,arrow,o.parent+'while'+i+'loop');
	yloop += 100;

	for (let j = 0; j < arr.length; j++) {
		arr[j].parent = o.parent+'while'+i+'loop';
		arr[j].draw(x,yloop,j,canvas,arr);
		yloop += canvas.getLayer(o.parent+'while'+i+'loop'+'o'+j).height + 10;
		if(j >= arr.length-1) arrow = false;
		draw_line(x,yloop,x,yloop+100,j+1,canvas,arr, arrow,o.parent+'while'+i+'loop');
		yloop += 100;
	}
	//Draw Return back
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		rounded: true,
		endArrow: true,
		intangible: true,
		arrowRadius: 15,
		arrowAngle: 90,
		name: o.parent + 'lhwhile'+i+'-return',
		x1: x, y1: yloop,
		x2: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y2: yloop,
		x3: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y3: y - canvas.measureText(o.parent+'t'+i).height*4,
		x4: x -10, y4: y - canvas.measureText(o.parent+'t'+i).height*4
	});
	//Draw no lines
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		intangible: true,
		name: o.parent + 'lhwhile'+i+'-h1',
		x1: x + 30 + canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y2: y,
		x3: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y3: yloop + canvas.measureText(o.parent+'t'+i).height*4,
		x4: x, y4: yloop + canvas.measureText(o.parent+'t'+i).height*4
	});

	canvas.getLayer(o.parent+'o'+i).height = (yloop + canvas.measureText(o.parent+'t'+i).height*4) - (y - canvas.measureText(o.parent+'t'+i).height*2 - 2);

}

function draw_for(x,y,i,canvas,o,parent_arr) {
	y+=$y_desp;
	let str_condition = '';
	let str_increment = '';
	if(o.way === 'increment'){
		str_condition = '<=';
		str_increment = '+';
	}else if(o.way === 'decrement'){
		str_condition = '>=';
		str_increment = '-';
	}
	let text = o.variable +"="+o.initialization +"; "+ o.variable + str_condition + o.condition + "; "+ o.variable + str_increment + o.incremental;
	if(text.length > 18){
		text = text.substring(0,18) + "...";
	}else{
		text = text;
	}
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: $textpx+'pt',
		fontFamily: 'Verdana, sans-serif',
		text: text
	})
		.drawPath({
			layer: true,
			name: o.parent+'o'+i,
			strokeStyle: '#000',
			strokeWidth: 2,
			height: (canvas.measureText(o.parent+'t'+i).width),
			closed:true,
			p1: {
				type: 'line',
				x1: x, y1: y - canvas.measureText(o.parent+'t'+i).height*2,
				x2: x + 30 + canvas.measureText(o.parent+'t'+i).width, y2: y,
				x3: x, y3: y + canvas.measureText(o.parent+'t'+i).height*2,
				x4: x - 30 - canvas.measureText(o.parent+'t'+i).width, y4: y,
				x5: x, y5: y - canvas.measureText(o.parent+'t'+i).height*2,
			},
			mouseover: function(layer) {
				$(this).css('cursor', 'pointer');
				canvas.attr('title', o.variable +"="+o.initialization +"; "+ o.variable + str_condition + o.condition + "; "+ o.variable + str_increment + o.incremental);
			},
			  mouseout: function(layer){
				canvas.removeAttr('title');
			  },
			click: function(layer) {
				//alert("Click on: for " + layer.name);
				modal_for(o,layer,canvas, parent_arr, i);

			}
		}).drawLine({
			layer: true,
			strokeStyle: '#000',
			strokeWidth: 2,
			name: o.parent + 'lhfor'+i+'romb',
			x1: x - 30 - canvas.measureText(o.parent+'t'+i).width + 0.15*canvas.measureText(o.parent+'t'+i).width, y1: y + 0.03*canvas.measureText(o.parent+'t'+i).width,
			x2: x + 0.15*canvas.measureText(o.parent+'t'+i).width, y2: y - canvas.measureText(o.parent+'t'+i).height*2 + 0.03*canvas.measureText(o.parent+'t'+i).width
})
		.drawText({
			layer: true,
			name: o.parent+'t-no'+i,
			fillStyle: '#36c',
			strokeWidth: 1,
			x: x + 60 + canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
			fontSize: $textpx+'pt',
			fontFamily: 'Verdana, sans-serif',
			text: $lang['no']
		});

	let arr = o.loop;
	let multp_width = get_mult_width_repeat(arr);
	let yloop = y + canvas.measureText(o.parent+'t'+i).height*2;
	let arrow = false;
	if(arr.length>0)  arrow = true;
	draw_line(x,yloop,x,yloop+100,0,canvas,arr,arrow,o.parent+'for'+i+'loop');
	yloop += 100;

	for (let j = 0; j < arr.length; j++) {
		arr[j].parent = o.parent+'for'+i+'loop';
		arr[j].draw(x,yloop,j,canvas,arr);
		yloop += canvas.getLayer(o.parent+'for'+i+'loop'+'o'+j).height + 10;
		if(j >= arr.length-1) arrow = false;
		draw_line(x,yloop,x,yloop+100,j+1,canvas,arr, arrow,o.parent+'for'+i+'loop');
		yloop += 100;
	}
	//Draw Return back
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		rounded: true,
		endArrow: true,
		intangible: true,
		arrowRadius: 15,
		arrowAngle: 90,
		name: o.parent + 'lhfor'+i+'-return',
		x1: x, y1: yloop,
		x2: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y2: yloop,
		x3: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y3: y - canvas.measureText(o.parent+'t'+i).height*4,
		x4: x -10, y4: y - canvas.measureText(o.parent+'t'+i).height*4
	});
	//Draw no lines
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		intangible: true,
		name: o.parent + 'lhfor'+i+'-h1',
		x1: x + 30 + canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y2: y,
		x3: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y3: yloop + canvas.measureText(o.parent+'t'+i).height*4,
		x4: x, y4: yloop + canvas.measureText(o.parent+'t'+i).height*4
	});
	canvas.getLayer(o.parent+'o'+i).height = (yloop + canvas.measureText(o.parent+'t'+i).height*4) - (y - canvas.measureText(o.parent+'t'+i).height*2 - 2);
}



function dibujar_inicio(x,y,canvas) {
	canvas.drawText({
		layer: true,
		name: 'inicio',
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'Inicio'
	})
	// Draw circle as wide as the text
	.drawArc({
		layer: true,
		name: 'o_inicio',
		strokeStyle: '#000',
		strokeWidth: 2,
		x: x, y: y,
		radius: canvas.measureText('inicio').width+5 / 2
	});
}

function dibujar_fin(x,y,canvas) {
	canvas.drawText({
		layer: true,
		name: 'fin',
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'Fin'
	})
	// Draw circle as wide as the text
	.drawArc({
		layer: true,
		name: 'o_fin',
		strokeStyle: '#000',
		strokeWidth: 2,
		x: x, y: y,
		radius: canvas.measureText('inicio').width+5 / 2
	});
}

function dibujar_cuadrado(x,y,i,canvas) {
	canvas.drawRect({
		layer:true,
		fillStyle: '#FFF',
		strokeStyle: '#000',
		strokeWidth: 2,
		name: 'o'+i,
		i: i,
		x: x, y: y + (100+20)/2,
		width: 200,
		height: 100,
		click: function(layer) {
			alert("Click on: " + layer.name);
		}
	});
}

function dibujar_linea(x1,y1,x2,y2,i,canvas,array, arrow ,struct) {
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
	  },
		click: function (layer) {
			alert(layer.name);

			switch(active){
				case 'if':
					array.splice(i,0,new If_Struct(struct));
				break;

				case 'while':
					array.splice(i,0,new While_Struct(struct));
				break;

				case 'assing':
					array.splice(i,0,new Assing_Struct(struct));
				break;

				case 'out':
					array.splice(i,0,new Out_Struct(struct));
				break;

				case 'in':
					array.splice(i,0,new In_Struct(struct));
				break;

				default:
					array.splice(i,0,new Code_Struct('default',struct));
			}

		}
	});
}


function dibujar_if(x,y,i,canvas,o) {
	y+=canvas.measureText('inicio').width;
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: o.condition
	})
	.drawPath({
	  layer: true,
		name: o.parent+'o'+i,
	  strokeStyle: '#000',
	  strokeWidth: 2,
		height: (canvas.measureText('t'+i).width),
		closed:true,
	  p1: {
	    type: 'line',
	    x1: x, y1: y - canvas.measureText('t'+i).width/2,
	    x2: x + 30 + canvas.measureText('t'+i).width, y2: y,
	    x3: x, y3: y + canvas.measureText('t'+i).width/2,
	    x4: x - 30 - canvas.measureText('t'+i).width, y4: y,
			x5: x, y5: y - canvas.measureText('t'+i).width/2,
	  },
	  click: function(layer) {
			alert("Click on: " + layer.name);
		}
	})
	.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: 'lh1if'+i,
		x1: x + 30 + canvas.measureText('t'+i).width, y1: y,
		x2: x + 130 + canvas.measureText('t'+i).width, y2: y
	}).drawLine({
			layer: true,
			strokeStyle: '#000',
			strokeWidth: 2,
			name: 'lh2if'+i,
			x1: x - 30 - canvas.measureText('t'+i).width, y1: y,
			x2: x - 130 - canvas.measureText('t'+i).width, y2: y
	});
	//Array SI
	var arr_yes = o.yes;
	xh2 = (x - 130 - canvas.measureText('t'+i).width);
	yh2 = y;
	dibujar_linea(xh2,yh2,xh2,yh2+100,0,canvas,arr_yes,false,'if'+i+'yes-');
	yh2 += 100;
	for (var j = 0; i < arr_yes.length; j++) {
		arr_yes[j].dibujar(xh2,yh2,j,canvas);
		y += canvas.getLayer(o.parent+'o'+j).height + 10;
		dibujar_linea(xh2,yh2,xh2,yh2+100,j+1,canvas,arr_yes,false,'if'+i+'yes-');
		yh2 += 100;
	}
	//Array No
	var arr_no = o.no;
	xh1 = (x + 130 + canvas.measureText('t'+i).width);
	yh1 = y;
	dibujar_linea(xh1,yh1,xh1,yh1+100,0,canvas,arr_no,false,'if'+i+'no-');
	yh1 += 100;
	for (var j = 0; j < arr_no.length; j++) {
		arr_no[j].dibujar(xh1,yh1,j,canvas);
		y += canvas.getLayer(o.parent+'o'+j).height + 10;
		dibujar_linea(xh1,yh1,xh1,yh1+100,j+1,canvas,arr_no,false,'if'+i+'no-');
		yh1 += 100;
	}
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: 'l_end_if'+i,
		x1: x - 130 - canvas.measureText(o.parent+'t'+i).width, y1: yh2,
		x2: x + 130 + canvas.measureText(o.parent+'t'+i).width, y2: yh2
	});
	console.log(i);
	console.log('o'+i);
	canvas.getLayer(o.parent+'o'+i).height = yh2 - (y - canvas.measureText(o.parent+'t'+i).width/2);
	//
}
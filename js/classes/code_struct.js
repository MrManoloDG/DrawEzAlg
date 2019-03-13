'use strict';

class Code_Struct{
	constructor(type, parent){
		this.type = type;
		this.parent = parent;
	}
	dibujar(x,y,i,canvas) {
		dibujar_cuadrado(x,y,i,canvas);
	}
}

class If_Struct extends Code_Struct{
	constructor(parent){
		super('if', parent);
		this.parent = parent;
		this.condition = "condition";
		this.yes = [];
		this.no  = [];
	}
	dibujar(x,y,i,canvas){
		dibujar_if(x,y,i,canvas,this);
	}
}

class While_Struct extends Code_Struct{
	constructor(parent){
		super('while', parent);

		this.condition = "condition";
		this.loop = [];
	}
}

class For_Struct extends While_Struct{
	constructor(parent){
		super(parent);
		this.variable = "i";
		this.incremental = "i++";
	}
}

class Assing_Struct extends Code_Struct{
	constructor(parent){
		super('assing', parent);
		this.list = [];
	}
	dibujar(x,y,i,canvas) {
		dibujar_cuadrado(x,y,i,canvas, this);
	}
}

class Out_Struct extends Code_Struct{
	constructor(parent){
		super('out', parent);
	}

	dibujar(x, y, i, canvas) {
		dibujar_escritura(x,y,i,canvas,this);
	}
}

class In_Struct extends Code_Struct{
	constructor(parent){
		super('in', parent);
	}
	dibujar(x,y,i,canvas){
		dibujar_lectura(x,y,i,canvas,this);
	}
}

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
		this.yes = new Array();
		this.no  = new Array();
	}
	dibujar(x,y,i,canvas){
		dibujar_if(x,y,i,canvas,this);
	}
}

class While_Struct extends Code_Struct{
	constructor(parent){
		super('while', parent);

		this.condition = "condition";
		this.loop = new Array();
	}
}

class Assing_Struct extends Code_Struct{
	constructor(parent){
		super('assing', parent);
		this.list = new Array();
	}
	dibujar(x,y,i,canvas) {
		dibujar_cuadrado(x,y,i,canvas);
	}
}

class Out_Struct extends Code_Struct{
	constructor(parent){
		super('out', parent);
	}
}

class In_Struct extends Code_Struct{
	constructor(parent){
		super('in', parent);
	}
}

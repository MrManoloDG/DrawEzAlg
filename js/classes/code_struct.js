'use strict';

class Code_Struct{
	constructor(type, parent){
		this.type = type;
		this.parent = parent;
	}

}

class If_Struct extends Code_Struct{
	constructor(parent){
		super('if', parent);
		this.parent = parent;
		this.condition = "";
		this.yes = [];
		this.no  = [];
	}
	dibujar(x,y,i,canvas,parent_arr){
		dibujar_if(x,y,i,canvas,this,parent_arr);
	}
}

class While_Struct extends Code_Struct{
	constructor(parent){
		super('while', parent);

		this.condition = "";
		this.loop = [];
	}

	dibujar(x, y, i, canvas,parent_arr) {
		dibujar_while(x,y,i,canvas,this,parent_arr);
	}
}

class For_Struct extends While_Struct{
	constructor(parent){
		super(parent);
		this.type = 'for';
		this.variable = "i";
		this.initialization = "0";
		this.incremental = "i++";
	}

	dibujar(x, y, i, canvas,parent_arr) {
		dibujar_for(x,y,i,canvas,this,parent_arr);
	}
}

class Assing_Struct extends Code_Struct{
	constructor(parent){
		super('assing', parent);
		this.list = [];
	}
	dibujar(x,y,i,canvas,parent_arr) {
		dibujar_assing(x,y,i,canvas, this,parent_arr);
	}
}

class Out_Struct extends Code_Struct{
	constructor(parent){
		super('out', parent);
		this.buffer_out = '';
	}

	dibujar(x, y, i, canvas,parent_arr) {
		dibujar_escritura(x,y,i,canvas,this,parent_arr);
	}
}

class In_Struct extends Code_Struct{
	constructor(parent){
		super('in', parent);
		this.variable = "";
	}
	dibujar(x,y,i,canvas,parent_arr){
		dibujar_lectura(x,y,i,canvas,this,parent_arr);
	}
}

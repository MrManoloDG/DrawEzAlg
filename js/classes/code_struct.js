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
	draw(x,y,i,canvas,parent_arr){
		draw_if(x,y,i,canvas,this,parent_arr);
	}
}

class While_Struct extends Code_Struct{
	constructor(parent){
		super('while', parent);

		this.condition = "";
		this.loop = [];
	}

	draw(x, y, i, canvas,parent_arr) {
		draw_while(x,y,i,canvas,this,parent_arr);
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

	draw(x, y, i, canvas,parent_arr) {
		draw_for(x,y,i,canvas,this,parent_arr);
	}
}

class Assign_Struct extends Code_Struct{
	constructor(parent){
		super('assign', parent);
		this.list = [];
	}
	draw(x,y,i,canvas,parent_arr) {
		draw_assign(x,y,i,canvas, this,parent_arr);
	}
}

class Function_Struct extends Code_Struct{
	constructor(parent){
		super('function', parent);
		this.name = ""
	}
	draw(x,y,i,canvas,parent_arr) {
		draw_function(x,y,i,canvas, this,parent_arr);
	}
}

class Out_Struct extends Code_Struct{
	constructor(parent){
		super('out', parent);
		this.buffer_out = '';
	}

	draw(x, y, i, canvas,parent_arr) {
		draw_output(x,y,i,canvas,this,parent_arr);
	}
}

class In_Struct extends Code_Struct{
	constructor(parent){
		super('in', parent);
		this.variable = "";
	}
	draw(x,y,i,canvas,parent_arr){
		draw_input(x,y,i,canvas,this,parent_arr);
	}
}

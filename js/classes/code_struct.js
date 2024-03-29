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
	check_errors(){
		if(this.condition === ""){
			throw new Error("If has empty fields");
		}
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

	check_errors(){
		if(this.condition === ""){
			throw new Error("While has empty fields");
		}
	}
}

class For_Struct extends While_Struct{
	constructor(parent){
		super(parent);
		this.type = 'for';
		this.variable = "";
		this.initialization = "";
		this.incremental = "";
		this.way = "increment";
	}

	draw(x, y, i, canvas,parent_arr) {
		draw_for(x,y,i,canvas,this,parent_arr);
	}
	
	check_errors(){
		if(this.variable === "" || this.initialization === "" || this.incremental === "" || this.condition === ""){
			throw new Error("For has empty fields");
		}
	}
}

class Assign_Struct extends Code_Struct{
	constructor(parent){
		super('assign', parent);
		this.variable = '';
		this.value = '';
	}
	draw(x,y,i,canvas,parent_arr) {
		draw_assign(x,y,i,canvas, this,parent_arr);
	}

	check_errors(){
		if(this.variable === '' || this.value === ''){
			throw new Error("Assign has empty fields")
		}
	}
}

class Function_Struct extends Code_Struct{
	constructor(parent){
		super('function', parent);
		this.name = "";
		this.param = "";
	}
	draw(x,y,i,canvas,parent_arr) {
		draw_function(x,y,i,canvas, this,parent_arr);
	}

	check_errors(){
		if(this.name === ""){
			throw new Error("Function has empty fields");
		}
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

	check_errors(){
		if(this.buffer_out === ''){
			throw new Error("Output has empty field");
		}
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

	check_errors(){
		if(this.variable === ""){
			throw new Error("Input has empty field");
		}
	}
}

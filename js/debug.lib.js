var $debug_id = {'main': 0};
var $debug_struct;
var $debug_function = 'main';
var $debug_function_name = 'main';
var $debug_vars = [];
var $debug_stack = new Stack();
var $debug_var_stack = new Stack();

function debug_init() {
    $debug_id = {'main': 0};
    $debug_struct;
    $debug_function = 'main';
    $debug_vars = [];
    $debug_stack = new Stack();
    $debug_var_stack = new Stack();

    $('.var-tableBody').empty();
    refrescar($canvas).then(function () {
        dibujar($canvas);
    });
}

function debug_show_vars() {
    show_tabVar();
    $('.var-tableBody').empty();
    for (let $i = 0; $i < $debug_vars.length ; $i++) {
        $('.var-tableBody').append('<tr><td>'+$debug_vars[$i]+'</td><td>'+eval($debug_vars[$i])+'</td>');
    }
   }
function debug_uncol_prev_element(element) {
    $canvas.getLayer(element.parent + 'o' + ($debug_id[$debug_function] - 1)).strokeStyle = '#000';
}

function debug_col_element(element,change_f){
    return new Promise(function (resolve) {
        if($debug_id[$debug_function] > 0 && !change_f){
            debug_uncol_prev_element(element);
        }else if($debug_function !== 'main' && !change_f){
            $canvas.getLayer($debug_function).strokeStyle = '#000';
        }
        $canvas.getLayer(element.parent + 'o' + $debug_id[$debug_function]).strokeStyle = '#150fff';

        resolve();
    });
}

//Return if the name of current function had changed
function debug_getFunctionName(e) {
    for(let index in $array_functions){
        if(e.parent.indexOf(index) === 0 && index !== $debug_function_name){
            $debug_function_name = index;
            return true;
        }
    }
    return false;
}

function debug_next_step(b) {
    if($debug_id[$debug_function] < $debug_struct.length){
        let element = $debug_struct[$debug_id[$debug_function]];
        let change = debug_getFunctionName(element);
        if(change){
            change_function($debug_function_name).then(function () {
                debug_col_element(element,change).then(function () {
                    debug_struct(element,b);
                });
            });
        }else{
            debug_col_element(element,change).then(function () {
                debug_struct(element,b);
            });
        }
    } else {
        debug_uncol_prev_element($debug_struct[$debug_id[$debug_function]-1]);
        if($debug_function.indexOf($debug_function_name) < 0 && $debug_function_name !== 'main'){
            for (let i = 0; i < $debug_vars.length; i++) {
                eval('delete ' + $debug_vars + ';');
            }
            debug_popVarStack();
        }
        console.log($debug_function);
        console.log($debug_function_name);
        if($debug_function !== $debug_function_name){
            $debug_stack.pop();
            delete $debug_id[$debug_function];
            let stack_peek = $debug_stack.peek();
            $debug_function = stack_peek[0];
            $debug_struct = stack_peek[1];
            //next step to debug of before struct
            debug_next_step();
        } else {
            debug_init();
        }
    }
}

function debug_struct(element,b){
    let str = '';
    switch(element.type){
        case 'if':
            $debug_id[$debug_function] += 1;
            debug_if(element);
            break;

        case 'while':
            debug_while(element);
            break;

        case 'assign':
            $debug_id[$debug_function] += 1;
            str += debug_assign(element);
            eval(str);
            break;

        case 'out':
            $debug_id[$debug_function] += 1;
            str += debug_out(element);
            eval(str);
            break;

        case 'in':
            $debug_id[$debug_function] += 1;
            str += debug_in(element);
            eval(str);
            break;

        case 'for':
            str += debug_for(element);
            break;
        case 'function':
            $debug_id[$debug_function] += 1;
            if(b){
                debug_function(element);
            }else {
                str += debug_exe_function(element);
                eval(str);
            }
            break;
    }
    debug_show_vars();
}

function debug_if(e) {
    let bIf = eval(e.condition);
    if(bIf){
        if(e.yes.length > 0){
            $debug_struct = e.yes;
            $debug_function = e.parent  + 'o' + ($debug_id[$debug_function]-1);
            $debug_stack.push([$debug_function, e.yes]);
            $debug_id[$debug_function] = 0;
        }
    }else{
        if(e.no.length > 0){
            $debug_struct = e.no;
            $debug_function = e.parent  + 'o' + ($debug_id[$debug_function]-1);
            $debug_stack.push([$debug_function, e.no]);
            $debug_id[$debug_function] = 0;
        }
    }
}

function debug_while(e) {
    let bWhile = eval(e.condition);
    if(bWhile){
        $debug_struct = e.loop;
        $debug_function = e.parent + 'o' + $debug_id[$debug_function];
        $debug_stack.push([$debug_function, e.loop]);
        $debug_id[$debug_function] = 0;
    }else{
        $debug_id[$debug_function] += 1;
    }
}

function debug_for(e) {
    let varundef = eval("typeof " + e.variable +" === 'undefined'");
    if(varundef){
        eval(e.variable + " = " + e.initialization);
    }else{
        eval(e.variable + "++;");
    }
    let bFor = eval(e.variable + ' <= ' + e.condition);
    if(bFor){
        $debug_struct = e.loop;
        $debug_function = e.parent + 'o' + $debug_id[$debug_function];
        $debug_stack.push([$debug_function, e.loop]);
        $debug_id[$debug_function] = 0;
    }else {
        eval("delete i;");
        $debug_id[$debug_function] += 1;
    }
}

function debug_assign(e) {
    let str = '';
    for(let index in e.list){
        if($debug_vars.indexOf(e.list[index][0]) === -1){
            $debug_vars.push(e.list[index][0]);
        }
        str += e.list[index][0] + ' = ' + math_lib_check(e.list[index][1]) + ';\n';
    }

    return str;
}

function debug_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = 'alert( ' + e.buffer_out + ');';
    return str;
}



function debug_in(e) {
    let str = 'smalltalk.prompt("", "", "").then((value) => {\n' +
        'isNaN(value)?' +e.variable + ' = value : ' + e.variable + '= Number(value);});';

    if($debug_vars.indexOf(e.variable) === -1){
        $debug_vars.push(e.variable);
    }

    return str;
}

function debug_exe_function(e) {
    let str = '';
    str += 'function '+ e.name +'('+$array_functions[e.name]['param']+'){';

    let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
    $run_let_function_assings = param_str.split(",");

    str += run_arr($array_functions[e.name]['flow']);
    str += '}\n';
    str += e.name + '('+e.param+')';
    return str;
}

function debug_pushVarStack(){
    let vars_stack = {};
    for (let i = 0; i < $debug_vars.length; i++) {
        vars_stack[$debug_vars[i]] = eval($debug_vars[i]);
    }
    $debug_var_stack.push(vars_stack);
}

function debug_popVarStack(){
    let pop = $debug_var_stack.pop();
    for(let index in pop){
        eval(index + ' = ' + pop[index]);
    }
}

function debug_function(e){
    let str;
    debug_pushVarStack();
    let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
    let fun_params = param_str.split(",");

    let call_pstr = e.param.replace(/ /g, "");
    let call_params = call_pstr.split(",");

    if(fun_params.length === call_params.length){
        for (let i = 0; i < fun_params.length ; i++) {
            eval(fun_params[i] + ' = ' + call_params[i] + ';');
        }
    }

    for (let i = 0; i < $debug_vars.length; i++) {
        if(fun_params.indexOf($debug_vars[i]) === -1){
            eval('delete ' + $debug_vars + ';');
        }
    }

    $debug_vars = fun_params;

    $debug_struct = $array_functions[e.name]['flow'];
    $debug_function = e.parent  + 'o' + ($debug_id[$debug_function]-1);
    $debug_stack.push([$debug_function, e.no]);
    $debug_id[$debug_function] = 0;

}




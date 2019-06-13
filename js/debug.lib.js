var $debug_id = 0; //id of the debuger 
var $debug_id_stack = new Stack();
var $debug_struct; //array of struct debugging actuali
var $debug_function = 'main'; //function and struct processing
var $debug_function_name = 'main'; //name of the function 
var $debug_vars = []; //declared variables
var $debug_stack = new Stack(); 
var $debug_var_stack = new Stack();
var $debug_assign_back = ''; //save assign to step back before exe the function in the assign struct.
var $debug_assign_back_stack = new Stack();
var $debug_error = false; //save catch a exception 

/**
 * This function reset the global variables of debug process
 */
function debug_init() {
    $debug_id = 0;
    $debug_struct;
    $debug_function = 'main';
    $debug_function_name = 'main';
    $debug_vars = [];
    $debug_stack = new Stack();
    $debug_var_stack = new Stack();
    $debug_assign_back = '';
    $debug_error = false;
    $debug_function_change = false;

    eval("delete $promesas;");
    //clean the variables table and put it on the buttons of debug
    $('.var-tableBody').empty();
    $('#run_step').prop("disabled", false);
    $('#run_step_inFunction').prop("disabled", false);
    refrescar($canvas).then(function () {
        dibujar($canvas);
    });
}


/**
 * This function show the variables in $debug_var which contains the actual variables in the function
 */
function debug_show_vars() {
    return new Promise(function (resolve) {
        show_tabVar();
        $('.var-tableBody').empty();
        for (let $i = 0; $i < $debug_vars.length ; $i++) {
            $('.var-tableBody').append('<tr><td>'+$debug_vars[$i]+'</td><td>'+eval($debug_vars[$i])+'</td>');
        }

        resolve();
    });
   }

/**
 * This function un set the color of the element to default (black)
 * @param {*} element Element of the flow diagram
 */

/**
 * This function set the color of the element to selected (blue)
 * @param {*} element Element of the flow diagram
 * @param {*} change_f True if the function has changed 
 */
function debug_col_element(element,change_f){
    return new Promise(function (resolve) {
        $canvas.getLayer(element.parent + 'o' + $debug_id).strokeStyle = '#150fff';
        $canvas.drawLayers();

        resolve();
    });
}

/**
 * Return if the name of function without structs indicators
 * @param {*} e 
 */
function debug_getFunctionName(e) {
    for(let index in $array_functions){
        if(e.indexOf(index) === 0){
            return index;
        }
    }
}

/**
 * This function debug the next element in the algorithm
 * @param {*} b type of debug (True - debug functions too)
 */
function debug_next_step(b) {
    //console.log($debug_id, $debug_function, $debug_struct);
    //if the id of the debug functios is minor of array struct length debug
    if($debug_id < $debug_struct.length){
        let element = $debug_struct[$debug_id];
            change_function($debug_function_name).then(function () {
                debug_col_element(element).then(function () {
                    try {
                        debug_struct(element,b);
                    }
                    catch(error) {
                        //Show the error in the term, stop and restart the debug variables
                        console.error(error);
                        $('#outputShow p').html($('#outputShow p').html()  +'<span class=\'text-warning\'>Error: ' + error.message + '</span><br>');
                        $debug_error = true;
                        debug_init();
                        
                    }
                });
            });
    } 
    //Else change the debug struct 
    else {
        //if the name of the function not in name of function and the function
        

        let expresionOfFunction = new RegExp($debug_function_name + "o\\d+");
        if($debug_function !== $debug_function_name){
            //this code exec when is going out of control struct
            $debug_stack.pop();
            $debug_id = $debug_id_stack.pop();
            let stack_peek = $debug_stack.peek();
            $debug_function = stack_peek[0];
            $debug_struct = stack_peek[1];
            //next step to debug of before struct
            debug_next_step(b);
        } else if($debug_function_name !== 'main'){
            //this code exec when is going out of function
            let ioparam_str = $array_functions[$debug_function_name]['ioparam'].replace(/ /g, "");
            let ioparam = ioparam_str.split(",");
            let iosvar = {};
            if($array_functions[$debug_function_name]['type'] === 'function' && $debug_assign_back !== ''){
                let variable_back = $debug_assign_back.replace(/ /g, "");
                variable_back = variable_back.split("=");
                iosvar[variable_back[0]] = eval('sol');
            }

            if($array_functions[$debug_function_name]['type'] === 'procedure'){
                for(let i=0; i<ioparam.length; i++){
                    iosvar[ioparam[i]] = eval(ioparam[i]);
                }
            }
            for (let i = 0; i < $debug_vars.length; i++) {
                eval('delete ' + $debug_vars[i] + ';');
            }
            debug_popVarStack();
            if($array_functions[$debug_function_name]['type'] === 'function' && $debug_assign_back !== ''){
                for(let index in iosvar ){
                    eval(index + ' = ' + iosvar[index] + ';\n');
                }
                $debug_assign_back = $debug_assign_back_stack.pop();
            }
            if($array_functions[$debug_function_name]['type'] === 'procedure' && ioparam_str !== ''){
                for(let index in iosvar ){
                    eval(index + ' = ' + iosvar[index] + ';\n');
                }
            }

            $debug_stack.pop();
            $debug_id = $debug_id_stack.pop();
            let stack_peek = $debug_stack.peek();
            $debug_function = stack_peek[0];
            $debug_function_name = debug_getFunctionName(stack_peek[0]);
            $debug_struct = stack_peek[1];
            //next step to debug of before struct
            change_function($debug_function_name).then(function () {
                debug_next_step(b);
            });  
        }else{
            //this exec when end the debug
            debug_init();
        }
        debug_show_vars();
    }
    
}

/**
 * Debug the type of code struct
 * @param {*} element element of code 
 * @param {*} b type of debug ( choosing diferent functions of debug)
 */
function debug_struct(element,b){
    let str = '';
    switch(element.type){
        case 'if':
            $debug_id += 1;
            debug_if(element);
            break;

        case 'while':
            debug_while(element);
            break;

        case 'assign':
            $debug_id += 1;
            
            if(b){
                debug_assign_fun_step(element);
            }else{

                str += debug_assign(element);
            }
            eval(str);
            break;

        case 'out':
            $debug_id += 1;
            str += debug_out(element);
            eval(str);
            break;

        case 'in':
            $debug_id += 1;
            str += debug_in(element);
            eval(str);
            break;

        case 'for':
            str += debug_for(element);
            break;
        case 'function':
            $debug_id += 1;
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

/**
 * Debug if_struct
 * @param {*} e struct 
 */
function debug_if(e) {
    let bIf = eval(e.condition);
    if(bIf){
        if(e.yes.length > 0){
            $debug_struct = e.yes;
            $debug_function = e.parent  + 'o' + ($debug_id-1);
            $debug_stack.push([$debug_function, e.yes]);
            $debug_id_stack.push($debug_id);
            $debug_id = 0;
        }
    }else{
        if(e.no.length > 0){
            $debug_struct = e.no;
            $debug_function = e.parent  + 'o' + ($debug_id-1);
            $debug_stack.push([$debug_function, e.no]);
            $debug_id_stack.push($debug_id);
            $debug_id = 0;
        }
    }
}

/**
 * Debug while_struct
 * @param {*} e struct
 */
function debug_while(e) {
    let bWhile = eval(e.condition);
    if(bWhile){
        $debug_struct = e.loop;
        $debug_function = e.parent + 'o' + $debug_id;
        $debug_stack.push([$debug_function, e.loop]);
        $debug_id_stack.push($debug_id);
        $debug_id = 0;
    }else{
        $debug_id += 1;
    }
}

/**
 * Debug for_struct
 * @param {*} e struct
 */
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
        $debug_function = e.parent + 'o' + $debug_id;
        $debug_stack.push([$debug_function, e.loop]);
        $debug_id_stack.push($debug_id);
        $debug_id = 0;
    }else {
        eval("delete i;");
        $debug_id += 1;
    }
}

/**
 * Debug assign_struct in debug that come in functions
 * @param {*} e 
 */
function debug_assign_fun_step(e) {
    let sum_ind = true;

    if($debug_vars.indexOf(e.variable) === -1){
        $debug_vars.push(e.variable);
    }
    let haveFunction = false;
    let func;
    for(let nameFun in $array_functions){
        let posfun = e.value.indexOf(nameFun+'(');
        if(e.variable !== 'main'&& $array_functions[nameFun]['type'] === 'function' && posfun >= 0){
            func = new Function_Struct(e.parent);
            func.name = nameFun;
            let initc = posfun + (nameFun+'(').length;
            let longc  = e.value.indexOf(')', posfun) - initc ;
            func.param = e.value.substr(initc, longc);
            haveFunction = true;
            sum_ind = false;
            $debug_assign_back_stack.push($debug_assign_back);
            $debug_assign_back = e.variable + ' = ' + e.value;
        }
    }
    if(!haveFunction) eval(e.variable + ' = ' + math_lib_check(e.value) + ';\n');
    else{
        eval(e.variable + ' = undefined' );
        debug_show_vars().then( () => {
            debug_function(func);
        });
    }

}

/**
 * Debug assign_struct in debug that not come in functions
 * @param {*} e 
 */
function debug_assign(e) {
    let str = '';
    let functions = false;
    if($debug_vars.indexOf(e.variable) === -1){
        $debug_vars.push(e.variable);
    }
    for(let nameFun in $array_functions){
        $run_let_function_assings = [];
        if(e.variable !== 'main'&& $array_functions[nameFun]['type'] === 'function' && e.value.indexOf(nameFun+'(') >= 0){
            functions = true;
            $run_let_function_assings.push('sol');
            str += 'function '+ nameFun +'(' + $array_functions[nameFun]['param'] + '){\n' +
                'return new Promise(function (resolve) {\n' +
                '<-$declarations->' + 
                run_arr($array_functions[nameFun]['flow'],nameFun)
                + '; \n});}\n $promesas = [];';
                let declarations = '';
            for(let i = 0; i<$run_let_function_assings.length; i++){
                declarations += 'let '+ $run_let_function_assings[i] +';\n';	
            }
            str = str.replace("<-$declarations->", declarations);
        }
    }
    if(functions){

        str += 'sol = undefined;\n ' + math_lib_check(e.value) + '.then(($sol) => {'+e.variable+' = $sol;});\n';
    }else{
        str += e.variable + ' = ' + math_lib_check(e.value) + ';\n';
    }
    return str;
}

/**
 * Debug out_struct
 * @param {*} e struct
 */
function debug_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = '';
    let check_string = /".+"/;
    if(check_string.test(e.buffer_out)) str += '$(\'#outputShow p\').html($(\'#outputShow p\').html() + ' + e.buffer_out +' + \'<br>\');';
    else str += '$(\'#outputShow p\').html($(\'#outputShow p\').html() + eval(' + e.buffer_out +') + \'<br>\');';
    return str;
}

/**
 * Debug in_struct
 * @param {*} e 
 */
function debug_in(e) {
    let str = 'smalltalk.prompt("", "", "").then((value) => {\n' +
        'isNaN(value)?' +e.variable + ' = value : ' + e.variable + '= Number(value);});';

    if($debug_vars.indexOf(e.variable) === -1){
        $debug_vars.push(e.variable);
    }

    return str;
}

/**
 * Debug function_struct in debug that not come in functions
 * @param {*} e 
 */
function debug_exe_function(e) {
    let str = '';

    let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
    let params =  param_str.split(",");
    $run_let_function_assings = [];
    let ioparam_str = $array_functions[e.name]['ioparam'].replace(/ /g, "");
    let ioparam = ioparam_str.split(",");
    let parameters = ($array_functions[e.name]['type'] === 'procedure')? $array_functions[e.name]['param'] + ', $ioarr' : $array_functions[e.name]['param'];
    str += 'function '+ e.name +'(' + parameters + '){\n' +
        run_arr($array_functions[e.name]['flow']);

    let declarations = '';
    for(let i = 0; i<$run_let_function_assings.length; i++){
        declarations += 'let '+ $run_let_function_assings[i] +';\n';	
    }
    str = str.replace("<-$declarations->", declarations);

    if($array_functions[e.name]['type'] === 'procedure' && ioparam_str !== ''){
        for(let i = 0; i < ioparam.length; i++){
            str += '$ioarr[\'' + ioparam[i] + '\'] = ' + ioparam[i] + ';\n';
        }
    }
    if($array_functions[e.name]['type'] === 'function') str += 'return sol;';
    
    str += '}\n\n';

    if($array_functions[e.name]['type'] === 'procedure'){
        str += 'let $ioarr = {};\n';
    }

    parameters = ($array_functions[e.name]['type'] === 'procedure')? (e.param + ', $ioarr') : e.param;
    str += e.name + '(' + parameters + ');\n';
    if($array_functions[e.name]['type'] === 'procedure'){
        let param = param_str.split(",");
        let call_param_str = e.param.replace(/ /g, "");
        let call_param = call_param_str.split(",");
        if(ioparam_str !== ''){
            for(let i=0; i<ioparam.length; i++){
                let index = param.indexOf(ioparam[i]);
                let check_call_param = new RegExp("^[a-zA-Z]+.*");
                if(check_call_param.test(call_param[index])){
                    str += call_param[index] + ' = $ioarr[\'' + ioparam[i] +'\'];\n';
                } 
            }
        }
    }

    str += 'delete $ioarr;\n';
    return str;
}

/**
 * This function push all variables with the value used before new function
 */
function debug_pushVarStack(){
    let vars_stack = {};
    for (let i = 0; i < $debug_vars.length; i++) {
        vars_stack[$debug_vars[i]] = eval($debug_vars[i]);
    }
    $debug_var_stack.push(vars_stack);
}

/**
 * This function pop all variables with the values used in the before function
 */
function debug_popVarStack(){
    let pop = $debug_var_stack.pop();
    $debug_vars = [];
    for(let index in pop){
        $debug_vars.push(index);
        eval(index + ' = ' + pop[index]);
    }
}

/**
 * Debug function_struct in debug that come in functions
 * @param {*} e 
 */
function debug_function(e){
    //if($array_functions[e.name]['type'] === 'function') $debug_vars.push('sol');
    debug_pushVarStack();

    

    let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
    let fun_params = param_str.split(",");

    let call_pstr = e.param.replace(/ /g, "");
    let call_params = call_pstr.split(",");

    if(fun_params.length === call_params.length){
        for (let i = 0; i < fun_params.length ; i++) {
            $debug_vars.push(fun_params[i]);
            eval(fun_params[i] + ' = ' + call_params[i] + ';');
        }
    }

    $run_let_function_assings = [];
    let define_var = '';
    define_var = run_arr($array_functions[e.name]['flow']);
    if(define_var !== ''){
        for(let i=0; i<$run_let_function_assings.length; i++){
            if(fun_params.indexOf($run_let_function_assings[i]) === -1){
                fun_params.push($run_let_function_assings[i]);
                eval( $run_let_function_assings[i] + ' = undefined;');
            }
        }
    }

    for (let i = 0; i < $debug_vars.length; i++) {
        if(fun_params.indexOf($debug_vars[i]) === -1){
            eval('delete ' + $debug_vars[i] + ';');
        }
    }

    
    

    $debug_vars = fun_params;
    $debug_struct = $array_functions[e.name]['flow'];
    $debug_function = e.name;
    $debug_function_name = e.name;
    $debug_stack.push([e.name, $array_functions[e.name]['flow']]);
    $debug_id_stack.push($debug_id);
    
    $debug_id = 0;

}




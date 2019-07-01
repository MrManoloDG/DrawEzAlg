var $run_let_function_assings = [];
var $run_assing_function = false;

function run_code() {
	$('#outputShow p').html("");
	debug_init();
	
	let $new_line = "\n";
	let run = 'let $promesas = [];\n\n';

	

    try {
        run += run_functions();

        $run_let_function_assings = [];
        run += '<-$declarations-> ' + run_arr($array_functions['main']['flow']);
        let declarations = '';
        for(let i = 0; i<$run_let_function_assings.length; i++){
                    declarations += 'let '+ $run_let_function_assings[i] +';\n';	
        }
        run = run.replace("<-$declarations->", declarations);
        console.log(run);
        eval(run);
    }
    catch(error) {
		console.error(error);
        $('#outputShow p').html($('#outputShow p').html()  +'<span class=\'text-warning\'>Error: ' + error.message + '</span><br>');
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}


function run_check_async(arr){
    let res = arr.filter( element => {
        switch(element.type){
            case 'if':
                return run_check_async(element.yes) || run_check_async(element.no);
                break;
            case 'while':
                return run_check_async(element.loop);
                break;
            case 'for':
                return run_check_async(element.loop);
            case 'assign':
                run_assign(element);
                if($run_assing_function){
                    $run_assing_function=false;
                    return true;
                }else return false;
            case 'in':
                return true;
            case 'function':
                return true;
            default:
                return false;

        }
    });
    if(res.length > 0)  return true;
    else    return false;

}

function run_arr(arr, res) {
    let str = '';
    let input_then = 0;
    let n_promiseAll= 0;
    arr.forEach(function (element) {
        element.check_errors();
        switch(element.type){
            case 'if':
                str += run_if(element) + '\n';
                if(run_check_async(element.yes) || run_check_async(element.no)){
                    str += 'Promise.all($promesas).then( () =>{\n';
                    n_promiseAll++;
                }
                break;

            case 'while':
                str += run_while(element) + '\n';
                if(run_check_async(element.loop)){
                    str += 'Promise.all($promesas).then( () =>{\n';
                    n_promiseAll++;
                }
                break;

            case 'assign':
                str += run_assign(element) + '\n';
                if($run_assing_function){
                    input_then++;
                    $run_assing_function=false;
                }
                break;

            case 'out':
                str += run_out(element) + '\n';
                if($run_assing_function){
                    input_then++;
                    $run_assing_function=false;
                }
                break;

            case 'in':
                str += run_in(element) + '\n';
                input_then++;
                break;

            case 'for':
                str += run_for(element) + '\n';
                if(run_check_async(element.loop)){
                    str += 'Promise.all($promesas).then( () =>{\n';
                    n_promiseAll++; 
                }
                break;
            case 'function':
                str += run_function(element) + '\n';
                input_then++
                break;
        }
    });
    if(res !== undefined){
        str += '<$-ENDFUNCTION-$>';
    }

    for (let i = 0; i < n_promiseAll; i++) {
        str += '});\n';
    }
    for (let i = 0; i < input_then; i++) {
        str += '}).catch((error) => { $(\'#outputShow p\').html($(\'#outputShow p\').html() + \'<span class="text-warning">Error: \' + error.message + \'<\\span><br>\'); }));\n';
    }
    
    
    return str;
}

function run_if(e) {
    let str = 'if('+ e.condition +'){\n';
    str = math_lib_check(str);
    str += run_arr(e.yes) + '\n' +
        '}\n else {';
    str += run_arr(e.no) + '\n}';
    return str;
}

function run_while(e) {
    let str = 'while('+ e.condition + '){\n';
    str = math_lib_check(str);
    str += run_arr(e.loop) + '\n}';
    return str;
}

function run_for(e) {
    let condition_signal = '';
    let increment_signal = '';
    if(e.way === 'increment'){
        condition_signal = ' <= ';
        increment_signal = '+'
    }else if(e.way === 'decrement'){
        condition_signal = ' >= ';
        increment_signal = '-';
    }
    let str = 'for( let ' + e.variable + '=' + e.initialization + '; ' +
        e.variable + condition_signal + e.condition + ';' +
        ' '+e.variable+'='+e.variable+ increment_signal + e.incremental + '){\n';
    str = math_lib_check(str);
    str +=  run_arr(e.loop);
    str += '}\n';
    return str;
}

function run_assign(e) {
    let str = '';
    let functions = false;
    let array_regexp = new RegExp("[a-zA-z]+\\[([a-zA-z]+\d*|\d+)\\]");
    

    if($run_let_function_assings.indexOf(e.variable) === -1 && !array_regexp.test(e.variable)){
        console.log(array_regexp.test(e.variable));
        //str += 'let ';
        $run_let_function_assings.push(e.variable);
    }

    for(let nameFun in $array_functions){
        if(e.variable !== 'main'&& $array_functions[nameFun]['type'] === 'function' && e.value.indexOf(nameFun+'(') >= 0){
            let initc = e.value.indexOf(nameFun+'(') + (nameFun+'(').length;
            let longc = e.value.lastIndexOf(')') - initc;
            let call_params = e.value.substr(initc, longc);
            if(count_param(call_params) !== count_param($array_functions[nameFun]['param'])){
                throw new Error($lang['error-nparams'] + nameFun);
            }
            functions = true;
        }
    }

    if(functions){
        $run_assing_function=true;
        str += '$promesas.push(' + math_lib_check(e.value) + '.then(($sol) => {'+e.variable+' = $sol;';
    }else{
        str += e.variable + ' = ' + math_lib_check(e.value) + ';\n';
    }
    return str;
}

function run_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = '';
    let check_string = /".+"/;
    let functions = false;
    for(let nameFun in $array_functions){
        if(nameFun !== 'main' && $array_functions[nameFun]['type'] === 'function' && e.buffer_out.indexOf(nameFun+'(') >= 0){
            functions = true;
        }
    }

    if(functions){
        $run_assing_function=true;
        str += '$promesas.push(' + math_lib_check(e.buffer_out) + '.then(($sol) => {$(\'#outputShow p\').html($(\'#outputShow p\').html() + eval($sol) + \'<br>\');';
    }
    else if(check_string.test(e.buffer_out)) str += '$(\'#outputShow p\').html($(\'#outputShow p\').html() + ' + e.buffer_out +' + \'<br>\');';
    else str += '$(\'#outputShow p\').html($(\'#outputShow p\').html() + eval(' + math_lib_check(e.buffer_out) +') + \'<br>\');';
    return str;
}



function run_in(e) {
    let array_regexp = new RegExp("[a-zA-z]+\\[([a-zA-z]+\d*|\d+)\\]");

    
    if($run_let_function_assings.indexOf(e.variable) === -1 && !array_regexp.test(e.variable)){
        //str += 'let ';
        $run_let_function_assings.push(e.variable);
    }
    let str = '$promesas.push( smalltalk.prompt("", "", "").then((value) => {\n' +
        'isNaN(value)?' +e.variable + ' = value : ' + e.variable + '= Number(value);';
    return str;
}

function count_param(str){
    if(str === "")return 0;
    else{
        return str.split(",").length;
    }
}

function run_function(e) {
    let str = '';
    let name_arrayBack = '$ioarr';
    let parameters = ($array_functions[e.name]['type'] === 'procedure')? (e.param + ', ' + name_arrayBack) : e.param;
    str += e.name + '(' + math_lib_check( parameters ) + ')';

    let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
    let param = param_str.split(",");
    let ioparam_str = $array_functions[e.name]['ioparam'].replace(/ /g, "");
    let ioparam = ioparam_str.split(",");
    let call_param_str = e.param.replace(/ /g, "");
    let call_param = call_param_str.split(",");

    if(count_param(param_str) !== count_param(call_param_str)){
        throw new Error($lang['error-nparams'] + e.name);
    }

    if($array_functions[e.name]['type'] === 'procedure'){
        str = '$promesas.push(' + str + '.then(($sol) => {';
        str = 'let '+ name_arrayBack +' = {};\n' + str;

        
        if(ioparam_str !== ''){
            for(let i=0; i<ioparam.length; i++){
                let index = param.indexOf(ioparam[i]);
                let check_call_param = new RegExp("^[a-zA-Z]+.*");
                if(check_call_param.test(call_param[index])){
                    str += call_param[index] + ' = '+ name_arrayBack +'[\'' + ioparam[i] +'\'];\n';
                } 
            }
        }

        //str += 'delete '+ name_arrayBack +';\n';
    }
    return str;
}

function run_functions(){
    let run = '';
    for(let index in $array_functions){
	    if(index !== 'main'){
			let param_str = $array_functions[index]['param'].replace(/ /g, "");
			let params =  param_str.split(",");
	    	$run_let_function_assings = [];
			let ioparam_str = $array_functions[index]['ioparam'].replace(/ /g, "");
			let ioparam = ioparam_str.split(",");
			let parameters = ($array_functions[index]['type'] === 'procedure')? $array_functions[index]['param'] + ', $ioarr' : $array_functions[index]['param'];
			run += 'function '+ index +'(' + parameters + '){\n';

			
            $run_let_function_assings.push('sol');
            run += 'return new Promise(function (resolve) {\n';
            run += '<-$declarations-> ' + run_arr($array_functions[index]['flow'],index);
            
            if($array_functions[index]['type'] === 'function'){
                run = run.replace("<$-ENDFUNCTION-$>", "resolve(sol);\n");
            }else{
                let iosparamret = '';
                if($array_functions[index]['type'] === 'procedure' && ioparam_str !== ''){
                    for(let i = 0; i < ioparam.length; i++){
                        iosparamret += '$ioarr[\'' + ioparam[i] + '\'] = ' + ioparam[i] + ';\n';
                    }
                }
                run = run.replace("<$-ENDFUNCTION-$>", "resolve(sol);\n" + iosparamret);
            }
            
			let declarations = '';
			for(let i = 0; i<$run_let_function_assings.length; i++){
				if(params.indexOf($run_let_function_assings[i]) === -1) declarations += 'let '+ $run_let_function_assings[i] +';\n';	
			}
			run = run.replace("<-$declarations->", declarations);

			
			
			run += '\n});\n';
			
			run += '}\n\n';
        }
    }
    return run;
}




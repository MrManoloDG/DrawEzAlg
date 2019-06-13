var $run_let_function_assings = [];
var $run_assing_function = false;

function run_arr(arr, res) {
    let str = '';
    let input_then = 0;
    let n_promiseAll= 0;
    arr.forEach(function (element) {
        switch(element.type){
            case 'if':
                str += run_if(element) + '\n';
                str += 'Promise.all($promesas).then( () =>{\n';
                n_promiseAll++;
                break;

            case 'while':
                str += run_while(element) + '\n';
                str += 'Promise.all($promesas).then( () =>{\n';
                n_promiseAll++;
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
                break;

            case 'in':
                str += run_in(element) + '\n';
                input_then++;
                break;

            case 'for':
                str += run_for(element) + '\n';
                str += 'Promise.all($promesas).then( () =>{\n';
                n_promiseAll++;
                break;
            case 'function':
                str += run_function(element) + '\n';
                str += 'Promise.all($promesas).then( () =>{\n';
                n_promiseAll++;
                break;
        }
    });
    if(res !== undefined){
        str += 'resolve(sol);\n';
    }
    for (let i = 0; i < n_promiseAll; i++) {
        str += '});\n';
    }
    for (let i = 0; i < input_then; i++) {
        str += '}));\n';
    }
    return str;
}

function run_if(e) {
    let str = 'if('+ e.condition +'){\n';
    str += run_arr(e.yes) + '\n' +
        '}\n else {';
    str += run_arr(e.no) + '\n}';
    return str;
}

function run_while(e) {
    let str = 'while('+ e.condition + '){\n';
    str += run_arr(e.loop) + '\n}';
    return str;
}

function run_for(e) {
    let str = 'for( let ' + e.variable + '=' + e.initialization + '; ' +
        e.variable + ' <= ' + e.condition + ';' +
        ' ' + e.incremental + '){\n';
    str +=  run_arr(e.loop);
    str += '}\n';
    return str;
}

function run_assign(e) {
    let str = '';
    let functions = false;

    if($run_let_function_assings.indexOf(e.variable) === -1){
        //str += 'let ';
        $run_let_function_assings.push(e.variable);
    }

    for(let nameFun in $array_functions){
        if(e.variable !== 'main'&& $array_functions[nameFun]['type'] === 'function' && e.value.indexOf(nameFun+'(') >= 0){
            functions = true;
        }
    }

    if(functions){
        $run_assing_function=true;
        str += 'sol = undefined;\n $promesas.push(' + math_lib_check(e.value) + '.then(($sol) => {'+e.variable+' = $sol;';
    }else{
        str += e.variable + ' = ' + math_lib_check(e.value) + ';\n';
    }
    return str;
}

function run_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = '';
    let check_string = /".+"/;

    if(check_string.test(e.buffer_out)) str += '$(\'#outputShow p\').html($(\'#outputShow p\').html() + ' + e.buffer_out +' + \'<br>\');';
    else str += '$(\'#outputShow p\').html($(\'#outputShow p\').html() + eval(' + e.buffer_out +') + \'<br>\');';
    return str;
}



function run_in(e) {
    if($run_let_function_assings.indexOf(e.variable) === -1){
        //str += 'let ';
        $run_let_function_assings.push(e.variable);
    }
    let str = '$promesas.push( smalltalk.prompt("", "", "").then((value) => {\n' +
        'isNaN(value)?' +e.variable + ' = value : ' + e.variable + '= Number(value);';
    return str;
}

function run_function(e) {
    let str = '';
    let name_arrayBack = '$ioarr';
    let parameters = ($array_functions[e.name]['type'] === 'procedure')? (e.param + ', ' + name_arrayBack) : e.param;
    str += e.name + '(' + parameters + ');\n';

    if($array_functions[e.name]['type'] === 'procedure'){
        str = 'let '+ name_arrayBack +' = {};\n' + str;

        let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
        let param = param_str.split(",");
        let ioparam_str = $array_functions[e.name]['ioparam'].replace(/ /g, "");
        let ioparam = ioparam_str.split(",");
        let call_param_str = e.param.replace(/ /g, "");
        let call_param = call_param_str.split(",");

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




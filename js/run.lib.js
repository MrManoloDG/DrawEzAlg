var $run_let_function_assings = [];

function run_arr(arr) {
    let str = '';
    let input_then = 0;
    let n_promiseAll= 0;
    arr.forEach(function (element) {
        console.log(element);
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
                break;
        }
    });
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

    if($run_let_function_assings.indexOf(e.variable) === -1){
        str += 'let ';
        $run_let_function_assings.push(e.variable);
    }
    str += e.variable + ' = ' + math_lib_check(e.value) + ';\n';

    return str;
}

function run_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = '$(\'#outputShow p\').html($(\'#outputShow p\').html() + ' + e.buffer_out +' + \'<br>\');';
    return str;
}



function run_in(e) {
    let str = '$promesas.push( smalltalk.prompt("", "", "").then((value) => {\n' +
        'isNaN(value)?' +e.variable + ' = value : ' + e.variable + '= Number(value);';
    return str;
}

function run_function(e) {
    let str = '';
    if(e.solution !== "") str += e.solution + ' = ';
    let parameters = ($array_functions[e.name]['type'] === 'procedure')? (e.param + ', $ioarr') : e.param;
    str += e.name + '(' + parameters + ');\n';

    if($array_functions[e.name]['type'] === 'procedure'){
        str = 'let $ioarr = {};\n' + str;

        let param_str = $array_functions[e.name]['param'].replace(/ /g, "");
        let param = param_str.split(",");
        let ioparam_str = $array_functions[e.name]['ioparam'].replace(/ /g, "");
        let ioparam = ioparam_str.split(",");
        let call_param_str = e.param.replace(/ /g, "");
        let call_param = call_param_str.split(",");

        if(ioparam_str !== ''){
            for(let i=0; i<ioparam.length; i++){
                let index = param.indexOf(ioparam[i]);
                str += call_param[index] + ' = $ioarr[\'' + ioparam[i] +'\'];\n';
            }
        }

        str += 'delete $ioarr;\n';
    }
    return str;
}




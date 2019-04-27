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
    let str = 'for( let ' + e.variable + '=' + e.initialization + ';' +
        ' ' + e.condition + ';' +
        ' ' + e.incremental + '){\n';
    str +=  run_arr(e.loop);
    str += '}\n';
    return str;
}

function run_assign(e) {
    let str = '';
    for(let index in e.list){
        str += e.list[index][0] + ' = ' + e.list[index][1] + ';\n';
    }
    return str;
}

function run_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = 'alert( ' + e.buffer_out +')';
    return str;
}



function run_in(e) {
    let str = '$promesas.push( smalltalk.prompt("", "", "").then((value) => {\n' +
        'isNaN(value)?' +e.variable + ' = value : ' + e.variable + '= Number(value);';
    return str;
}





function javascript_code() {
    let str = '';
    for(let index in $array_functions){
        if(index !== 'main'){
            str += 'function '+ index +'(' + $array_functions[index]['param'] + '){<br>' +
                javascript_arr($array_functions[index]['flow']) +
                '}<br><br>';
        }
    }
    str += javascript_arr($array_functions['main']['flow'],0) + '<br>';
    return str;
}

function TabtoText(tab){
    let str = '';
    for (let i = 0; i < tab ; i++) {
        str += '&nbsp&nbsp';
    }
    return str;
}

function javascript_arr(arr, tab) {
    let str = '';
    let tabText = TabtoText(tab);
    arr.forEach(function (element) {
        switch(element.type){
            case 'if':
                str += tabText + javascript_if(element,tab,tabText) + '<br>';
                break;

            case 'while':
                str += tabText + javascript_while(element,tab, tabText) + '<br>';
                break;

            case 'assign':
                str += javascript_assign(element, tabText) + '<br>';
                break;

            case 'out':
                str += tabText + javascript_out(element) + '<br>';
                break;

            case 'in':
                str += tabText + javascript_in(element) + '<br>';
                break;

            case 'for':
                str += tabText + javascript_for(element, tab, tabText) + '<br>';
                break;
            case 'function':
                str += tabText + javascript_function(element) + '<br>';
                break;
        }
    });
    return str;
}

function javascript_if(e, tab, textTab) {
    let str = 'if('+ e.condition +'){<br>';
    str += javascript_arr(e.yes,tab + 1) + '<br>' +
        '}<br>else {';
    str += javascript_arr(e.no,tab+1) + textTab + '}';
    return str;
}

function javascript_while(e, tab, textTab) {
    let str = 'while('+ e.condition + '){<br>';
    str += javascript_arr(e.loop,tab+1) + textTab + '}';
    return str;
}

function javascript_for(e, tab, textTab) {
    let str = 'for( let ' + e.variable + '=' + e.initialization + '; ' +
        e.variable + ' <= ' + e.condition + ';' +
        ' ' + e.incremental + '){<br>';
    str +=  javascript_arr(e.loop, tab + 1);
    str += textTab + '}<br>';
    return str;
}

function javascript_assign(e, textTab) {
    let str = '';

    str += textTab +  e.variable + ' = ' + math_lib_check(e.value) + ';<br>';

    return str;
}

function javascript_out(e) {
    //let str = '$buffer_out += ' + e.buffer_out +' + $new_line;';
    let str = 'alert(' + e.buffer_out +');';
    return str;
}



function javascript_in(e) {
    let str = e.variable + ' = prompt();';
    return str;
}

function javascript_function(e) {
    let str = '';
    if(e.solution !== "") str += e.solution + ' = ';
    str += e.name + '(' + e.param + ');<br>';
    return str;
}




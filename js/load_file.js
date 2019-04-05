function load_arr(json,arr) {
    json.forEach(function (element) {
        console.log(element);
        switch(element.type){
            case 'if':
                arr.push(new If_Struct(element.parent));
                load_if(element,arr[arr.length-1]);
                break;

            case 'while':
                arr.push(new While_Struct(element.parent));
                load_while(element,arr[arr.length-1]);
                break;

            case 'assing':
                arr.push(new Assing_Struct(element.parent));
                load_assing(element,arr[arr.length-1]);
                break;

            case 'out':
                arr.push(new Out_Struct(element.parent));
                load_out(element,arr[arr.length-1]);
                break;

            case 'in':
                arr.push(new In_Struct(element.parent));
                load_in(element,arr[arr.length-1]);
                break;

            case 'for':
                arr.push(new For_Struct(element.parent));
                load_for(element,arr[arr.length-1]);
                break;

        }
    })
}

function load_if(e,o) {
    o.condition = e.condition;
    load_arr(e.yes, o.yes);
    load_arr(e.no, o.no);
}

function load_while(e,o) {
    o.condition = e.condition;
    load_arr(e.loop, o.loop);
}

function load_for(e,o) {
    o.condition = e.condition;
    o.variable = e.variable;
    o.initialization = e.initialization;
    o.incremental = e.incremental;
    load_arr(e.loop, o.loop);
}

function load_assing(e,o) {
    for(let index in e.list){
        o.list[index] = e.list[index];
    }
}

function load_out(e,o) {
    o.buffer_out = e.buffer_out;
}

function load_in(e,o) {
    o.variable = e.variable;
}


function load_info() {
    $('.modal-title').text($lang['config']['info']);
    $('.modal-body').load('modals/info_modal.html',function(){
        $('#variables h3').text($lang['variable']);
        $('#variables p').text($lang['variable-desc']);

        $('#assign h3').text($lang['assign']);
        $('#assign p').text($lang['assign-desc']);

        $('#input h3').text($lang['input']);
        $('#input p').text($lang['input-desc']);

        $('#output h3').text($lang['output']);
        $('#output p').text($lang['output-desc']);

        $('#if h3').text($lang['if']);
        $('#if p').text($lang['if-desc']);

        $('#for h3').text($lang['for']);
        $('#for p').text($lang['for-desc']);

        $('#while h3').text($lang['while']);
        $('#while p').text($lang['while-desc']);

        $('#function h3').text($lang['function']);
        $('#function p').text($lang['function-desc']);

        $('#info-tablas .operator-list').text($lang['info-table']['operator-list']);
        $('#info-tablas .arithmetic-list').text($lang['info-table']['arithmetic-list']);
        $('#info-tablas .relational-list').text($lang['info-table']['relational-list']);
        $('#info-tablas .logical-list').text($lang['info-table']['logical-list']);

        $('#info-tablas .sum').text($lang['info-table']['arithmetic-op']['sum']);
        $('#info-tablas .sub').text($lang['info-table']['arithmetic-op']['sub']);
        $('#info-tablas .multiplication').text($lang['info-table']['arithmetic-op']['multiplication']);
        $('#info-tablas .division').text($lang['info-table']['arithmetic-op']['division']);
        $('#info-tablas .module').text($lang['info-table']['arithmetic-op']['module']);

        $('#info-tablas .equal').text($lang['info-table']['relational-op']['equal']);
        $('#info-tablas .different').text($lang['info-table']['relational-op']['different']);
        $('#info-tablas .less').text($lang['info-table']['relational-op']['less']);
        $('#info-tablas .greater').text($lang['info-table']['relational-op']['greater']);
        $('#info-tablas .less-equal').text($lang['info-table']['relational-op']['less-equal']);
        $('#info-tablas .greater-equal').text($lang['info-table']['relational-op']['greater-equal']);

        $('#info-tablas .negation').text($lang['info-table']['logical-op']['negation']);
        $('#info-tablas .conjunction').text($lang['info-table']['logical-op']['conjunction']);
        $('#info-tablas .disjunction').text($lang['info-table']['logical-op']['disjunction']);

        $('#save').addClass("d-none");
        $('#myModal').modal({show:true});
    });
}

function about() {
    $.ajax({
            url : "./package.json",
            dataType: "text",
            success : function (data)
            {
                let package_json = JSON.parse(data);
                $('.modal-title').text($lang['config']['about']);
                $('.modal-body').load('modals/about_modal.html',function(){
                    $('#about-mod').html("DrawEzCode <br>" +
                        "(" + package_json['version'] + ")\n" +
                        "");
                    $('#save').addClass("d-none");
                    $('#myModal').modal({show:true});
                });
            }
        }
    );
}

function modal_code() {
    $('.modal-title').text($lang['code']);
    $('.modal-body').load('modals/code_modal.html',function(){

        $('.input-group-text').text($lang['language']);

        let check = '' + Date.now();
        $('#oID').val(check);
        $('#save').addClass("d-none");
        $('#myModal').modal({show:true});
        $('#code-select').change(function () {
            if($('#oID').val() === check){
                let code = '';
                switch($('#code-select').val()){
                    case 'javascript':
                        $('#code-show code').attr('class','javascript');
                        $('#code-show code').html('\n' + javascript_code());
                        break;
                    default:
                        $('#code-show code').attr('class','');
                        $('#code-show code').text('');
                        break;
                }

                hljs.configure({useBR: true});
                document.querySelectorAll('#code-show code').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            }
        });
    });
}

function modal_config_function(name){
    let o = $array_functions[name];
    $('.modal-title').text($lang['function']);
    $('.modal-body').load('modals/config_function_modal.html',function(){
        $('#name-label').text($lang['name']);
        $('#name').val(name);
        $('#name').attr("placeholder", $lang['name-placeholder']);

        $('#param-label').text($lang['param']);
        $('#param').val(name ==='' ? '' : o['param']);
        $('#param').attr("placeholder", $lang['param-placeholder']);

        $('#delete-fun').text($lang['delete']);

        $('#save').removeClass("d-none");
        let check = name + Date.now();
        $('#oID').val(check);
        $('#myModal').modal({show:true});
        $('#delete-fun').click(function () {
            if($('#oID').val() === check){
                change_function('main');
                $('.'+name).remove();
                delete $array_functions[name];
            }
        });
        $('#save').click(function () {
            if($('#oID').val() === check){
                console.log(o);
                if(o === undefined){
                    $array_functions[$('#name').val()] = {};
                    $array_functions[$('#name').val()]['param'] =  $('#param').val();
                    $array_functions[$('#name').val()]['flow'] = [];
                    $('#functions-nav > .nav-item:eq(-2)').after('<li class="nav-item '+ $('#name').val() +'" onclick="change_function(\''+ $('#name').val() +'\')"><a class="nav-link">'+ $('#name').val() +'</a></li>');

                }else{
                    if(name !== $('#name').val()){
                        $array_functions[$('#name').val()] = {};
                        $array_functions[$('#name').val()]['flow'] = $array_functions[name]['flow'];
                        delete $array_functions[name];
                        $('.'+name).addClass($('#name').val());
                        $('.'+name).attr("onclick","modal_config_function(\'"+ $('#name').val() +"\')");
                        $('.'+name + ' a').text($('#name').val());
                        $('.'+name).removeClass(name);
                        name = $('#name').val();
                    }
                    $array_functions[name]['param'] = $('#param').val();
                }
            }
        });
    });
}

function modal_assign(o, layer, canvas) {
    $('.modal-title').text($lang['assign']);
    $('.modal-body').load('modals/assing_modal.html',function(){
        let check = layer.name + Date.now();
        $('#oID').val(check);

        let j_load = 0;
        for(let index  in  o.list){
            $('.list').append(
                '<div class="form-group row">\n' +
                '            <div class="col-sm-5">\n' +
                '                <input type="text" class="form-control " id="key-'+j_load+'" placeholder="'+ $lang['variable'] +'" value="'+o.list[index][0]+'">\n' +
                '            </div>\n' +
                '            <div class="col-sm-1 col-form-label mx-auto"><i class="fas fa-arrow-left"></i></div>\n' +
                '            <div class="col-sm-6">\n' +
                '                <input type="text" class="form-control" id="value-'+j_load+'" placeholder="'+ $lang['assign'] +'" value="'+o.list[index][1]+'">\n' +
                '            </div>\n' +
                '        </div>'
            );
            j_load++;
        }

        for (let j = 0; j < o.list.length ; j++) {

        }
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#asing_add').click(function () {
            if($('#oID').val() === check){
                $('.list').append(
                    '<div class="form-group row">\n' +
                    '            <div class="col-sm-5">\n' +
                    '                <input type="text" class="form-control " id="key-'+j_load+'" placeholder="' + $lang['variable'] + '">\n' +
                    '            </div>\n' +
                    '            <div class="col-sm-1 col-form-label mx-auto"><i class="fas fa-arrow-left"></i></div>\n' +
                    '            <div class="col-sm-6">\n' +
                    '                <input type="text" class="form-control" id="value-'+j_load+'" placeholder="' + $lang['assign'] + '">\n' +
                    '            </div>\n' +
                    '        </div>'
                );
                j_load++;
            }
        });
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.list = [];
                $('.list').find('.row').each(function() {
                    let key;
                    let val;
                    $(this).find('input').each(function() {
                        let id = $(this).attr('id').split("-");
                        if(id[0] === 'value'){
                            val = $(this).val();
                        }else if(id[0] === 'key'){
                            key = $(this).val();
                        }
                    });
                    if(key !== "" && val !== "") o.list.push([key,val]);
                });
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}

function modal_input(o, layer, canvas) {
    $('.modal-title').text($lang['input']);
    $('.modal-body').load('modals/in_modal.html',function(){
        $('#variable').val(o.variable);
        $('#variable').attr("placeholder", $lang['variable-placeholder']);
        $('#variable-label').text($lang['variable']);
        let check = layer.name + Date.now();
        $('#oID').val(check);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.variable = $('#variable').val();
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}

function modal_output(o, layer, canvas) {
    $('.modal-title').text($lang['output']);
    $('.modal-body').load('modals/out_modal.html',function(){
        $('#buffer_out').val(o.buffer_out);
        $('#buffer_out').attr("placeholder", $lang['output-placeholder']);
        $('#output-label').text($lang['output-label']);
        let check = layer.name + Date.now();
        $('#oID').val(check);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.buffer_out = $('#buffer_out').val();
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}

function modal_function(o, layer, canvas) {
    $('.modal-title').text($lang['function']);
    $('.modal-body').load('modals/function_modal.html',function(){
        for(let index  in  $array_functions){
            if(index !== 'main'){
                if(index === o.name){
                    $('#function-select').append('<option value="'+ index +'" selected>'+ index +'</option>');
                }else {
                    $('#function-select').append('<option value="'+ index +'">'+ index +'</option>');
                }
            }
        }
        $('#param').val(o.param);
        $('#param').attr("placeholder", $lang['param']);
        $('#solution').val(o.solution);
        $('#solution').attr("placeholder", $lang['solution-placeholder']);
        let check = name + Date.now();
        $('#oID').val(check);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.name = $('#function-select').val();
                o.solution = $('#solution').val();
                o.param = $('#param').val();
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}

function modal_if(o, layer, canvas) {
    $('.modal-title').text($lang['if']);
    $('.modal-body').load('modals/if_modal.html',function(){
        $('#condition').val(o.condition);
        $('#condition').attr("placeholder", $lang['condition-placeholder']);
        $('#condition-label').text($lang['condition']);
        let check = layer.name + Date.now();
        $('#oID').val(check);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.condition = $('#condition').val();
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}

function modal_while(o, layer, canvas) {
    $('.modal-title').text($lang['while']);
    $('.modal-body').load('modals/while_modal.html',function(){
        $('#condition').val(o.condition);
        $('#condition').attr("placeholder", $lang['condition-placeholder']);
        $('#condition-label').text($lang['condition']);
        let check = layer.name + Date.now();
        $('#oID').val(check);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.condition = $('#condition').val();
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}

function modal_for(o, layer, canvas) {
    $('.modal-title').text($lang['for']);
    $('.modal-body').load('modals/for_modal.html',function(){
        $('#condition').val(o.condition);
        $('#condition').attr("placeholder", $lang['final-val']);
        $('#condition-label').text($lang['final-val']);
        $('#incremental').val(o.incremental);
        $('#incremental').attr("placeholder", $lang['incremental-placeholder']);
        $('#incremental-label').text($lang['incremental']);
        $('#initialization').val(o.initialization);
        $('#initialization').attr("placeholder", $lang['init-val']);
        $('#initialization-label').text($lang['init-val']);
        $('#variable').val(o.variable);
        $('#variable').attr("placeholder", $lang['var-cont']);
        $('#variable-label').text($lang['var-cont']);
        let check = layer.name + Date.now();
        $('#oID').val(check);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === check){
                o.condition = $('#condition').val();
                o.incremental = $('#incremental').val();
                o.initialization = $('#initialization').val();
                o.variable = $('#variable').val();
                refrescar(canvas).then(function () {
                    dibujar(canvas);
                });
            }
        });
    });
}


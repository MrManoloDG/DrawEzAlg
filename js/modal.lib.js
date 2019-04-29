
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

function modal_assign(o, layer, canvas) {
    $('.modal-title').text($lang['assign']);
    $('.modal-body').load('modals/assing_modal.html',function(){
        $('#oID').val(layer.name);

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
            if($('#oID').val() === layer.name){
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
            if($('#oID').val() === layer.name){
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
        $('#oID').val(layer.name);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === layer.name){
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
        $('#output-label').text($lang['output']);
        $('#oID').val(layer.name);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === layer.name){
                o.buffer_out = $('#buffer_out').val();
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
        $('#oID').val(layer.name);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === layer.name){
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
        $('#oID').val(layer.name);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === layer.name){
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
        $('#condition').attr("placeholder", $lang['condition-placeholder']);
        $('#condition-label').text($lang['condition']);
        $('#incremental').val(o.incremental);
        $('#incremental').attr("placeholder", $lang['incremental-placeholder']);
        $('#incremental-label').text($lang['incremental']);
        $('#initialization').val(o.initialization);
        $('#initialization').attr("placeholder", $lang['initialization-placeholder']);
        $('#initialization-label').text($lang['initialization'])
        $('#variable').val(o.variable);
        $('#variable').attr("placeholder", $lang['variable-placeholder']);
        $('#variable-label').text($lang['variable']);
        $('#oID').val(layer.name);
        $('#save').removeClass("d-none");
        $('#myModal').modal({show:true});
        $('#save').click(function () {
            if($('#oID').val() === layer.name){
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


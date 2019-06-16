

function save(){
	let json = JSON.stringify($array_functions);
	let $fs = require('fs');
	if($file_path === ''){
		let { dialog,app} = require('electron').remote;
		let options = {
			defaultPath: app.getPath('documents') + '/draw.json',
		};
		dialog.showSaveDialog(null, options, (path) => {
			$file_path = path;
			let arrfile = path.split("/");
			let filename = arrfile[arrfile.length -1];

			$('title').text("DrawEzAlg - " + filename );
			try {
				$fs.writeFileSync(path , json, 'utf-8');
				$Swal.fire(
					$lang['saved'],
					'',
					'success'
				  );
			}
			catch(e) {new Error(e.message); }
		});
	}
	else{
		try { 
			$fs.writeFileSync($file_path , json, 'utf-8');
			$Swal.fire(
				$lang['saved'],
				'',
				'success'
			); 
		}
		catch(e) {new Error(e.message); }
	}


}




function open_file(){
	// Check for the various File API support.
	if (window.File && window.FileReader) {
		let file = document.getElementById('file').files[0];
		if(file){
			getAsText(file);
		}
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
}

function getAsText(readFile) {

	let reader = new FileReader();
	// Read file into memory as UTF-8
	reader.readAsText(readFile, "UTF-8");
	// Closure to capture the file information.
	reader.onload = (function(theFile) {
		return function(e) {
			let extension = theFile.name.split(".")[1];
			if( extension === "json" || extension === "JSON"){
				$file_path = theFile.path;
				$('title').text("DrawEzAlg - " + theFile.name );

				let json = JSON.parse(e.target.result);

				$array_functions={};
				$('#functions-nav .nav-item').each(function (e) {
					if(!$(this).hasClass('main') && !$(this).hasClass('function')){
						$(this).remove();
					}
				});
				
				for(let index in json){
					$array_functions[index] = {};
					$array_functions[index]['param'] = json[index]['param'];
					$array_functions[index]['flow'] = [];
					$array_functions[index]['type'] = json[index]['type'];
					$array_functions[index]['ioparam'] = json[index]['ioparam'];
					$array_functions[index]['desc'] = json[index]['desc'];
					if(index !== 'main') $('#functions-nav > .nav-item:eq(-2)').after('<li class="nav-item '+ index+'" onclick="change_function(\''+ index +'\',true)"><a class="nav-link">'+ index +'</a></li>');
					load_arr(json[index]['flow'], $array_functions[index]['flow']);
				}
				$array_main = $array_functions['main']['flow'];
				refrescar($canvas).then(function () {
					dibujar($canvas);
				});
			}else{
				alert("The file does not have json extension");
			}

		};
	})(readFile);
}

function newFile(){
	let electron = require('electron')
	let path = require('path')
	let BrowserWindow = electron.remote.BrowserWindow;
	let url = require('url');
	let $win = new BrowserWindow({width: 1080, height: 720});

	$win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));


    $win.on('closed', () => {
        $win = null
    });
}


function load_arr(json,arr) {
    json.forEach(function (element) {
        switch(element.type){
            case 'if':
                arr.push(new If_Struct(element.parent));
                load_if(element,arr[arr.length-1]);
                break;

            case 'while':
                arr.push(new While_Struct(element.parent));
                load_while(element,arr[arr.length-1]);
                break;

            case 'assign':
                arr.push(new Assign_Struct(element.parent));
                load_assign(element,arr[arr.length-1]);
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

            case 'function':
                arr.push(new Function_Struct(element.parent));
                load_function(element,arr[arr.length-1]);
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

function load_assign(e,o) {

    o.variable = e.variable;
    o.value = e.value;

}

function load_out(e,o) {
    o.buffer_out = e.buffer_out;
}

function load_in(e,o) {
    o.variable = e.variable;
}

function load_function(e,o) {
    o.name = e.name;
    o.solution = e.solution;
    o.param = e.param;
}


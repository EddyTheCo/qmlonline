function getQueryParams(url) {
	const paramArr = url.slice(url.indexOf('?') + 1).split('&');
	const params = {};
	paramArr.map(param => {
		const [key, val] = param.split('=');
		params[key] = decodeURIComponent(val);
	})
	return params;
}
function init() {

	const url=window.location.href;
	console.log(url);
	const param=getQueryParams(url);
	const example_url=(typeof param["example_url"]=== 'undefined'?'https://raw.githubusercontent.com/EddyTheCo/qmlonline/main/wasm/examples/simple':param["example_url"]);
	const wasm_url=(typeof param["wasm_url"]=== 'undefined'?'':param["wasm_url"]);
	const app_name=(typeof param["app_name"]=== 'undefined'?'appqmlonline':param["app_name"]);
	console.log(example_url);
	console.log(wasm_url);
	console.log(app_name);
	console.log(app_name);
	var qmlcode_ = "";
	function fill_qmlcode_(message)
	{
		qmlcode_=message;
	}
	var spinner = document.querySelector('#qtspinner');
	var canvas = document.querySelector('#qtcanvas');
	var status = document.querySelector('#qtstatus')


	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/chaos");
	editor.session.setMode("ace/mode/qml");
	editor.setOptions({
		showInvisibles: true,
		useWorker: false, // Avoid problems with syntax check
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true,
	})
	axios.get(example_url)
		.then(function (response) {
			fill_qmlcode_(response.data);

		})
		.catch(function (error) {
			console.log(error);
		}).then(function () {
			editor.session.setValue(qmlcode_)
		});

	var qtLoader = QtLoader({
		path: wasm_url,
		canvasElements : [canvas],
		showLoader: function(loaderStatus) {
			spinner.style.display = 'block';
			canvas.style.display = 'none';
			status.innerHTML = loaderStatus + "...";
		},
		showError: function(errorText) {
			status.innerHTML = errorText;
			spinner.style.display = 'block';
			canvas.style.display = 'none';
		},
		showExit: function() {
			status.innerHTML = "Application exit";
			if (qtLoader.exitCode !== undefined)
				status.innerHTML += " with code " + qtLoader.exitCode;
			if (qtLoader.exitText !== undefined)
				status.innerHTML += " (" + qtLoader.exitText + ")";
			spinner.style.display = 'block';
			canvas.style.display = 'none';
		},
		showCanvas: function() {
			spinner.style.display = 'none';
			canvas.style.display = 'block';
		},
	});
	qtLoader.loadEmscriptenModule(app_name);

	checkModuleLoad=setInterval(function() {
		if (qtLoader.module())
		{
			qtLoader.module().qmlTextCode.get_editor(0).setCode(editor.session.getValue());
			clearInterval(checkModuleLoad);
		}

		if( typeof counter == 'undefined' ) {
			counter = 0;
		}
		counter++;
		if(counter>60)clearInterval(checkModuleLoad);
	}, 1000);
	editor.getSession().on('change', function () {
		if (qtLoader.module())qtLoader.module().qmlTextCode.get_editor(0).setCode(editor.session.getValue());
	});
}

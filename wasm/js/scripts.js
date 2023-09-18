function getQueryParameters(url) {
	const parameterArray = url.slice(url.indexOf('?') + 1).split('&');
	const parameters = {};
	parameterArray.map(parameter => {
		const [key, value] = parameter.split('=');
		parameters[key] = decodeURIComponent(value);
	});
	return parameters;
}

function init() {
	initQTwasm('.', 'appqmlonline', '#qtrootDiv', 'img/esterlogo.png');

	checkModuleLoad = setInterval(() => {
		if (qtLoader.module()) {
			qtLoader.module().qmlTextCode.get_editor(0).setCode(editor.session.getValue());
			qtQR=qtLoader;
			clearInterval(checkModuleLoad);
		}

		if (typeof counter === 'undefined') {
			counter = 0;
		}

		counter++;
		if (counter > 60) {
			clearInterval(checkModuleLoad);
		}
	}, 1000);
	const url = window.location.href;
	const parameter = getQueryParameters(url);
	const example = (typeof parameter.example_url === 'undefined' ? 'simple' : parameter.example_url);
	const example_url = "https://raw.githubusercontent.com/EddyTheCo/qmlonline/main/wasm/examples/" + example;
	let qmlcode_ = '';

	function fill_qmlcode_(message) {
		qmlcode_ = message;
	}

	const editor = ace.edit('editor');
	editor.setTheme('ace/theme/chaos');
	editor.session.setMode('ace/mode/qml');
	editor.setOptions({
		showInvisibles: true,
		useWorker: false, // Avoid problems with syntax check
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true,
		wrap: true,
	});
	editor.commands.addCommand({
            name: 'format',
            bindKey: {
                win: "Ctrl-I",
                mac: "Cmd-I"
            },
            exec: function () {
                format();
            }
        })


	function format() {
		let cursorPosition = editor.selection.getCursor();
		var beautify = ace.require("ace/ext/beautify");
		beautify.beautify(editor.session);
		editor.moveCursorTo(cursorPosition.row, cursorPosition.column);
	}

	axios.get(example_url)
		.then(response => {
			fill_qmlcode_(response.data);
		})
		.catch(error => {
			console.log(error);
		}).then(() => {
			editor.session.setValue(qmlcode_);
			format();
		});
	editor.getSession().on('change', () => {
		if (qtLoader.module()) {
			qtLoader.module().qmlTextCode.get_editor(0).setCode(editor.session.getValue());
		}
	});
	resizeSplitX()
}

function resizeSplitX(event) {
	ace.require("ace/ext/language_tools");
	var editor = ace.edit("editor");
	editor.resize();
	var canvas = document.getElementById("screen");;
	qtLoader.resizeCanvasElement(canvas);
}

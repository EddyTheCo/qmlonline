//<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.14.0/ace.js" integrity="sha512-WYlXqL7GPpZL2ImDErTX0RMKy5hR17vGW5yY04p9Z+YhYFJcUUFRT31N29euNB4sLNNf/s0XQXZfzg3uKSoOdA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/EddyTheCo/qmlonline@main/wasm/js/ace.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/EddyTheCo/qmlonline@main/wasm/js/ext-beautify.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/EddyTheCo/qmlonline@main/wasm/js/ext-language_tools.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/EddyTheCo/qmlonline@main/wasm/js/mode-qml.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/EddyTheCo/qmlonline@main/wasm/js/theme-chaos.js"></script>
<script>

qtLoader = initQTwasm('https://raw.githubusercontent.com/EddyTheCo/qmlonline/main/wasm/', 'appqmlonline', '#qtrootDiv', 'img/qtlogo.svg');

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
	const url = window.location.href;
	const parameter = getQueryParameters(url);
	const example_url = (typeof parameter.example_url === 'undefined' ? 'https://raw.githubusercontent.com/EddyTheCo/qmlonline/main/wasm/examples/simple' : parameter.example_url);

	let qmlcode_ = '';
	function fill_qmlcode_(message) {
		console.log('fillqml', message);
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
	});
	axios.get(example_url)
		.then(response => {
			fill_qmlcode_(response.data);
		})
		.catch(error => {
			console.log(error);
		}).then(() => {
			editor.session.setValue(qmlcode_);
		});
	editor.getSession().on('change', function () {
		if (qtLoader.module())qtLoader.module().qmlTextCode.get_editor(0).setCode(editor.session.getValue());
	});

</script>

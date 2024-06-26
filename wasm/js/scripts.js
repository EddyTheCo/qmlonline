function getQueryParameters(url) {
    const parameterArray = url.slice(url.indexOf('?') + 1).split('&');
    const parameters = {};
    parameterArray.map(parameter => {
        const [key, value] = parameter.split('=');
        parameters[key] = decodeURIComponent(value);
    });
    return parameters;
}
let qtModule = undefined;
async function init() {

    const rootDiv = document.querySelector('#qtrootDiv');

    rootDiv.innerHTML += '<figure  id="qtspinner"> <center > <img id="logo" crossorigin="anonymous" src="img/esterlogo.png" ></img> <div id="qtstatus"></div> </center> </figure> <div class="qtscreen" id="screen" ></div>';

    const spinner = rootDiv.querySelector('#qtspinner');
    const screen = rootDiv.querySelector('#screen');
    const status = rootDiv.querySelector('#qtstatus');


    const showUi = (ui) => {
        [spinner, screen].forEach(element => element.style.display = 'none');
        if (screen === ui)
            screen.style.position = 'default';
        ui.style.display = 'block';
    }

    try {
        showUi(spinner);
        status.innerHTML = 'Loading...';

        qtModule = await qtLoad({
            qt: {
                onLoaded: () => {
                    showUi(screen);
                },
                onExit: exitData => {
                    status.innerHTML = 'Application exit';
                    status.innerHTML +=
                        exitData.code !== undefined ? ` with code ` : '';
                    status.innerHTML +=
                        exitData.text !== undefined ? ` ()` : '';
                    showUi(spinner);
                },
                entryFunction: window.createQtAppInstance,
                containerElements: [screen],

            }
        });
    } catch (e) {
        console.error(e);
        console.error(e.stack);
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

    function format() {
        let cursorPosition = editor.selection.getCursor();
        var beautify = ace.require("ace/ext/beautify");
        beautify.beautify(editor.session);
        editor.moveCursorTo(cursorPosition.row, cursorPosition.column);
    }
    editor.commands.addCommand({
        name: 'format',
        bindKey: {
            win: "Ctrl-I",
            mac: "Cmd-I"
        },
        exec: function() {
            format();
        }
    })

    function getShareCode() {
        const ccode = editor.session.getValue();
        const ccode64 = window.btoa(ccode);
        const furl = window.location.href + "?code64=" + ccode64;
        navigator.clipboard.writeText(`${furl}`);
    }
    editor.commands.addCommand({
        name: 'share',
        bindKey: {
            win: "Ctrl-S",
            mac: "Cmd-S"
        },
        exec: function() {
            getShareCode();
        }
    })





    const url = window.location.href;
    const parameter = getQueryParameters(url);

    if (typeof parameter.code64 !== 'undefined') {
        const code64 = parameter.code64;
        const code = window.atob(parameter.code64);
        editor.session.setValue(code);
        format();
    } else {

        const example = (typeof parameter.example_url === 'undefined' ? 'simple' : parameter.example_url);
        const example_url = "https://raw.githubusercontent.com/EddyTheCo/qmlonline/main/wasm/examples/" + example;

        axios.get(example_url)
            .then(response => {
                editor.session.setValue(response.data);
                format();
            })
            .catch(error => {
                console.log(error);
            });
    }


    resizeSplitX();
    qtModule.qmlTextCode.get_editor(0).setCode(editor.session.getValue());
    editor.getSession().on('change', () => {
        qtModule.qmlTextCode.get_editor(0).setCode(editor.session.getValue());
    });
}

function resizeSplitX(event) {
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");
    editor.resize();
    var canvas = document.getElementById("screen");;
    qtModule.qtResizeContainerElement(canvas);
}
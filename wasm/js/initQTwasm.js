/****************************************************************************
**
** Copyright (C) 2023 Eduardo Gonzalez Lazo.
** Contact: https://eddytheco.github.io/
**
****************************************************************************/

// initQTwasm provides javascript API for managing Qt application modules.
//
// initQTwasm provides API on top of QtLoader. The qtloader.js script has to be loaded before this.
//
// usage:
//
// app_name : name of the application
// wasm_url : path to the app_name.wasm app_name.js app_name....js files
// rootDivSele :name  of the root div(html) where the app will be shown
// logoPath : fullpath to a logo image to show when compiling wasm
//

        let qtLoader = undefined;
function initQTwasm(wasm_url, app_name, rootDivSele, logoPath) {
	const rootDiv = document.querySelector(rootDivSele);

	rootDiv.innerHTML += '<figure  id="qtspinner"> <center > <img id="logo" crossorigin="anonymous" src="' + logoPath + '" ></img> <div id="qtstatus"></div> </center> </figure> <div id="screen" ></div>';

	const spinner = rootDiv.querySelector('#qtspinner');
	const canvas = rootDiv.querySelector('#screen');
	const status = rootDiv.querySelector('#qtstatus');

	const logo = spinner.querySelector('#logo');
	logo.style.cssText = String(logo.style.cssText);

	qtLoader = QtLoader({
		path: wasm_url,
		restartMode: 'RestartOnCrash',
		restartType: 'RestartModule',
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
}

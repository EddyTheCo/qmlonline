# QmlOnline 

This repo produce a Qt application that allows to run Qml code interactively.
The resulting application can access QML types defined in C++.
The purpose of this repo is to show online some  C++/Qt/Qml projects.
For doing that the repo contains a wasm folder that produce a [web page](https://eddytheco.github.io/qmlonline/),
integrating a JavaScript code editor  to the compiled Qt application of this repo. The integration is made by compiling the Qt application to Webassembly. 


## Compile the WASM file and Qt-JavaScript Api

The project uses [CMake presets](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html) as a way to share CMake configurations.
Refer to [cmake](https://cmake.org/cmake/help/latest/manual/cmake.1.html), [ctest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) and [cpack](https://cmake.org/cmake/help/latest/manual/cpack.1.html) documentation for more information on the use of presets.

If everything went well, the corresponding WASM file and Qt-JavaScript Api should be updated on the qmlonline/wasm source directory. 

## Running the web page locally

```
cd ../qmlonline/wasm
emrun  index.html
```

### Notes on this

It is necessary to have installed [Qt for WebAssembly](https://doc.qt.io/qt-6/wasm.html). 

## Acknowledgments

- The general programming idea  was taken from [QML Online](https://qmlonline.kde.org/).
- The embeddable code editor in JavaScript is supported by [Ace](https://ace.c9.io/) JavaScript sources.


cmake_minimum_required(VERSION 3.16)

include(local_conf.cmake OPTIONAL)

option(USE_QtQrGen "add qrcode image providers" ON)


project(qmlonline VERSION 0.1 LANGUAGES CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 6.2 COMPONENTS Core Gui Qml Quick REQUIRED)

qt_add_executable(appqmlonline
	main.cpp
	)

qt_add_qml_module(appqmlonline
	URI qmlonline
	VERSION 1.0
	QML_FILES main.qml
	)
qt_add_qml_module(Textcode
	URI Textcode
	VERSION 1.0
	NO_PLUGIN
	SOURCES qmltextcode.cpp qmltextcode.h
	)
if(USE_QtQrGen)
	include(FetchContent)
	FetchContent_Declare(
		qrCode
		GIT_REPOSITORY git@github.com:EddyTheCo/qrCode.git
		GIT_TAG main
		)
	FetchContent_MakeAvailable(qrCode)
	target_link_libraries(appqmlonline PRIVATE QtQrGen)

	target_compile_definitions(appqmlonline PRIVATE USE_QtQrGen)
endif(USE_QtQrGen)
if(EMSCRIPTEN)
	target_compile_definitions(Textcode PRIVATE USE_EMSCRIPTEN)
endif()
set_target_properties(appqmlonline PROPERTIES
	MACOSX_BUNDLE_GUI_IDENTIFIER my.example.com
	MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
	MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
	MACOSX_BUNDLE TRUE
	WIN32_EXECUTABLE TRUE
	)

target_compile_definitions(appqmlonline
	PRIVATE $<$<OR:$<CONFIG:Debug>,$<CONFIG:RelWithDebInfo>>:QT_QML_DEBUG>)
target_link_libraries(appqmlonline
        PRIVATE Qt6::Quick  Textcode )
add_custom_command(
  TARGET appqmlonline
  POST_BUILD
  COMMAND ${CMAKE_COMMAND}
  ARGS -E copy ${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.js ${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.wasm ${CMAKE_CURRENT_BINARY_DIR}/qtloader.js ${CMAKE_CURRENT_SOURCE_DIR}/wasm 
  )
install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/wasm DESTINATION .)

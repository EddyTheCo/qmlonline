cmake_minimum_required(VERSION 3.16)

include(local_conf.cmake OPTIONAL)

option(USE_QtQrGen "add qrcode image providers" ON)


project(qmlonline VERSION 0.1 LANGUAGES CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 COMPONENTS Core)
find_package(Qt6 COMPONENTS Gui)
find_package(Qt6 COMPONENTS Quick)
find_package(Qt6 COMPONENTS Qml)

qt6_add_executable(appqmlonline
	main.cpp
	)

qt6_add_qml_module(appqmlonline
	URI qmlonline
	VERSION 1.0
        QML_FILES
        "main.qml"
        SOURCES
        "qmltextcode.cpp" "qmltextcode.h"
        IMPORTS MyDesigns
	IMPORT_PATH
	${CMAKE_BINARY_DIR}/_deps/mydesigns-build
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
FetchContent_Declare(
	MyDesigns
	GIT_REPOSITORY git@github.com:EddyTheCo/MyDesigns.git
	GIT_TAG main
	)
FetchContent_MakeAvailable(MyDesigns)
if(EMSCRIPTEN)
        target_compile_definitions(appqmlonline PRIVATE USE_EMSCRIPTEN)
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
        PRIVATE MyDesigns Qt::Core Qt::Gui Qt::Qml Qt::Quick)

add_custom_command(
	TARGET appqmlonline
	POST_BUILD
	COMMAND ${CMAKE_COMMAND}
	ARGS -E copy "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.js" "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.wasm" "${CMAKE_CURRENT_BINARY_DIR}/qtloader.js" "${CMAKE_CURRENT_SOURCE_DIR}/wasm"
	)
install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/wasm DESTINATION .)

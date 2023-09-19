cmake_minimum_required(VERSION 3.24)

include(local_conf.cmake OPTIONAL)

option(USE_QtQr "add qrcode image providers" ON)
option(USE_IOTA "add IOTA object types [not mantained right now]" OFF)


include(FetchContent)
FetchContent_Declare(
    ccommon
    GIT_REPOSITORY https://github.com/EddyTheCo/Common.git
    GIT_TAG main
)
FetchContent_MakeAvailable(ccommon)
version_from_git(
    LOG       OFF
    TIMESTAMP "%Y%m%d%H%M%S"
)
project(qmlonline VERSION ${VERSION} LANGUAGES CXX)

set_property(GLOBAL PROPERTY USE_FOLDERS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Quick Qml )
qt_standard_project_setup()

qt6_add_executable(appqmlonline
    main.cpp
)
if(USE_QtQr)
    FetchContent_Declare(
        qrCode
        GIT_REPOSITORY https://github.com/EddyTheCo/qrCode.git
        GIT_TAG 0.1.2
        FIND_PACKAGE_ARGS 0.1 CONFIG
    )
FetchContent_MakeAvailable(qrCode)
target_link_libraries(appqmlonline PRIVATE QtQrGen QtQrDec)

target_compile_definitions(appqmlonline PRIVATE USE_QtQr)
list(APPEND qmlimport QtQrGen QtQrDec)
endif(USE_QtQr)
FetchContent_Declare(
    MyDesigns
    GIT_REPOSITORY https://github.com/EddyTheCo/MyDesigns.git
    GIT_TAG v0.2.3
    FIND_PACKAGE_ARGS 0.2 CONFIG
)
FetchContent_MakeAvailable(MyDesigns)
list(APPEND qmlimport MyDesigns)

if(USE_IOTA)
    FetchContent_Declare(
        outMonitor
        GIT_REPOSITORY https://github.com/EddyTheCo/outMonitor.git
        GIT_TAG v0.1.5
        FIND_PACKAGE_ARGS 0.1 CONFIG
    )
FetchContent_MakeAvailable(outMonitor)
FetchContent_Declare(
    outCreator
    GIT_REPOSITORY https://github.com/EddyTheCo/outCreator.git
    GIT_TAG v0.1.1
    FIND_PACKAGE_ARGS 0.1 CONFIG
)
FetchContent_MakeAvailable(outCreator)
FetchContent_Declare(
    outConsumer
    GIT_REPOSITORY https://github.com/EddyTheCo/outConsumer.git
    GIT_TAG v0.1.1
    FIND_PACKAGE_ARGS 0.1 CONFIG
)
FetchContent_MakeAvailable(outConsumer)
FetchContent_Declare(
    blockSender
    GIT_REPOSITORY https://github.com/EddyTheCo/BlockSender.git
    GIT_TAG v0.1.1
    FIND_PACKAGE_ARGS 0.1 CONFIG
)
FetchContent_MakeAvailable(blockSender)
FetchContent_Declare(
    account
    GIT_REPOSITORY https://github.com/EddyTheCo/account.git
    GIT_TAG v0.2.2
    FIND_PACKAGE_ARGS 0.2 CONFIG
)
FetchContent_MakeAvailable(account)
FetchContent_Declare(
    nodeConection
    GIT_REPOSITORY https://github.com/EddyTheCo/ConectionSettings.git
    GIT_TAG v0.2.3
    FIND_PACKAGE_ARGS 0.2 CONFIG
)
FetchContent_MakeAvailable(nodeConection)
target_link_libraries(appqmlonline
    PRIVATE outMonitor outCreator outConsumer blockSender account nodeConection )
list(APPEND qmlimport outMonitor outCreator outConsumer blockSender nodeConection account)
endif(USE_IOTA)
target_link_libraries(appqmlonline
    PRIVATE MyDesigns Qt::Core Qt::Gui Qt::Qml Qt::Quick)

qt6_add_qml_module(appqmlonline
    URI qmlonline
    VERSION 1.0
    RESOURCE_PREFIX
    "/esterVtech.com/imports"
    QML_FILES
    "main.qml"
    SOURCES
    "qmltextcode.cpp" "qmltextcode.h"
    IMPORTS ${qmlimport}
    IMPORT_PATH ${QML_IMPORT_PATH}
)
if(EMSCRIPTEN)
    target_compile_definitions(appqmlonline PRIVATE USE_EMSCRIPTEN)
    add_custom_command(
        TARGET appqmlonline
        POST_BUILD
        COMMAND ${CMAKE_COMMAND}
        ARGS -E copy "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.js" "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.wasm" "${CMAKE_CURRENT_BINARY_DIR}/qtloader.js" "${CMAKE_CURRENT_SOURCE_DIR}/wasm"
    )
endif()


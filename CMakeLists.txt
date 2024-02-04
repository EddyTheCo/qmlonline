cmake_minimum_required(VERSION 3.24)

include(${CMAKE_CURRENT_BINARY_DIR}/local_conf.cmake OPTIONAL)

option(USE_QtQr "add qrCode types " ON)
option(USE_OMClient "add open-meteo types" ON)
option(USE_DateTimePickers "add datetimepickers types" ON)
option(USE_Iotaaccount "add iota account  types" ON)
option(USE_Iotaconnection "add iota connection  types" ON)
option(USE_QVault "add QVault  types" ON)


include(FetchContent)
FetchContent_Declare(
    ccommon
    GIT_REPOSITORY https://github.com/EddyTheCo/Common.git
    GIT_TAG v0.1.1
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

find_package(Qt6 REQUIRED COMPONENTS Core Gui Quick Qml QuickControls2 )
qt_standard_project_setup()

qt6_add_executable(appqmlonline
    main.cpp
)
if(USE_OMClient)
    FetchContent_Declare(
        openMeteo
        GIT_REPOSITORY https://github.com/EddyTheCo/OMClient.git
        GIT_TAG v0.2.0
        FIND_PACKAGE_ARGS 0.2 CONFIG
    )
FetchContent_MakeAvailable(openMeteo)
target_link_libraries(appqmlonline PRIVATE openMeteo::OMClient
    $<$<STREQUAL:$<TARGET_PROPERTY:openMeteo::OMClient,TYPE>,STATIC_LIBRARY>:openMeteo::OMClientplugin>)
list(APPEND qmlimport Esterv.CustomControls.OpenMeteo)
endif(USE_OMClient)
if(USE_Iotaconnection)
    FetchContent_Declare(
        IotaNodeConn
        GIT_REPOSITORY https://github.com/EddyTheCo/ConectionSettings.git
        GIT_TAG v0.5.0
        FIND_PACKAGE_ARGS 0.5 CONFIG
    )
FetchContent_MakeAvailable(IotaNodeConn)
target_link_libraries(appqmlonline PRIVATE IotaNodeConn::nodeConnection
    $<$<STREQUAL:$<TARGET_PROPERTY:IotaNodeConn::nodeConnection,TYPE>,STATIC_LIBRARY>:IotaNodeConn::nodeConnectionplugin>
)
list(APPEND qmlimport Esterv.Iota.NodeConnection)
endif(USE_Iotaconnection)
if(USE_Iotaaccount)
    FetchContent_Declare(
        IotaAccount
        GIT_REPOSITORY https://github.com/EddyTheCo/account.git
        GIT_TAG v0.5.0
        FIND_PACKAGE_ARGS 0.5 CONFIG
    )
FetchContent_MakeAvailable(IotaAccount)
target_link_libraries(appqmlonline PRIVATE IotaAccount::account
    $<$<STREQUAL:$<TARGET_PROPERTY:IotaAccount::account,TYPE>,STATIC_LIBRARY>:IotaAccount::accountplugin>
)
list(APPEND qmlimport "Esterv.Iota.Account")
endif(USE_Iotaaccount)

if(USE_QtQr)
    FetchContent_Declare(
        qrCode
        GIT_REPOSITORY https://github.com/EddyTheCo/qrCode.git
        GIT_TAG v1.0.2
        FIND_PACKAGE_ARGS 1.0 CONFIG
    )
FetchContent_MakeAvailable(qrCode)
target_link_libraries(appqmlonline PRIVATE qrCode::QtQrGen qrCode::QtQrDec
    $<$<STREQUAL:$<TARGET_PROPERTY:qrCode::QtQrGen,TYPE>,STATIC_LIBRARY>:qrCode::QtQrGenplugin>
    $<$<STREQUAL:$<TARGET_PROPERTY:qrCode::QtQrDec,TYPE>,STATIC_LIBRARY>:qrCode::QtQrDecplugin>
)
target_compile_definitions(appqmlonline PRIVATE USE_QtQr)
list(APPEND qmlimport "Esterv.CustomControls.QrGen" "Esterv.CustomControls.QrDec")
endif(USE_QtQr)
if(USE_DateTimePickers)
    FetchContent_Declare(
            DTPickersQML
            GIT_REPOSITORY https://github.com/EddyTheCo/DateTimePickers.git
            GIT_TAG v0.1.3
            FIND_PACKAGE_ARGS 0.1 CONFIG
        )
    FetchContent_MakeAvailable(DTPickersQML)
target_link_libraries(appqmlonline PRIVATE DTPickersQML::DTPickers
    $<$<STREQUAL:$<TARGET_PROPERTY:DTPickersQML::DTPickers,TYPE>,STATIC_LIBRARY>:DTPickersQML::DTPickersplugin>
)
target_compile_definitions(appqmlonline PRIVATE USE_QtQr)
list(APPEND qmlimport "Esterv.CustomControls.DateTimePickers")
endif(USE_DateTimePickers)

if(USE_QVault)
    FetchContent_Declare(
            QtVault
            GIT_REPOSITORY https://github.com/EddyTheCo/QVault.git
            GIT_TAG v0.1.0
            FIND_PACKAGE_ARGS 0.1 CONFIG
        )
    FetchContent_MakeAvailable(QtVault)
target_link_libraries(appqmlonline PRIVATE QtVault::vault
    $<$<STREQUAL:$<TARGET_PROPERTY:QtVault::vault,TYPE>,STATIC_LIBRARY>:QtVault::vaultplugin>
)
list(APPEND qmlimport "Esterv.Utils.Vault")
endif(USE_QVault)

FetchContent_Declare(
    EstervDesigns
    GIT_REPOSITORY https://github.com/EddyTheCo/MyDesigns.git
    GIT_TAG v1.1.0
    FIND_PACKAGE_ARGS 1.1 CONFIG
)
FetchContent_MakeAvailable(EstervDesigns)

target_link_libraries(appqmlonline PRIVATE EstervDesigns::SimpleStyle EstervDesigns::CustomControls EstervDesigns::FlatControl
    $<$<STREQUAL:$<TARGET_PROPERTY:EstervDesigns::SimpleStyle,TYPE>,STATIC_LIBRARY>:EstervDesigns::SimpleStyleplugin>
    $<$<STREQUAL:$<TARGET_PROPERTY:EstervDesigns::CustomControls,TYPE>,STATIC_LIBRARY>:EstervDesigns::CustomControlsplugin>
    $<$<STREQUAL:$<TARGET_PROPERTY:EstervDesigns::FlatControl,TYPE>,STATIC_LIBRARY>:EstervDesigns::FlatControlplugin>
)
list(APPEND qmlimport "Esterv.Styles.Simple" "Esterv.CustomControls" "Esterv.Controls.Flat")

qt6_add_qml_module(appqmlonline
    URI qmlonline
    VERSION 1.0
    RESOURCE_PREFIX
    "/esterVtech.com/imports"
    QML_FILES
    "main.qml"
    SOURCES
    "qmltextcode.cpp" "qmltextcode.h"
    IMPORT_PATH ${CMAKE_BINARY_DIR}
    IMPORTS ${qmlimport}
)
target_link_libraries(appqmlonline PRIVATE Qt6::Core Qt6::Gui Qt6::Qml Qt6::Quick Qt6::QuickControls2)

if(EMSCRIPTEN)
    target_compile_definitions(appqmlonline PRIVATE USE_EMSCRIPTEN)
    add_custom_command(
        TARGET appqmlonline
        POST_BUILD
        COMMAND ${CMAKE_COMMAND}
        ARGS -E copy "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.js" "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.wasm" "${CMAKE_CURRENT_BINARY_DIR}/qtloader.js" "${CMAKE_CURRENT_SOURCE_DIR}/wasm"
    )
endif()


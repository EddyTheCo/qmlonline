cmake_minimum_required(VERSION 3.24)

include(${CMAKE_CURRENT_BINARY_DIR}/local_conf.cmake OPTIONAL)

option(USE_QtQr "add qrCode types " ON)
option(USE_OMClient "add open-meteo types" ON)
option(USE_DateTimePickers "add datetimepickers types" ON)
option(USE_Iotaaccount "add iota account  types" OFF)
option(USE_Iotaconnection "add iota connection  types" ON)
option(USE_QVault "add QVault  types" ON)

include(FetchContent)
FetchContent_Declare(
  ccommon
  GIT_REPOSITORY https://github.com/EddyTheCo/Common.git
  GIT_TAG v0.5.0)
FetchContent_MakeAvailable(ccommon)
version_from_git(LOG OFF TIMESTAMP "%Y%m%d%H%M%S")
project(
  qmlonline
  VERSION ${VERSION}
  LANGUAGES CXX)

set_property(GLOBAL PROPERTY USE_FOLDERS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Quick Qml QuickControls2)
qt_standard_project_setup()

qt6_add_executable(appqmlonline main.cpp)
if(USE_QVault)
  FetchContent_Declare(
    EstervVault
    GIT_REPOSITORY https://github.com/EddyTheCo/Esterv.Crypto.Vault.git
    GIT_TAG v1.0.0
    FIND_PACKAGE_ARGS 1 CONFIG)
  FetchContent_MakeAvailable(EstervVault)
  target_link_libraries(
    appqmlonline
    PRIVATE
    Esterv::vault
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::vault,TYPE>,STATIC_LIBRARY>:Esterv::vaultplugin>
  )
  list(APPEND qmlimport "Esterv.Crypto.Vault")
endif(USE_QVault)
if(USE_OMClient)
  FetchContent_Declare(
    EstervOpenMeteo 
    GIT_REPOSITORY https://github.com/EddyTheCo/Esterv.Utils.OMClient.git
    GIT_TAG v0.4.0
    FIND_PACKAGE_ARGS 0.4 CONFIG)
  FetchContent_MakeAvailable(EstervOpenMeteo)
  target_link_libraries(
    appqmlonline
    PRIVATE
    Esterv::OMClient
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::OMClient,TYPE>,STATIC_LIBRARY>:Esterv::OMClientplugin>
  )
  list(APPEND qmlimport Esterv.CustomControls.OpenMeteo)
endif(USE_OMClient)
if(USE_Iotaconnection)
  FetchContent_Declare(
    IotaNodeConn
    GIT_REPOSITORY https://github.com/EddyTheCo/ConectionSettings.git
    GIT_TAG v0.6.0
    FIND_PACKAGE_ARGS 0.6 CONFIG)
  FetchContent_MakeAvailable(IotaNodeConn)
  target_link_libraries(
    appqmlonline
    PRIVATE
      IotaNodeConn::nodeConnection
      $<$<STREQUAL:$<TARGET_PROPERTY:IotaNodeConn::nodeConnection,TYPE>,STATIC_LIBRARY>:IotaNodeConn::nodeConnectionplugin>
  )
  list(APPEND qmlimport Esterv.Iota.NodeConnection)
endif(USE_Iotaconnection)
if(USE_Iotaaccount)
  FetchContent_Declare(
    IotaAccount
    GIT_REPOSITORY https://github.com/EddyTheCo/account.git
    GIT_TAG v0.7.0
    FIND_PACKAGE_ARGS 0.7 CONFIG)
  FetchContent_MakeAvailable(IotaAccount)
  target_link_libraries(
    appqmlonline
    PRIVATE
      IotaAccount::account
      $<$<STREQUAL:$<TARGET_PROPERTY:IotaAccount::account,TYPE>,STATIC_LIBRARY>:IotaAccount::accountplugin>
  )
  list(APPEND qmlimport "Esterv.Iota.Account")
endif(USE_Iotaaccount)

if(USE_QtQr)
  FetchContent_Declare(
    EstervQrCode
    GIT_REPOSITORY https://github.com/EddyTheCo/Esterv.Utils.QrCode
    GIT_TAG v2.0.0
    FIND_PACKAGE_ARGS 2 CONFIG)
  FetchContent_MakeAvailable(EstervQrCode)
  target_link_libraries(
    appqmlonline
    PRIVATE
    Esterv::QtQrGen
    Esterv::QtQrDec
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::QtQrGen,TYPE>,STATIC_LIBRARY>:Esterv::QtQrGenplugin>
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::QtQrDec,TYPE>,STATIC_LIBRARY>:Esterv::QtQrDecplugin>
  )
  target_compile_definitions(appqmlonline PRIVATE USE_QtQr)
  list(APPEND qmlimport "Esterv.CustomControls.QrGen"
       "Esterv.CustomControls.QrDec")
endif(USE_QtQr)
if(USE_DateTimePickers)
  FetchContent_Declare(
    EstervDTPickers
    GIT_REPOSITORY https://github.com/EddyTheCo/Esterv.CustomControls.DateTimePickers.git
    GIT_TAG v1.0.0
    FIND_PACKAGE_ARGS 1 CONFIG)
  FetchContent_MakeAvailable(EstervDTPickers)
  target_link_libraries(
    appqmlonline
    PRIVATE
    Esterv::DTPickers
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::DTPickers,TYPE>,STATIC_LIBRARY>:Esterv::DTPickersplugin>
  )
  target_compile_definitions(appqmlonline PRIVATE USE_QtQr)
  list(APPEND qmlimport "Esterv.CustomControls.DateTimePickers")
endif(USE_DateTimePickers)

FetchContent_Declare(
  EstervDesigns
  GIT_REPOSITORY https://github.com/EddyTheCo/Esterv.Designs.git
  GIT_TAG v2.0.0
  FIND_PACKAGE_ARGS 2.0 CONFIG)
FetchContent_MakeAvailable(EstervDesigns)

target_link_libraries(
  appqmlonline
  PRIVATE
    Esterv::SimpleStyle
    Esterv::CustomControls
    Esterv::FlatControl
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::SimpleStyle,TYPE>,STATIC_LIBRARY>:Esterv::SimpleStyleplugin>
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::CustomControls,TYPE>,STATIC_LIBRARY>:Esterv::CustomControlsplugin>
    $<$<STREQUAL:$<TARGET_PROPERTY:Esterv::FlatControl,TYPE>,STATIC_LIBRARY>:Esterv::FlatControlplugin>
)
list(APPEND qmlimport "Esterv.Styles.Simple" "Esterv.CustomControls"
     "Esterv.Controls.Flat")

qt6_add_qml_module(
  appqmlonline
  URI
  qmlonline
  VERSION
  1.0
  RESOURCE_PREFIX
  "/esterVtech.com/imports"
  QML_FILES
  "main.qml"
  SOURCES
  "qmltextcode.cpp"
  "qmltextcode.h"
  IMPORT_PATH
  ${CMAKE_BINARY_DIR}
  IMPORTS
  ${qmlimport})
target_link_libraries(appqmlonline PRIVATE Qt6::Core Qt6::Gui Qt6::Qml
                                           Qt6::Quick Qt6::QuickControls2)

if(EMSCRIPTEN)
  target_compile_definitions(appqmlonline PRIVATE USE_EMSCRIPTEN)
  add_custom_command(
    TARGET appqmlonline
    POST_BUILD
    COMMAND
      ${CMAKE_COMMAND} ARGS -E copy
      "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.js"
      "${CMAKE_CURRENT_BINARY_DIR}/appqmlonline.wasm"
      "${CMAKE_CURRENT_BINARY_DIR}/qtloader.js"
      "${CMAKE_CURRENT_SOURCE_DIR}/wasm")
endif()

import QtQuick


import Textcode 1.0


Window {
    visible: true
    title: qsTr("QML Online")
    color: "#161616"
    Connections {
            target: JCode
            function onCodeChanged() {

                box.create(JCode.code)
            }

        }

    Item {
            id: box
            anchors.fill: parent
            property var userItem: null

            function create(textComponent) {

                if(userItem) {
                    userItem.destroy()
                }
                userItem = Qt.createQmlObject(textComponent, box, "userItem")
            }

            Component.onCompleted: box.create(JCode.code)
        }
}

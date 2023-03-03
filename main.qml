import QtQuick
import QtQml
import qmlonline

Window {
    visible: true
    title: qsTr("QML Online")
    color: "#161616"
    Connections {
        target: QmlTextCode
        function onCodeChanged() {
            box.create(QmlTextCode.code)
        }

    }
    Timer {
            interval: 1000; running: true; repeat: true  //This timer was need it to be able to use a timer inside the  useritem. I do not know the reason.
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

        Component.onCompleted: box.create(QmlTextCode.code)
    }


}

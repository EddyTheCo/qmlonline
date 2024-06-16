/****************************************************************************
**
** Copyright (C) 2023 Eduardo Gonzalez Lazo.
** Contact: https://eddytheco.github.io/
**
****************************************************************************/

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
            box.create(QmlTextCode.code);
        }
    }
    Item {
        id: box
        anchors.fill: parent
        property var userItem: null

        function create(textComponent) {
            if (userItem) {
                userItem.destroy();
            }
            userItem = Qt.createQmlObject(textComponent, box, "userItem");
        }

        Component.onCompleted: box.create(QmlTextCode.code)
    }
}

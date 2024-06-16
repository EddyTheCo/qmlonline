#pragma once

#include <QObject>
#include <QtQml/qqmlregistration.h>
#ifdef USE_EMSCRIPTEN
#include <emscripten/bind.h>
#endif

class QmlTextCode : public QObject
{
    Q_OBJECT

    Q_PROPERTY(QString code READ read NOTIFY codeChanged)
    QML_ELEMENT
    QML_SINGLETON

  public:
    QmlTextCode()
    {
        editors.push_back(this);
    };
    QString read() const
    {
        return _code;
    };
    void setCode(const std::string &code);
    static QmlTextCode *get_editor(const size_t &index);

  signals:
    void codeChanged();

  private:
    QString _code;
    static std::vector<QmlTextCode *> editors;
};

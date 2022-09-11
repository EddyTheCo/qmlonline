#ifndef QMLTEXTCODE_H
#define QMLTEXTCODE_H

#include <QObject>
#include <qqml.h>
#ifdef USE_EMSCRIPTEN
#include <emscripten/bind.h>
#endif
class qmlTextCode : public QObject
{
    Q_OBJECT

    Q_PROPERTY(QString code READ read NOTIFY codeChanged)
    QML_ELEMENT
    QML_SINGLETON

public:
    qmlTextCode(){
        editors.push_back(this);
    };
    QString read() const{return _code;};
    void setCode(const std::string& code);
    static qmlTextCode* get_editor(const size_t& index);



signals:
    void codeChanged();
private:
    QString _code;
    static std::vector<qmlTextCode*> editors;
};

#endif // QMLTEXTCODE_H

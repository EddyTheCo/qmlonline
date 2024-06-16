#include "qmltextcode.h"

std::vector<QmlTextCode *> QmlTextCode::editors = std::vector<QmlTextCode *>();
void QmlTextCode::setCode(const std::string &code)
{
    const auto var = QString::fromStdString(code);
    if (_code != var)
    {
        _code = var;
        emit codeChanged();
    }
}
QmlTextCode *QmlTextCode::get_editor(const size_t &index)
{
    return editors[index];
}
#ifdef USE_EMSCRIPTEN
EMSCRIPTEN_BINDINGS(qmltextcode)
{
    emscripten::class_<QmlTextCode>("qmlTextCode")
        .function("setCode", &QmlTextCode::setCode)
        .class_function("get_editor", &QmlTextCode::get_editor, emscripten::allow_raw_pointers());
}
#endif

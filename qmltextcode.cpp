#include "qmltextcode.h"

std::vector<qmlTextCode*> qmlTextCode::editors=std::vector<qmlTextCode*>();
void qmlTextCode::setCode(const std::string &code)
{
    const auto var=QString::fromStdString(code);
    if (_code != var) {
        _code = var;
        emit codeChanged();
    }
}
qmlTextCode* qmlTextCode::get_editor(const size_t& index)
{
    return editors[index];
}
#ifdef USE_EMSCRIPTEN
EMSCRIPTEN_BINDINGS(qmltextcode) {
    emscripten::class_<qmlTextCode>("qmlTextCode")
        .function("setCode", &qmlTextCode::setCode)
        .class_function("get_editor", &qmlTextCode::get_editor, emscripten::allow_raw_pointers());
}
#endif

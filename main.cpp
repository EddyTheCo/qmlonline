#include <QGuiApplication>
#include <QQmlApplicationEngine>

#include <QQuickStyle>
#ifdef USE_QtQr
#include <esterv/utils/qr_image_decoder.hpp>
#include <esterv/utils/qr_image_provider.hpp>
#endif

using namespace Esterv::Utils::QrGen;
using namespace Esterv::Utils::QrDec;

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);
    QQuickStyle::setStyle("Esterv.Controls.Flat");

    QQmlApplicationEngine engine;
    engine.addImportPath("qrc:/esterVtech.com/imports");

#ifdef USE_QtQr
    engine.addImageProvider(QLatin1String("qrcode"), new QRImageProvider(1));
    engine.addImageProvider(QLatin1String("wasm"), new WasmImageProvider());
#endif
    const QUrl url("qrc:/esterVtech.com/imports/qmlonline/main.qml");
    engine.load(url);

    return app.exec();
}

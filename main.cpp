#include <QGuiApplication>
#include <QQmlApplicationEngine>


#ifdef USE_QtQr
#include "Qrimageprovider.hpp"
#include"Qrimagedecoder.hpp"
#endif



int main(int argc, char *argv[])
{
	QGuiApplication app(argc, argv);

	QQmlApplicationEngine engine;
    engine.addImportPath("qrc:/esterVtech.com/imports");

#ifdef USE_QtQr
    engine.addImageProvider(QLatin1String("qrCodedarkred"), new QRImageProvider("darkred",1));
    engine.addImageProvider(QLatin1String("qrCodeBlue"), new QRImageProvider("blue",1));
    engine.addImageProvider(QLatin1String("qrCodeBlack"), new QRImageProvider("black",1));
    engine.addImageProvider(QLatin1String("qrCodemaroon"), new QRImageProvider("maroon",1));
    engine.addImageProvider(QLatin1String("wasm"), new WasmImageProvider());
#endif
    qDebug()<<engine.importPathList();
    qmlRegisterSingletonType(QUrl(u"qrc:/esterVtech.com/imports/MyDesigns/qml/CustomStyle.qml"_qs), "CustomStyle", 1, 0, "CustomStyle");
	const QUrl url(u"qrc:/esterVtech.com/imports/qmlonline/main.qml"_qs);
	QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
			&app, [url](QObject *obj, const QUrl &objUrl) {
			if (!obj && url == objUrl)
			QCoreApplication::exit(-1);
			}, Qt::QueuedConnection);
	engine.load(url);

	return app.exec();
}

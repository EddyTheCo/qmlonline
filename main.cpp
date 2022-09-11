#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include "qmltextcode.h"
#include<iostream>
#ifdef USE_QtQrGen
#include "Qrimageprovider.hpp"
#endif



int main(int argc, char *argv[])
{
	qmlTextCode *Code = new qmlTextCode();
	qmlRegisterSingletonType<qmlTextCode>("Textcode", 1, 0, "JCode",
			[&Code](QQmlEngine *engine, QJSEngine *scriptEngine) -> QObject * {
			Q_UNUSED(engine)
			Q_UNUSED(scriptEngine)


			return Code;
			});
	QGuiApplication app(argc, argv);

	QQmlApplicationEngine engine;
#ifdef USE_QtQrGen
    engine.addImageProvider(QLatin1String("qrCodedarkred"), new QRImageProvider("darkred",1));
    engine.addImageProvider(QLatin1String("qrCodeBlue"), new QRImageProvider("blue",1));
    engine.addImageProvider(QLatin1String("qrCodeBlack"), new QRImageProvider("black",1));
    engine.addImageProvider(QLatin1String("qrCodemaroon"), new QRImageProvider("maroon",1));
#endif
	const QUrl url(u"qrc:/qmlonline/main.qml"_qs);
	QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
			&app, [url](QObject *obj, const QUrl &objUrl) {
			if (!obj && url == objUrl)
			QCoreApplication::exit(-1);
			}, Qt::QueuedConnection);
	engine.load(url);

	return app.exec();
}

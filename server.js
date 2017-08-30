var express = require('express');
var env = require('node-env-file');
const PdfPrinter = require('pdfmake');
var app = express();
var port = process.env.PORT || 8080;

// Load environment variables for localhost
try {
	env(__dirname + '/.env');
} catch (e) {}

// ejs view engine
app.set('view engine', 'ejs');

// add routes
app.get('/', function(req, res) {
    var fonts = {
        Roboto: {
            normal: 'fonts/Roboto-Regular.ttf',
            bold: 'fonts/Roboto-Medium.ttf',
            italics: 'fonts/Roboto-Italic.ttf',
            bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
    };
    const printer = new PdfPrinter(fonts);
    const docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    const pdf = printer.createPdfKitDocument(docDefinition);
    pdf.pipe(res);
    pdf.end();
});

// Serve your app
console.log('Served: http://localhost:' + port);
app.listen(port);

var express = require('express');
var env = require('node-env-file');
var dateFormat = require('dateformat');
var oauth2 = require('salesforce-oauth2');
const PdfPrinter = require('pdfmake');
const pdfFonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

var app = express();
var port = process.env.PORT || 8080;

// Load environment variables for localhost
try {
	env(__dirname + '/.env');
} catch (e) {}

// get oauth data
const baseUrl = process.env.OAUTH_BASE_URL || 'https://login.salesforce.com';
const callbackUrl = process.env.OAUTH_CALLBACK_URL;
const consumerKey = process.env.OAUTH_CONSUMER_KEY;
const consumerSecret = process.env.OAUTH_CONSUMER_SECRET;
console.log(`Using OAUTH_BASE_URL: ${baseUrl}`);
console.log(`Using OAUTH_CALLBACK_URL: ${callbackUrl}`);
console.log(`Using OAUTH_CONSUMER_KEY: ${consumerKey.substring(0,5)}...`);
console.log(`Using OAUTH_CONSUMER_SECRET: ${consumerSecret.substring(0, 5)}...`);

// ejs view engine
app.set('view engine', 'ejs');

// add routes
app.get('/', function(req, res) {
    var uri = oauth2.getAuthorizationUrl({
        redirect_uri: callbackUrl,
        client_id: consumerKey,
        scope: 'api',
        base_url: baseUrl
    });
    return res.redirect(uri);
});
app.get('/oauth/callback', function(req, res) {
    let authorizationCode = req.query.code;
    let args = {
        "redirect_uri": callbackUrl,
        "client_id": consumerKey,
        "client_secret": consumerSecret,
        "code": authorizationCode

    };
    oauth2.authenticate(args, function(err, payload) {
        if (err) {
            res.send(JSON.stringify(err));
            return;
        }
        console.log(payload);
        const instance_url = payload.instance_url;
        res.write(`received data: ${instance_url}`);
    });
})
app.get('/print', function(req, res) {
    const printer = new PdfPrinter(pdfFonts);
    const generatedDate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM');
    const docDefinition1 = { content: 'This is an sample PDF printed with pdfMake' };
    const docDefinition2 = {
        content: [
            {text: 'Working Group List', style: 'header'},
            {text: `Generate on ${generatedDate}`, alignment: 'right'},
            {
                style: 'tableExample',
                table: {
                    widths: [100, '*', 200, '*'],
                    dontBreakRows: true,
                    body: [
                        [{text: 'Some Table Header\nthat goes across two lines', colSpan: 4, fillColor: '#ff0000', alignment: 'center'},{},{},{}],
                        ['width=100', 'star-sized', 'width=200', 'star-sized'],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}]
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: [100, '*', 200, '*'],
                    dontBreakRows: true,
                    body: [
                        [{text: 'Some Table Header\nthat goes across two lines', colSpan: 4, fillColor: '#ff0000', alignment: 'center'},{},{},{}],
                        ['width=100', 'star-sized', 'width=200', 'star-sized'],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}],
                        ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}]
                    ]
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
            // alignment: 'justify'
        }
    }
    const pdf = printer.createPdfKitDocument(docDefinition2);
    pdf.pipe(res);
    pdf.end();
});

// Serve your app
console.log('Served: http://localhost:' + port);
app.listen(port);

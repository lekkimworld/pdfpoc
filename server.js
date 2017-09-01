var express = require('express');
var session = require('express-session');
var env = require('node-env-file');
var dateFormat = require('dateformat');
var oauth2 = require('salesforce-oauth2');
var rp = require('request-promise');
var redis = require("redis");
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);

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
app.use(session({
    "client": client,
    "store": new RedisStore(options),
    "secret": 'keyboard cat'
}));
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
    // see if there is an access token already
    if (req.session.access_token) {
        res.redirect('/print');
        return;
    }

    // initiate oauth flow
    var uri = oauth2.getAuthorizationUrl({
        redirect_uri: callbackUrl,
        client_id: consumerKey,
        scope: 'api',
        prompt: 'login consent',
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
        "code": authorizationCode,
        "base_url": baseUrl
    };
    oauth2.authenticate(args, function(err, payload) {
        if (err) {
            res.send(JSON.stringify(err));
            return;
        }
        const {access_token, instance_url} = payload;
        req.session.access_token = access_token;
        req.session.instance_url = instance_url;
        res.redirect('/print');
    });
})
app.get('/print', function(req, res) {
    // make sure we have an access token
    if (!req.session.access_token) {
        res.redirect('/');
        return;
    }

    // use Salesforce API to get users
    const options = {
        uri: `${req.session.instance_url}/services/data/v39.0/query/?q=SELECT+Id,+Firstname,+Lastname,+Email+FROM+User ORDER BY Firstname ASC LIMIT 100`,
        headers: {
            "Authorization": `Bearer ${req.session.access_token}`,
            "Content-Type": "application/json"
        }
    };
    rp(options).then(strdata => {
        // received data from Salesforce - build data
        const bodySF = [[{text: 'Salesforce.com Emails', style: 'tableHeader', colSpan: 4}, {}, {}, {}]];
        const bodyNonSF = [[{text: 'Other Emails', style: 'tableHeader', colSpan: 4}, {}, {}, {}]];
        const data = JSON.parse(strdata);
        Object.keys(data.records).forEach(k => {
            const u = data.records[k];
            if (u.Email.indexOf('salesforce.com') >= 0) {
                bodySF.push([u.Id, u.Email, u.FirstName, u.LastName]);
            } else {
                bodyNonSF.push([u.Id, u.Email, u.FirstName, u.LastName]);
            }
        })

        // build definition for PDF
        const docDefinition = {
            content: [],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center'
                }
            }
        }
        docDefinition.content.push({text: 'Working Group List', style: 'header'});
        docDefinition.content.push({text: `Generate on ${dateFormat(new Date(), 'yyyy-mm-dd HH:MM')}`, alignment: 'right'});
        docDefinition.content.push({
            style: 'tableExample',
            table: {
                widths: [100, 100, '*', '*'],
                dontBreakRows: true,
                body: bodySF
            }
        });
        docDefinition.content.push({
            style: 'tableExample',
            table: {
                widths: [100, 100, '*', '*'],
                dontBreakRows: true,
                body: bodyNonSF
            }
        });
        
        // create PDF
        const printer = new PdfPrinter(pdfFonts);
        const pdf = printer.createPdfKitDocument(docDefinition);
        pdf.pipe(res);
        pdf.end();

    }).error(err => {
        res.send(err);
    });
});

// Serve your app
console.log('Served: http://localhost:' + port);
app.listen(port);

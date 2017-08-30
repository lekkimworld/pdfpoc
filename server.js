var express = require('express');
var env = require('node-env-file');
var pdfMake = require('pdfmake');
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
    const docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(docDefinition).download();    
});

// Serve your app
console.log('Served: http://localhost:' + port);
app.listen(port);

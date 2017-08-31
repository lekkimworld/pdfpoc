# PDF from Salesforce Proof-of-Concept
This is a simple proof-of-concept on how to build PDF's of the fly from Salesforce data. The application is in node.js (using [express](https://expressjs.com/)) and uses [pdfmake](http://pdfmake.org/) to generate the PDF from a JSON descriptor. The data is read from Salesforce using the REST API utilizing OAuth 2.0 for authorization (using [salesforce-oauth2](https://github.com/cangencer/salesforce-oauth2)). 

The application will when accessed verify that an OAuth access token exists in the users session. If not the [OAuth 2.0 Web-Server Flow](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_understanding_web_server_oauth_flow.htm) will be initiated. Once an access token has been obtained the top 100 users sorted by firstname is retrieved and split into two tables w/ users having a salesforce.com address in one table and all others in another table. The purpose is primarily to test multiple tables, page breaks and not splitting rows acrosss pages.

## Deployment
Deployment to [Heroku](http://heroku.com) is by far the easiest:
* Clone project
* Create app in Heroku: ```heroku apps:create```
* Note down the allocated URL
* Create Connected App in Salesforce using the URL noted above
* Set the environment variables (see below)
  * OAUTH_CONSUMER_KEY
  * OAUTH_CONSUMER_SECRET
  * OAUTH_CALLBACK_URL
  * OAUTH_BASE_URL (optional - set to https://test.salesforce.com for sandboxes)
* Push code to Heroku: ```git push heroku master```

### Deployment steps (Heroku)
```bash
heroku apps:create
heroku config:set OAUTH_CONSUMER_SECRET=shhh... 
heroku config:set OAUTH_CONSUMER_KEY=foo 
heroku config:set OAUTH_CALLBACK_URL=https://funky-bastion-28732.herokuapp.com/oauth/callback
git push heroku master
heroku open
```
### Deployment steps (Docker)
```
docker build -t lekkim/pdfpoc .
docker run -p 8080:8080 -d lekkim/pdfpoc
```

## Licenses
This project is licensed using the MIT license and dependencies are listed in the licenses.txt file.

api-token
=========

Simple module for Node.js that can be used e.g. for REST api session management.

##Work in progress, not tested

## Installation

@todo npm install api-token --save

## Usage

### Node.js server

**expressjs**

```javascript
var apiToken        = require('api-token');
/* set expiration time to 2 minutes */
apiToken.setExpirationTime(2);
```

```javascript
app.all('/api/*', function(req, res, next){
    if(req.url === '/api/authenticate'){
        /* token is not needed when authenticating */
        next();
    }else if(apiToken.isTokenValid(req.get('API-Token'))){
        /* if token is valid continue */
        next();
    }else{
        /* if token is not valid send unauthorized http statuscode to client */
        res.send(401);
    }
});
```

```javascript
app.post('/api/authenticate', function(req, res){
    var authenticated = false;
    /* do your authentication tricks */
    if(!authenticated){
        res.send(401);
    }else{
        var user = apiToken.addUser(req.body.username);
        /* send token back to client */
        res.send(200,{'token':user.token});
    }
});
```

**plain http server**

```javascript
http.createServer(function (req, res) {
    /* if requesting API */
    if((req.url.indexOf('/api')>-1)){
        /* if authenticating */
        if(req.url.indexOf('/api/authenticate')>-1){
            if (req.method == 'POST') {
                var payload = "";
                req.on('data', function(chunk) {
                    payload= chunk.toString();
                });
                req.on('end', function() {
                    var json = JSON.parse(payload);
                    var authenticated = false;
                    /* do your authentication tricks */
                    if(!authenticated){
                        res.writeHead(401, "Unauthorized", {'Content-Type': 'text/plain'});
                        res.end();
                    }else{
                        var user = apiToken.addUser(json.username);
                        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
                        /* send token back to client */
                        res.end(JSON.stringify({'token':user.token}));
                    }
                });
            }
        }else{
            if(apiToken.isTokenValid(req.headers['api-token'])){
                /* if token is valid continue */
                res.writeHead(200, "OK", {'Content-Type': 'application/json'});
                res.end(JSON.stringify({'message':'Here is the data you requested, sir.'}));
            }else{
                /* if token is not valid send unauthorized http statuscode to client */
                res.writeHead(401, "Unauthorized", {'Content-Type': 'text/plain'});
                res.end();
            }
        }
    }else{
        /* not api request */
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end();
    }
}).listen(1337, '127.0.0.1');
```

### Client

**jQuery**

```javascript
----
```


## Release History

* 0.1.0 Initial release
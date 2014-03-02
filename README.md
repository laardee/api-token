api-token
=========

Simple module for Node.js that can be used e.g. for REST api session management.

##Work in progress, not tested

## Installation

@todo npm install api-token --save

## Usage

expressjs

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
        /* if token is not valid send unauthorized http status code to client */
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


## Release History

* 0.1.0 Initial release
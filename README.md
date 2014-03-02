api-token
=========

Simple module for Node.js that can be used e.g. for REST api session management.

##Work in progress, not tested

## Installation

@todo npm install api-token --save

## Usage

expressjs

```javascript
app.all('/api/*', function(req, res, next){
    console.log('call:'+req.url);
    if(req.url === '/api/authenticate'){
        next();
    }else if(apiToken.isTokenValid(req.get('API-Token'))){
        next();
    }else{
        res.send(401);
    }
});
```

```javascript
app.post('/api/authenticate', function(req, res){
    if(req.body.password!='bar'){
        apiToken.removeUser(req.body.username);
        res.send(401);
    }else{
        res.send(200,{'token':apiToken.addUser(req.body.username).token});
    }
});
```


## Release History

* 0.1.0 Initial release
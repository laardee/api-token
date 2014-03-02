(function() {

    var uuid = require('uuid');

    var users = [];
    var expirationTime = 1;

    /**
     * User object
     * @param token
     * @param username
     * @constructor
     */
    function User(token, username){
        this.token = token;
        this.refreshed = null;
        //this.expires = null;
        this.username = username;
        this.refresh();
    }
    User.prototype.refresh = function() {
        this.refreshed = new Date();
        /*this.expires = new Date();
        this.expires.setMinutes(this.expires.getMinutes()+1);
        console.log('this.expires:'+this.expires);*/
    }
    User.prototype.isValid=function(){
        if(this.token==undefined){
            return false;
        }else{
            var exp = new Date(this.refreshed.getTime());
            exp.setMinutes(exp.getMinutes()+expirationTime);

            // fast clicking may give wrong time?

            console.log('expires at ' + exp);

            return (exp.getTime()>=(new Date()).getTime());
        }
    }
    /* Garbage collection -> removes expired users in every 10 minutes*/
    setInterval(function(){
        users = users.filter(function(item){
            return item.isValid();
        });
        console.log("users");
        console.log(users);
    }, 10*60*1000 /* debug 5*1000*/);

    var findUserByToken = function (token){
        var result = users.slice(0);
        result = result.filter(function(item){
            return (item.token == token);
        });
        return result[0];
    }

    var findUserByUsername = function (username){
        var result = users.slice(0);
        result = result.filter(function(item){
            return (item.username == username);
        });
        return result[0];
    }

    var removeUserByUsername = function(username){
        users = users.filter(function(item){
            return (item.username != username);
        });
    }

    /**
     * Add user to pool
     * @param token
     * @param username
     * @returns {User}
     */
    module.exports.addUser = function(username) {
        removeUserByUsername(username);
        var user = new User(uuid.v4(), username);
        users.push(user);
        return user;
    }
    /**
     * Removes user from pool
     * @param username
     */
    module.exports.removeUser = function(username) {
        removeUserByUsername(username);
    }
    /**
     * Checks if token is still valid
     * @param token
     * @returns {boolean}
     */
    module.exports.isTokenValid = function(token) {
        var user = findUserByToken(token);
        if( user!=undefined ){
            var isValid = user.isValid();
            if(isValid){
                user.refresh();
            }
            return isValid;
        }
        return false;
    }
    /**
     *
     * @param time in minutes
     */
    module.exports.setExpirationTime = function(time) {
        expirationTime = time;
    }
    /**
     * Finds user from valid users based on token
     * @param token
     * @returns {User}
     */
    module.exports.findUserByToken = function(token) {
        return findUserByToken(token);
    }
    /**
     * Finds user from valid users based on username
     * @param username
     * @returns {User}
     */
    module.exports.findUserByUsername = function(username) {
        return findUserByUsername(username);
    }
}());
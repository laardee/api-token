(function() {

    var uuid = require('uuid');
    /**
     *  Users array
     * @type {Array}
     */
    var users = [];

    function User(token, username){
        this.token = token;
        this.expires = null;
        this.username = username;
        this.refresh();
    }
    User.prototype.refresh = function() {
        this.expires = new Date();
        this.expires.setMinutes(this.expires.getMinutes()+1);
        console.log('this.expires:'+this.expires);
    }
    User.prototype.isValid=function(){
        if(this.token==undefined){
            return false;
        }else{
            return (this.expires.getTime()>=(new Date()).getTime());
        }
    }
    /* Garbage collection -> removes expired users */
    setInterval(function(){
        users = users.filter(function(item){
            return item.isValid();
        });
        console.log(users);
    }, 60*1000);

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
     * Add user to session
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
     * Removes user from session
     * @param username
     */
    module.exports.removeUser = function(username) {
        removeUserByUsername(username);
    }
    /**
     * Checks if token is still valid in session
     * @param token
     * @returns {boolean}
     */
    module.exports.isTokenValid = function(token) {
        var user = findUserByToken(token);
        if( user!=undefined ){
            user.refresh();
            return user.isValid();
        }
        return false;
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
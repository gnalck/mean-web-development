var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var URI = require('urijs');

var changeUrl = function(url) {
    if (!url) {
        return url;
    } else {
        var uri = new URI(url);
        uri.scheme("http");
        return uri.toString();
    }
};

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: {
        type: String,
        trim: true
    },
    password: String,
    created: {
        type: Date,
        default: Date.now
    },
    website: {
        type: String,
        get: changeUrl,
        set: changeUrl,
    }
});

UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

mongoose.model('User', UserSchema);
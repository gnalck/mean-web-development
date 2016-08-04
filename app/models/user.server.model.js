var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var URI = require('urijs');
var crypto = require('crypto');

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
    email: {
        type: String,
        match: [/.+\@.+\..+/, "invalid emails are not ok"]
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: 'Username is required',
    },
    password: {
        type: String,
        validate: [
            function(password) {
                return password.length >= 6;
            },
            'Password should be longer'
        ]
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: "give us a provider, mane"
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    },
    website: {
        type: String,
        get: changeUrl,
        set: changeUrl,
    },
    role: {
        type: String,
        enum: ['Admin', 'User', 'Owner']
    }
});

UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    // later on we want 'this' to refer to this function call
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (err) {
            return callback(null);
        }
        if (user) {
            return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
        return callback(possibleUsername);
    });
};

UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
}

UserSchema.pre('save', function(next) {
    this.wasNew = this.isNew;
    console.log('About to save...');
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.post('save', function(next) {
    if (this.wasNew) {
        console.log('A new user was created.');
    } else {
        console.log('Updated user details.');
    }
});

UserSchema.set('toJSON', { getters: true, virtuals: true });

mongoose.model('User', UserSchema);
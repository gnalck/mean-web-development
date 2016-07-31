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
    email: {
        type: String,
        index: true,
        match: /.+\@.+\..+/
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
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

UserSchema.statics.findOneByUsername = function (username, callback) {
    this.findOne({username: new RegExp(username, 'i') }, callback);
};

UserSchema.methods.authenticate = function(password) {
    return this.password == password;
};

UserSchema.pre('save', function(next) {
    this.wasNew = this.isNew;
    console.log('About to save...');
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
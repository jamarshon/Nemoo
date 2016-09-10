var mongoose = require('mongoose');

var MAX_QUEUE_LENGTH = 25;

var discussionSchema = mongoose.Schema({
    name: String,
    data: [{
        displayName: String,
        profilePic: String,
        created: Number,
        message: String
    }]
});

discussionSchema.methods.addMessage = function(displayName, profilePic, message) {
    var message =  {displayName: displayName, 
                    profilePic: profilePic,
                    created: Date.now(),
                    message: message};
    // The data is a queue of messages so it is automatically sorted by creation date
    // the maximum displayed messages is MAX_QUEUE_LENGTH so remove the element that was inserted first
    if(this.data.length > MAX_QUEUE_LENGTH) {
        this.data.shift();
    }
    this.data.push(message);
};

module.exports = mongoose.model('Discussion', discussionSchema);

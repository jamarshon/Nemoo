var ImageHandler    = require('../../util/imageHandler');
var mongoose        = require('mongoose');

var MAX_QUEUE_LENGTH = 25;

var discussionSchema = mongoose.Schema({
    name: String,
    displayName: String,
    description: String,
    category: String,
    messageCount: Number,
    data: [{
        displayName: String,
        profilePic: String,
        backgroundColor: String,
        created: Number,
        message: String
    }]
});

discussionSchema.methods.addMessage = function(displayName, profilePic, message, backgroundColor, currentTime) {
    var message =  {displayName: displayName, 
                    profilePic: profilePic,
                    backgroundColor: backgroundColor || '',
                    created: currentTime,
                    message: message};
    // The data is a queue of messages so it is automatically sorted by creation date
    // the maximum displayed messages is MAX_QUEUE_LENGTH so remove the element that was inserted first
    if(this.data.length > MAX_QUEUE_LENGTH) {
        var firstItem = this.data.shift();
        ImageHandler.process(firstItem.message);
    }

    this.data.push(message);
    this.messageCount++;
    this.save(function (err) {
        if(err) 
            console.error('addMessage failure: ' + err);
    });
};

module.exports = mongoose.model('Discussion', discussionSchema);

var mongoose = require('mongoose');

var AppSchema = mongoose.Schema({
    id: String,
    currentNumOnline: Number,
});

AppSchema.methods.adjustNumOnline = function(offset) {
    this.currentNumOnline += offset;
    this.save(function (err) {
        if(err) 
            console.error('adjustNumOnline failure: ' + err);
    });
};


module.exports = mongoose.model('App', AppSchema);

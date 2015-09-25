/**
 * Created by HUQ on 9/24/15.
 */
var mongoose = require('mongoose');

var transSchema = mongoose.Schema({
  date: {type: Date, required: true},
  amount: {type: Number, required: true}
});

module.exports = mongoose.model('Trans', transSchema);

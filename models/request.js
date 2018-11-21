// Request Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var RequestSchema = new Schema({
    branch:           { type: Schema.Types.ObjectId, ref: "Branch" },
    config:           { type: Schema.Types.ObjectId, ref: "Geoconfig" },
    indicator:           { type: String, default: "NULL"},
    UID:      { type: String, default: "NULL" },
    date_created:   { type: Date },
    last_modified:  { type: Date }
});

// add mongoose-troop middleware to support pagination
RequestSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
RequestSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter Request Attributes to expose
 */
RequestSchema.statics.attributes = {
  _id: 1,
  branch: 1,
  config: 1,
  UID: 1,
  indicator: 1,
  date_created: 1,
  last_modified: 1
};


// Expose Request model
module.exports = mongoose.model('Request', RequestSchema);

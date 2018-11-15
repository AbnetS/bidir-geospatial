// Geoconfig Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var GeoconfigSchema = new Schema({
    user:           { type: Schema.Types.ObjectId, ref: "User" },
    name:           { type: String, default: "NULL"},
    branch:         { type: Schema.Types.ObjectId, ref: "Branch" },
    indicator:      { type: String, default: "NULL"},
    from_date:      { type: Date, default: null },
    to_date:        { type: Date, default: null },
    date_created:   { type: Date },
    last_modified:  { type: Date }
});

// add mongoose-troop middleware to support pagination
GeoconfigSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
GeoconfigSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter Geoconfig Attributes to expose
 */
GeoconfigSchema.statics.attributes = {
  _id: 1,
  user: 1,
  name: 1,
  branch: 1,
  indicator: 1,
  from_date: 1,
  to_date: 1,
  date_created: 1,
  last_modified: 1
};


// Expose Geoconfig model
module.exports = mongoose.model('Geoconfig', GeoconfigSchema);

'use strict';
// Access Layer for Geoconfig Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-geoconfig');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Geoconfig    = require('../models/geoconfig');
const Branch    = require('../models/branch');
const User    = require('../models/user');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = Geoconfig.attributes;
var population = [{
  path: 'branch',
  select: Branch.attributes
},{
  path: 'user',
  select: User.attributes
}];

/**
 * create a new geoconfig.
 *
 * @desc  creates a new geoconfig and saves them
 *        in the database
 *
 * @param {Object}  geoconfigData  Data for the geoconfig to create
 *
 * @return {Promise}
 */
exports.create = function create(geoconfigData) {
  debug('creating a new geoconfig');

  return co(function* () {

    let unsavedGeoconfig = new Geoconfig(geoconfigData);
    let newGeoconfig = yield unsavedGeoconfig.save();
    let geoconfig = yield exports.get({ _id: newGeoconfig._id });

    return geoconfig;


  });

};

/**
 * delete a geoconfig
 *
 * @desc  delete data of the geoconfig with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteGeoconfig(query) {
  debug('deleting geoconfig: ', query);

  return co(function* () {
    let geoconfig = yield exports.get(query);
    let _empty = {};

    if(!geoconfig) {
      return _empty;
    } else {
      yield geoconfig.remove();

      return geoconfig;
    }

  });
};

/**
 * update a geoconfig
 *
 * @desc  update data of the geoconfig with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating geoconfig: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return Geoconfig.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a geoconfig.
 *
 * @desc get a geoconfig with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, geoconfig) {
  debug('getting geoconfig ', query);

  return Geoconfig.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of geoconfigs
 *
 * @desc get a collection of geoconfigs from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of geoconfigs');

  return Geoconfig.find(query, returnFields)
    .populate(population)
    .exec();


};

/**
 * get a collection of geoconfigs using pagination
 *
 * @desc get a collection of geoconfigs from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of geoconfigs');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    Geoconfig.paginate(query, opts, function (err, docs) {
      if(err) {
        return reject(err);
      }

      let data = {
        total_pages: docs.pages,
        total_docs_count: docs.total,
        current_page: docs.page,
        docs: docs.docs
      };

      return resolve(data);

    });
  });


};

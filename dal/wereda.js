'use strict';
// Access Layer for Wereda Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-Wereda');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Wereda    = require('../models/wereda');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = Wereda.attributes;
var population = [];

/**
 * create a new Wereda.
 *
 * @desc  creates a new Wereda and saves them
 *        in the database
 *
 * @param {Object}  WeredaData  Data for the Wereda to create
 *
 * @return {Promise}
 */
exports.create = function create(WeredaData) {
  debug('creating a new Wereda');

  return co(function* () {

    let unsavedWereda = new Wereda(WeredaData);
    let newWereda = yield unsavedWereda.save();
    let wereda = yield exports.get({ _id: newWereda._id });

    return wereda;


  });

};

/**
 * delete a Wereda
 *
 * @desc  delete data of the Wereda with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteWereda(query) {
  debug('deleting Wereda: ', query);

  return co(function* () {
    let wereda = yield exports.get(query);
    let _empty = {};

    if(!wereda) {
      return _empty;
    } else {
      yield wereda.remove();

      return wereda;
    }

  });
};

/**
 * update a Wereda
 *
 * @desc  update data of the Wereda with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating Wereda: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return Wereda.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a Wereda.
 *
 * @desc get a Wereda with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query) {
  debug('getting Wereda ', query);

  return Wereda.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of Weredas
 *
 * @desc get a collection of Weredas from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of Weredas');

  return Wereda.find(query, returnFields)
    .populate(population)
    .exec();


};

/**
 * get a collection of Weredas using pagination
 *
 * @desc get a collection of Weredas from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of Weredas');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    Wereda.paginate(query, opts, function (err, docs) {
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

'use strict';
// Access Layer for Request Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-request');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Request    = require('../models/request');
const Branch    = require('../models/branch');
const Geoconfig    = require('../models/geoconfig');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = Request.attributes;
var population = [{
  path: 'branch',
  select: Branch.attributes
},{
  path: 'config',
  select: Geoconfig.attributes
}];

/**
 * create a new request.
 *
 * @desc  creates a new request and saves them
 *        in the database
 *
 * @param {Object}  requestData  Data for the request to create
 *
 * @return {Promise}
 */
exports.create = function create(requestData) {
  debug('creating a new request');

  return co(function* () {

    let unsavedRequest = new Request(requestData);
    let newRequest = yield unsavedRequest.save();
    let request = yield exports.get({ _id: newRequest._id });

    return request;


  });

};

/**
 * delete a request
 *
 * @desc  delete data of the request with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteRequest(query) {
  debug('deleting request: ', query);

  return co(function* () {
    let request = yield exports.get(query);
    let _empty = {};

    if(!request) {
      return _empty;
    } else {
      yield request.remove();

      return request;
    }

  });
};

/**
 * update a request
 *
 * @desc  update data of the request with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating request: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return Request.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a request.
 *
 * @desc get a request with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, request) {
  debug('getting request ', query);

  return Request.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of requests
 *
 * @desc get a collection of requests from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of requests');

  return Request.find(query, returnFields)
    .populate(population)
    .exec();


};

/**
 * get a collection of requests using pagination
 *
 * @desc get a collection of requests from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of requests');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    Request.paginate(query, opts, function (err, docs) {
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

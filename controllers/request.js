'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:request-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');

const Account            = require('../models/account');

const BranchDal          = require('../dal/branch');
const RequestDal       = require('../dal/request');
const LogDal             = require('../dal/log');
const AccountDal         = require('../dal/account');

let hasPermission = checkPermissions.isPermitted('USER');

/**
 * Create a request.
 *
 * @desc create a request using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createRequest(next) {
  debug('create request');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'REQUEST_CREATE_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  let body = this.request.body;

  this.checkBody('branch')
      .notEmpty('Request Branch Reference is Empty!!');
  this.checkBody('config')
      .notEmpty('Request Config Reference is Empty!!');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'REQUEST_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  //Check if a request with the same UID exists...
  let request = yield RequestDal.get({UID: body.UID});
  if (request){
    debug ("The request exists, so need to add, returning the same request as a response");

    this.body = request;
  }
  else{

    try {

      // Create Request Type
      let request = yield RequestDal.create(body);

      this.body = request;

    } catch(ex) {
      this.throw(new CustomError({
        type: 'REQUEST_CREATION_ERROR',
        message: ex.message
      }));
    }
}

};


/**
 * Get a single request.
 *
 * @desc Fetch a request with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneRequest(next) {
  debug(`fetch request: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'REQUEST_VIEW_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  let query = {
    _id: this.params.id
  };

  try {
    let request = yield RequestDal.get(query);
    if(!request || !request._id) {
      throw new Error('Request does not Exist!!');
    }

    yield LogDal.track({
      event: 'view_request',
      request: this.state._user._id ,
      message: `View request - ${request.phone}`
    });

    this.body = request;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REQUEST_VIEW_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single request.
 *
 * @desc Fetch a request with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateRequest(next) {
  debug(`updating request: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_REQUEST_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let request = yield RequestDal.update(query, body);
    if(!request || !request._id) {
      throw new Error('Request does not Exist!!');
    }

    yield LogDal.track({
      event: 'request_update',
      request: this.state._user._id ,
      message: `Update Info for ${request.name}`,
      diff: body
    });

    this.body = request;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_REQUEST_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of requests by Pagination
 *
 * @desc Fetch a collection of requests
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllRequests(next) {
  debug('get a collection of requests by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_REQUESTS_COLLECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = -1) : (sort.date_created = -1 );

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  let canViewAll =  yield hasPermission(this.state._user, 'VIEW_ALL');
  let canView =  yield hasPermission(this.state._user, 'VIEW');

  try {
    let user = this.state._user;
    let account = yield Account.findOne({ user: user._id }).exec();

    // Super Admin
    if (!account || (account.multi_branches && canViewAll)) {
        query = {};

    // Can VIEW ALL
    } else {
      if(account.access_branches.length) {
          query.branch = { $in: account.access_branches };

      } else if(account.default_branch) {
          query.branch = account.default_branch;

      }

    }


    let requests = yield RequestDal.getCollectionByPagination(query, opts);

    this.body = requests;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'VIEW_REQUESTS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Search  requests 
 *
 * @desc Fetch a collection searched requests
 *
 * @param {Function} next Middleware dispatcher
 */
exports.search = function* searchRequestes(next) {
  debug('search requests');

  try {
    let query = this.request.query;

    if(!Object.keys(query).length) {
      throw new Error('Search Query is missing');
    }

    let requests = yield RequestDal.getCollection(query);

    this.body = requests;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REQUEST_SEARCH_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Delete a single request.
 *
 * @desc Fetch a request with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeRequest(next) {
  debug(`remove request: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    // Delete Request
    let request = yield RequestDal.delete(query);
    if(!request || !request._id) {
      throw new Error('Request does not Exist!!');
    }

    yield LogDal.track({
      event: 'request_delete',
      mfi: this.state._user._id ,
      message: `Delete Info for ${request.name}`
    });

    this.body = request;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_REQUEST_ERROR',
      message: ex.message
    }));

  }

};

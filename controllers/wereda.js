'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:wereda-controller');
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

const BranchDal           = require('../dal/branch');
const WeredaDal          = require('../dal/wereda');
const LogDal             = require('../dal/log');
const AccountDal         = require('../dal/account');

let hasPermission = checkPermissions.isPermitted('WEREDA');

/**
 * Create a wereda.
 *
 * @desc create a wereda using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createWereda(next) {
  debug('create wereda');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'WEREDA_CREATE_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('w_name')
      .notEmpty('Wereda Name is Empty!!');
  this.checkBody('w_code')
      .notEmpty('Wereda code is Empty!!');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'WEREDA_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let wereda = yield WeredaDal.get(body);
    if(wereda) {
      throw new Error('Wereda already exists!!');
    }
    // Create Wereda Type
    wereda = yield WeredaDal.create(body);

    this.body = wereda;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'WEREDA_CREATION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single wereda.
 *
 * @desc Fetch a wereda with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneWereda(next) {
  debug(`fetch wereda: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'WEREDA_VIEW_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let wereda = yield WeredaDal.get(query);
    if(!wereda._id) {
      throw new Error('Wereda does not Exist!!');
    }

    yield LogDal.track({
      event: 'view_wereda',
      wereda: this.state._user._id ,
      message: `View wereda - ${wereda.phone}`
    });

    this.body = wereda;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'WEREDA_VIEW_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single wereda.
 *
 * @desc Fetch a wereda with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateWereda(next) {
  debug(`updating wereda: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_WEREDA_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let wereda = yield WeredaDal.update(query, body);
    if(!wereda._id) {
      throw new Error('Wereda does not Exist!!');
    }

    yield LogDal.track({
      event: 'wereda_update',
      wereda: this.state._user._id ,
      message: `Update Info for ${wereda.name}`,
      diff: body
    });

    this.body = wereda;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_WEREDA_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of weredas by Pagination
 *
 * @desc Fetch a collection of weredas
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllWeredas(next) {
  debug('get a collection of weredas by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_WEREDAS_COLLECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

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

  try {


    let weredas = yield WeredaDal.getCollectionByPagination(query, opts);

    this.body = weredas;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'VIEW_WEREDAS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Search  weredas 
 *
 * @desc Fetch a collection searched weredas
 *
 * @param {Function} next Middleware dispatcher
 */
exports.search = function* searchWeredaes(next) {
  debug('search weredas');

  try {
    let query = this.request.query;

    if(!Object.keys(query).length) {
      throw new Error('Search Query is missing');
    }

    let weredas = yield WeredaDal.getCollection(query);

    this.body = weredas;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'WEREDA_SEARCH_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Delete a single wereda.
 *
 * @desc Fetch a wereda with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeWereda(next) {
  debug(`remove wereda: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    // Delete Wereda
    let wereda = yield WeredaDal.delete(query);
    if(!wereda._id) {
      throw new Error('Wereda does not Exist!!');
    }

    // Remove From Branch collection
    let branches = yield BranchDal.getCollection({});
    for(let branch of branches) {
      branch = branch.toJSON();
      let weredas = branch.weredas.filter(function (item){
        return item._id.toString() !== wereda._id.toString()
      })

      yield BranchDal.update({ _id: branch._id },{ weredas: weredas });

    }

    yield LogDal.track({
      event: 'wereda_delete',
      mfi: this.state._user._id ,
      message: `Delete Info for ${wereda.name}`
    });

    this.body = wereda;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_WEREDA_ERROR',
      message: ex.message
    }));

  }

};

'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:geoconfig-controller');
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
const GeoconfigDal       = require('../dal/geoconfig');
const LogDal             = require('../dal/log');
const AccountDal         = require('../dal/account');

let hasPermission = checkPermissions.isPermitted('USER');

/**
 * Create a geoconfig.
 *
 * @desc create a geoconfig using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createGeoconfig(next) {
  debug('create geoconfig');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'GEOCONFIG_CREATE_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  let body = this.request.body;

  this.checkBody('user')
      .notEmpty('Geoconfig User Reference is Empty!!');
  this.checkBody('name')
      .notEmpty('Geoconfig Name is Empty!!');
  this.checkBody('branch')
      .notEmpty('Geoconfig Branch is Empty!!');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'GEOCONFIG_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let geoconfig = yield GeoconfigDal.get({ user: body.user });
    if(geoconfig) {
      throw new Error('Geoconfig For User already exists!!');
    }
    // Create Geoconfig Type
    geoconfig = yield GeoconfigDal.create(body);

    this.body = geoconfig;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'GEOCONFIG_CREATION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single geoconfig.
 *
 * @desc Fetch a geoconfig with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneGeoconfig(next) {
  debug(`fetch geoconfig: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'GEOCONFIG_VIEW_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  let query = {
    _id: this.params.id
  };

  try {
    let geoconfig = yield GeoconfigDal.get(query);
    if(!geoconfig || !geoconfig._id) {
      throw new Error('Geoconfig does not Exist!!');
    }

    yield LogDal.track({
      event: 'view_geoconfig',
      geoconfig: this.state._user._id ,
      message: `View geoconfig - ${geoconfig.phone}`
    });

    this.body = geoconfig;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GEOCONFIG_VIEW_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single geoconfig.
 *
 * @desc Fetch a geoconfig with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateGeoconfig(next) {
  debug(`updating geoconfig: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_GEOCONFIG_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }*/

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let geoconfig = yield GeoconfigDal.update(query, body);
    if(!geoconfig || !geoconfig._id) {
      throw new Error('Geoconfig does not Exist!!');
    }

    yield LogDal.track({
      event: 'geoconfig_update',
      geoconfig: this.state._user._id ,
      message: `Update Info for ${geoconfig.name}`,
      diff: body
    });

    this.body = geoconfig;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_GEOCONFIG_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of geoconfigs by Pagination
 *
 * @desc Fetch a collection of geoconfigs
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllGeoconfigs(next) {
  debug('get a collection of geoconfigs by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  /*if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_GEOCONFIGS_COLLECTION_ERROR',
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


    let geoconfigs = yield GeoconfigDal.getCollectionByPagination(query, opts);

    this.body = geoconfigs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'VIEW_GEOCONFIGS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Search  geoconfigs 
 *
 * @desc Fetch a collection searched geoconfigs
 *
 * @param {Function} next Middleware dispatcher
 */
exports.search = function* searchGeoconfiges(next) {
  debug('search geoconfigs');

  try {
    let query = this.request.query;

    if(!Object.keys(query).length) {
      throw new Error('Search Query is missing');
    }

    let geoconfigs = yield GeoconfigDal.getCollection(query);

    this.body = geoconfigs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GEOCONFIG_SEARCH_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Delete a single geoconfig.
 *
 * @desc Fetch a geoconfig with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeGeoconfig(next) {
  debug(`remove geoconfig: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    // Delete Geoconfig
    let geoconfig = yield GeoconfigDal.delete(query);
    if(!geoconfig || !geoconfig._id) {
      throw new Error('Geoconfig does not Exist!!');
    }

    yield LogDal.track({
      event: 'geoconfig_delete',
      mfi: this.state._user._id ,
      message: `Delete Info for ${geoconfig.name}`
    });

    this.body = geoconfig;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_GEOCONFIG_ERROR',
      message: ex.message
    }));

  }

};

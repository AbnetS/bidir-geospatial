'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:geoconfig-router');

const geoconfigController  = require('../controllers/geoconfig');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /geospatial/configs/create Create new geoconfig
 * @apiVersion 1.0.0
 * @apiName Creategeoconfig
 * @apiGroup Geoconfig
 *
 * @apiDescription Create new geoconfig
 *
 * @apiParam {String} user Geoconfig User Reference
 * @apiParam {String} name Geoconfig name
 * @apiParam {String} branch Geoconfig User Branch
 * @apiParam {String} indicator Geoconfig indicator
 * @apiParam {String} from_date Geoconfig Start Date
 * @apiParam {String} to_date Geoconfig End Date
 *
 * @apiParamExample Request Example:
 *  {
 *    name: "Geoconfig",
 *    user : "556e1174a8952c9521286a60",
 *    branch : "556e1174a8952c9521286a60",
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name
 * @apiSuccess {String} branch Geoconfig User Branch
 * @apiSuccess {String} indicator Geoconfig indicator
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Geoconfig",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 *
 */
router.post('/create', acl(['*']), geoconfigController.create);


/**
 * @api {get} /geospatial/configs/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get geoconfigs collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Geoconfig
 *
 * @apiDescription Get a collection of geoconfigs. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name
 * @apiSuccess {String} branch Geoconfig User Branch
 * @apiSuccess {String} indicator Geoconfig indicator
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
*    _id : "556e1174a8952c9521286a60",
 *    name: "Geoconfig",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), geoconfigController.fetchAllByPagination);


/**
 * @api {get} /geospatial/configs/:id Get geoconfig geoconfig
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Geoconfig
 *
 * @apiDescription Get a user geoconfig with the given id
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name
 * @apiSuccess {String} branch Geoconfig User Branch
 * @apiSuccess {String} indicator Geoconfig indicator
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Geoconfig",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 *
 */
router.get('/:id', acl(['*']), geoconfigController.fetchOne);


/**
 * @api {put} /geospatial/configs/:id Update geoconfig geoconfig
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Geoconfig 
 *
 * @apiDescription Update a geoconfig geoconfig with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    name: "geoconfig name"
 * }
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name
 * @apiSuccess {String} branch Geoconfig User Branch
 * @apiSuccess {String} indicator Geoconfig indicator
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Geoconfig",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 */
router.put('/:id', acl(['*']), geoconfigController.update);


router.put('/:id/reset', acl(['*']), geoconfigController.reset);


/**
 * @api {get} /geospatial/configs/search?QueryTerm=<QueryValue> Search geoconfigs 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Geoconfig
 *
 * @apiDescription Search Geoconfiges. 
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name
 * @apiSuccess {String} branch Geoconfig User Branch
 * @apiSuccess {String} indicator Geoconfig indicator
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *   [{
*    _id : "556e1174a8952c9521286a60",
 *    name: "Geoconfig",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *    }]
 */
router.get('/search', acl(['*']), geoconfigController.search);

/**
 * @api {delete} /geospatial/configs/:id Delete geoconfig
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Geoconfig 
 *
 * @apiDescription Delete a  geoconfig with the given id
 *
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name
 * @apiSuccess {String} branch Geoconfig User Branch
 * @apiSuccess {String} indicator Geoconfig indicator
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Geoconfig",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 */
router.delete('/:id', acl(['*']), geoconfigController.remove);


// Expose geoconfig Router
module.exports = router;

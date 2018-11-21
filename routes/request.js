'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:request-router');

const requestController  = require('../controllers/request');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /geospatial/requests/create Create new request
 * @apiVersion 1.0.0
 * @apiName Createrequest
 * @apiGroup Request
 *
 * @apiDescription Create new request
 *
 * @apiParam {String} user Request User Reference
 * @apiParam {String} name Request name
 * @apiParam {String} branch Request User Branch
 * @apiParam {String} indicator Request indicator
 * @apiParam {String} from_date Request Start Date
 * @apiParam {String} to_date Request End Date
 *
 * @apiParamExample Request Example:
 *  {
 *    name: "Request",
 *    user : "556e1174a8952c9521286a60",
 *    branch : "556e1174a8952c9521286a60",
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} user Request User Reference
 * @apiSuccess {String} name Request name
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} from_date Request Start Date
 * @apiSuccess {String} to_date Request End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Request",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 *
 */
router.post('/create', acl(['*']), requestController.create);


/**
 * @api {get} /geospatial/requests/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get requests collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Request
 *
 * @apiDescription Get a collection of requests. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} user Request User Reference
 * @apiSuccess {String} name Request name
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} from_date Request Start Date
 * @apiSuccess {String} to_date Request End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
*    _id : "556e1174a8952c9521286a60",
 *    name: "Request",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), requestController.fetchAllByPagination);


/**
 * @api {get} /geospatial/requests/:id Get request request
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Request
 *
 * @apiDescription Get a user request with the given id
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} user Request User Reference
 * @apiSuccess {String} name Request name
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} from_date Request Start Date
 * @apiSuccess {String} to_date Request End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Request",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 *
 */
router.get('/:id', acl(['*']), requestController.fetchOne);


/**
 * @api {put} /geospatial/requests/:id Update request request
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Request 
 *
 * @apiDescription Update a request request with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    name: "request name"
 * }
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} user Request User Reference
 * @apiSuccess {String} name Request name
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} from_date Request Start Date
 * @apiSuccess {String} to_date Request End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Request",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 */
router.put('/:id', acl(['*']), requestController.update);


/**
 * @api {get} /geospatial/requests/search?QueryTerm=<QueryValue> Search requests 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Request
 *
 * @apiDescription Search Requestes. 
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} user Request User Reference
 * @apiSuccess {String} name Request name
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} from_date Request Start Date
 * @apiSuccess {String} to_date Request End Date
 *
 * @apiSuccessExample Response Example:
 *   [{
*    _id : "556e1174a8952c9521286a60",
 *    name: "Request",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *    }]
 */
router.get('/search', acl(['*']), requestController.search);

/**
 * @api {delete} /geospatial/requests/:id Delete request
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Request 
 *
 * @apiDescription Delete a  request with the given id
 *
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} user Request User Reference
 * @apiSuccess {String} name Request name
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} from_date Request Start Date
 * @apiSuccess {String} to_date Request End Date
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Request",
 *    user : { _id: "556e1174a8952c9521286a60", ... },
 *    branch : { _id: "556e1174a8952c9521286a60", ... },
 *    indicator: "indicator",
 *    from_date: '2018-11-15T09:51:19.281Z',
 *    to_date: '2018-11-30T09:51:19.281Z'
 *  }
 */
router.delete('/:id', acl(['*']), requestController.remove);


// Expose request Router
module.exports = router;

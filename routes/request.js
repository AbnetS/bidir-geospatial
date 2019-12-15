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
 * @apiDescription Create new request. Records a new request object to store 
 *                 a request made to geo spatial API
 *
 * @apiParam {String} branch Request User Branch
 * @apiParam {String} config Config Id
 * @apiParam {String} indicator Request indicator/VI or PRECIP/
 * @apiParam {String} UID Unique identifier of the request, sent from the Geospatial API
 
 *
 * @apiParamExample Request Example:
 *  {
        "config": "5c5b3bce39e95000017c54b7",
        "branch" : "5b926c849fb7f20001f1494c",
        "indicator": "VI",
        "UID":"00000031"
 *  }
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} config User's config
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} UID Unique Identifier 
 *
 * @apiSuccessExample Response Example:
 *  { 
        "_id": "5c64097039e95000017c54cc",
        "last_modified": "2019-02-13T12:11:28.391Z",
        "date_created": "2019-02-13T12:11:28.391Z",
        "config": {
            "_id": "5c5b3bce39e95000017c54b7",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "UID": "00000031",
        "indicator": "VI" *  
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
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} config User's config
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} UID Unique Identifier 
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 2,
        "total_docs_count": 12,
        "current_page": 1,
        "docs": [
            {
                "_id": "5c64097039e95000017c54cc",
                ...
            },
            {
                ...
            }...
        ]
 *  }
 */
router.get('/paginate', acl(['*']), requestController.fetchAllByPagination);


/**
 * @api {get} /geospatial/requests/:id Get request
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Request
 *
 * @apiDescription Get a user request with the given id
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} config User's config
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} UID Unique Identifier 
 *

 * @apiSuccessExample Response Example:
 *  { 
        "_id": "5c64097039e95000017c54cc",
        "last_modified": "2019-02-13T12:11:28.391Z",
        "date_created": "2019-02-13T12:11:28.391Z",
        "config": {
            "_id": "5c5b3bce39e95000017c54b7",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "UID": "00000031",
        "indicator": "VI" *  
 *  }
 */
router.get('/:id', acl(['*']), requestController.fetchOne);


/**
 * @api {put} /geospatial/requests/:id Update request
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Request 
 *
 * @apiDescription Update a request with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    UID: "00000032"
 * }
 *
 * @apiSuccess {String} _id request id
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} config User's config
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} UID Unique Identifier 
 *

 * @apiSuccessExample Response Example:
 *  { 
        "_id": "5c64097039e95000017c54cc",
        "last_modified": "2019-02-13T12:11:28.391Z",
        "date_created": "2019-02-13T12:11:28.391Z",
        "config": {
            "_id": "5c5b3bce39e95000017c54b7",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "UID": "00000032",
        "indicator": "VI" *  
 *  }
 */
router.put('/:id', acl(['*']), requestController.update);


/**
 * @api {get} /geospatial/requests/search?QueryTerm=<QueryValue> Search requests 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Request
 *
 * @apiDescription Search Requests. 
 * 
 * @apiExample Request Example
 * api.test.bidir.gebeya.co.geospatial/requests/search?config=5c5b3bce39e95000017c54b7&branch=5b926c849fb7f20001f1494c
 *
* @apiSuccess {String} _id request id
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} config User's config
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} UID Unique Identifier 
 *
 * @apiSuccessExample Response Example: 
 * 
 * [
        {
            "_id": "5c5b3e5739e95000017c54bb",
            ...
        },
        {
            "_id": "5c5b3e5c39e95000017c54bd",
            ...
        }...
    ]
 * 
 *   
 * 
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
 * @apiSuccess {String} branch Request User Branch
 * @apiSuccess {String} config User's config
 * @apiSuccess {String} indicator Request indicator
 * @apiSuccess {String} UID Unique Identifier 
 *

 * @apiSuccessExample Response Example:
 *  { 
        "_id": "5c64097039e95000017c54cc",
        "last_modified": "2019-02-13T12:11:28.391Z",
        "date_created": "2019-02-13T12:11:28.391Z",
        "config": {
            "_id": "5c5b3bce39e95000017c54b7",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "UID": "00000032",
        "indicator": "VI" *  
 *  }
 */
router.delete('/:id', acl(['*']), requestController.remove);


// Expose request Router
module.exports = router;

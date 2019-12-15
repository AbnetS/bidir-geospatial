'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:wereda-router');

const weredaController  = require('../controllers/wereda');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /geospatial/weredas/create Create new wereda
 * @apiVersion 1.0.0
 * @apiName CreateWereda
 * @apiGroup Wereda
 *
 * @apiDescription Create a new Wereda. A Wereda is a distinct region.
 *
 * @apiParam {String} w_name Wereda Name
 * @apiParam {String} w_code Wereda Code
 *
 * @apiParamExample Request Example:
 *  {
 *    w_name: "Haro Maya",
 *    w_code: "41006",
 *  }
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *  { 
        "_id": "5c5b3df639e95000017c54b8",
        "last_modified": "2019-02-06T20:05:10.035Z",
        "date_created": "2019-02-06T20:05:10.035Z",
        "w_code": "41006",
        "w_name": "Haro Maya"
        
 *  }
 *
 */
router.post('/create', acl(['*']), weredaController.create);


/**
 * @api {get} /geospatial/weredas/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get weredas collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Wereda
 *
 * @apiDescription Get a collection of weredas. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 1,
        "total_docs_count": 1,
        "current_page": 1,
        "docs": [
            {
                "_id": "5c5b3df639e95000017c54b8",
                ...
            }...
        ]
 *  }
 */
router.get('/paginate', acl(['*']), weredaController.fetchAllByPagination);


/**
 * @api {get} /geospatial/weredas/:id Get Wereda
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Wereda
 *
 * @apiDescription Get a Wereda with the given id
 *
  * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *  { 
        "_id": "5c5b3df639e95000017c54b8",
        "last_modified": "2019-02-06T20:05:10.035Z",
        "date_created": "2019-02-06T20:05:10.035Z",
        "w_code": "41006",
        "w_name": "Haro Maya"
        
 *  }
 *
 */
router.get('/:id', acl(['*']), weredaController.fetchOne);


/**
 * @api {put} /geospatial/weredas/:id Update wereda
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Wereda 
 *
 * @apiDescription Update a wereda with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    w_code: "41007"
 * }
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
* @apiSuccessExample Response Example:
 *  { 
        "_id": "5c5b3df639e95000017c54b8",
        "last_modified": "2019-02-06T20:05:10.035Z",
        "date_created": "2019-02-06T20:05:10.035Z",
        "w_code": "41007",
        "w_name": "Haro Maya"
        
 *  }
 */
router.put('/:id', acl(['*']), weredaController.update);


/**
 * @api {get} /geospatial/weredas/search?QueryTerm=<QueryValue> Search weredas 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Wereda
 *
 * @apiDescription Search Weredas by Wereda code and/or name. 
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
    [
        {
            "_id": "5c5b3df639e95000017c54b8",
            "last_modified": "2019-02-06T20:05:10.035Z",
            "date_created": "2019-02-06T20:05:10.035Z",
            "w_code": "41006",
            "w_name": "Haro Maya"
        }
    ]
 */
router.get('/search', acl(['*']), weredaController.search);

/**
 * @api {delete} /geospatial/weredas/:id Delete wereda
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Wereda 
 *
 * @apiDescription Delete a  wereda with the given id
 *
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
    {
            "_id": "5c5b3df639e95000017c54b8",
            "last_modified": "2019-02-06T20:05:10.035Z",
            "date_created": "2019-02-06T20:05:10.035Z",
            "w_code": "41006",
            "w_name": "Haro Maya"
    }
 */
router.delete('/:id', acl(['*']), weredaController.remove);


// Expose wereda Router
module.exports = router;

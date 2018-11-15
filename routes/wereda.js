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
 * @apiName Createwereda
 * @apiGroup Wereda
 *
 * @apiDescription Create new wereda
 *
 * @apiParam {String} w_name Wereda Name
 * @apiParam {String} w_code Wereda Code
 *
 * @apiParamExample Request Example:
 *  {
 *    w_name: "Wereda",
 *    w_code: "Werc",
 *  }
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    w_name: "Wereda",
 *    w_code: "Werc",
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
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
  *    _id : "556e1174a8952c9521286a60",
 *    w_name: "Wereda",
 *    w_code: "Werc",
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), weredaController.fetchAllByPagination);


/**
 * @api {get} /geospatial/weredas/:id Get wereda wereda
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Wereda
 *
 * @apiDescription Get a user wereda with the given id
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    w_name: "Wereda",
 *    w_code: "Werc",
 *  }
 *
 */
router.get('/:id', acl(['*']), weredaController.fetchOne);


/**
 * @api {put} /geospatial/weredas/:id Update wereda wereda
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Wereda 
 *
 * @apiDescription Update a wereda wereda with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    w_code: "wereda code"
 * }
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    w_name: "Wereda",
 *    w_code: "Wereda code",
 *  }
 */
router.put('/:id', acl(['*']), weredaController.update);


/**
 * @api {get} /geospatial/weredas/search?QueryTerm=<QueryValue> Search weredas 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Wereda
 *
 * @apiDescription Search Weredaes. 
 *
 * @apiSuccess {String} _id wereda id
 * @apiSuccess {String} w_name Wereda Name
 * @apiSuccess {String} w_code Wereda Code
 *
 * @apiSuccessExample Response Example:
 *   [{
 *    _id : "556e1174a8952c9521286a60",
 *    w_name: "Wereda",
 *    w_code: "Werc",
 *    }]
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
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    w_name: "Wereda",
 *    w_code: "Werc",
 *  }
 */
router.delete('/:id', acl(['*']), weredaController.remove);


// Expose wereda Router
module.exports = router;

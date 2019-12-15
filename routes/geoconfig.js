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
 * @apiName CreateGeoconfig
 * @apiGroup Geo Config
 *
 * @apiDescription Create new geoconfig
 *
 * @apiParam {String} user Geoconfig User Reference
 * @apiParam {String} name Geoconfig name 
 * @apiParam {String} from_date Geoconfig Start Date
 * @apiParam {String} to_date Geoconfig End Date
 *
 * @apiParamExample Request Example:
 *  {
        "name" : "Seasonal Monitoring for Belg",
        "from_date": "2018-07-01",
        "to_date":"2018-12-10"
 *  }
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 * 
 *
 * @apiSuccessExample Response Example:
 *  {
  
        "_id": "5c5b3bce39e95000017c54b7",
        "last_modified": "2019-02-13T12:11:17.863Z",
        "date_created": "2019-02-06T19:55:58.422Z",
        "user": {
            "_id": "5b925494b1cfc10001d80908",
            ...
        },
        "to_date": "2018-07-01T21:00:00.000Z",
        "from_date": "2018-07-01T21:00:00.000Z",
        "name": "Seasonal Monitoring for Belg"    
 *  }
 *
 */
router.post('/create', acl(['*']), geoconfigController.create);


/**
 * @api {get} /geospatial/configs/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get geoconfigs collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Geo Config
 *
 * @apiDescription Get a collection of geoconfigs. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 1,
        "total_docs_count": 1,
        "current_page": 1,
        "docs": [
            {
                "_id": "5c5b3bce39e95000017c54b7",
                ...
            }...
        ]
 *  }
 */
router.get('/paginate', acl(['*']), geoconfigController.fetchAllByPagination);


/**
 * @api {get} /geospatial/configs/:id Get Geoconfig
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Geo Config
 *
 * @apiDescription Get a user geoconfig with the given id
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 *
 * @apiSuccessExample Response Example:
 *  {
  
        "_id": "5c5b3bce39e95000017c54b7",
        "last_modified": "2019-02-13T12:11:17.863Z",
        "date_created": "2019-02-06T19:55:58.422Z",
        "user": {
            "_id": "5b925494b1cfc10001d80908",
            ...
        },
        "to_date": "2018-07-01T21:00:00.000Z",
        "from_date": "2018-07-01T21:00:00.000Z",
        "name": "Seasonal Monitoring for Belg"    
 *  }
 *
 */
router.get('/:id', acl(['*']), geoconfigController.fetchOne);


/**
 * @api {put} /geospatial/configs/:id Update Geoconfig
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Geo Config 
 *
 * @apiDescription Update a geoconfig with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    name: "Seasonal Monitoring for Summer season"
 * }
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 *
 *
 * @apiSuccessExample Response Example:
 *  {
  
        "_id": "5c5b3bce39e95000017c54b7",
        "last_modified": "2019-02-13T12:11:17.863Z",
        "date_created": "2019-02-06T19:55:58.422Z",
        "user": {
            "_id": "5b925494b1cfc10001d80908",
            ...
        },
        "to_date": "2018-07-01T21:00:00.000Z",
        "from_date": "2018-07-01T21:00:00.000Z",
        "name": "Seasonal Monitoring for Summer season"    
 *  }
 */
router.put('/:id', acl(['*']), geoconfigController.update);

/**
 * @api {post} /geospatial/configs/create Create new geoconfig
 * @apiVersion 1.0.0
 * @apiName CreateGeoconfig
 * @apiGroup Geo Config
 *
 * @apiDescription Create new geoconfig
 *
 * @apiParam {String} user Geoconfig User Reference
 * @apiParam {String} name Geoconfig name 
 * @apiParam {String} from_date Geoconfig Start Date
 * @apiParam {String} to_date Geoconfig End Date
 *
 * @apiParamExample Request Example:
 *  {
        "name" : "Configuration for Season monitoring",
        "from_date": "2018-05-03",
        "to_date":"2018-12-10"
 *  }
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 * 
 *
 * @apiSuccessExample Response Example:
 *  {
  
        "_id": "5c5b3bce39e95000017c54b7",
        "last_modified": "2019-02-13T12:11:17.863Z",
        "date_created": "2019-02-06T19:55:58.422Z",
        "user": {
            "_id": "5b925494b1cfc10001d80908",
            ...
        },
        "to_date": "2018-05-03T21:00:00.000Z",
        "from_date": "2018-12-10:00:00.000Z",
        "name": "Configuration for Season monitoring"    
 *  }
 *
 * **/
router.put('/:id/reset', acl(['*']), geoconfigController.reset);


/**
 * @api {get} /geospatial/configs/search?QueryTerm=<QueryValue> Search geoconfigs 
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Geo Config
 *
 * @apiDescription Search Geoconfig by user
 * 
 * @apiExample Request Example
 * api.test.bidir.gebeya.co/geospatial/configs/search?user=5b925494b1cfc10001d80908
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 * 
 *
 * @apiSuccessExample Response Example:
 *  {
  
        "_id": "5c5b3bce39e95000017c54b7",
        "last_modified": "2019-02-13T12:11:17.863Z",
        "date_created": "2019-02-06T19:55:58.422Z",
        "user": {
            "_id": "5b925494b1cfc10001d80908",
            ...
        },
        "to_date": "2018-05-03T21:00:00.000Z",
        "from_date": "2018-12-10:00:00.000Z",
        "name": "Configuration for Season monitoring"    
 *  }
 */
router.get('/search', acl(['*']), geoconfigController.search);

/**
 * @api {delete} /geospatial/configs/:id Delete geoconfig
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Geo Config 
 *
 * @apiDescription Delete a  geoconfig with the given id
 *
 *
 * @apiSuccess {String} _id geoconfig id
 * @apiSuccess {String} user Geoconfig User Reference
 * @apiSuccess {String} name Geoconfig name 
 * @apiSuccess {String} from_date Geoconfig Start Date
 * @apiSuccess {String} to_date Geoconfig End Date
 * 
 *
 * @apiSuccessExample Response Example:
 *  {
  
        "_id": "5c5b3bce39e95000017c54b7",
        "last_modified": "2019-02-13T12:11:17.863Z",
        "date_created": "2019-02-06T19:55:58.422Z",
        "user": {
            "_id": "5b925494b1cfc10001d80908",
            ...
        },
        "to_date": "2018-05-03T21:00:00.000Z",
        "from_date": "2018-12-10:00:00.000Z",
        "name": "Configuration for Season monitoring"    
 *  }
 */
router.delete('/:id', acl(['*']), geoconfigController.remove);


// Expose geoconfig Router
module.exports = router;

// routes/businesses.js
// all the API endpoints for businesses
// GET /api/businesses - get all with filters and pagination
// GET /api/businesses/:id - get one by id
// GET /api/businesses/stats - get dashboard stats
// POST /api/businesses/import - bulk import from csv data

const express = require('express')
const router = express.Router()
const Business = require('../models/Business')

// ── GET /api/businesses/stats ────────────────────────────────
// has to be BEFORE /:id route otherwise express thinks "stats" is an id
// spent like 1 hour debugging this lol
router.get('/stats', async function(req, res) {
  try {
    var total = await Business.countDocuments()

    // aggregate to get average rating
    // learned aggregation from mongodb docs - confusing at first
    var ratingResult = await Business.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ])
    var avgRating = ratingResult.length > 0 ? ratingResult[0].avgRating.toFixed(2) : 0

    var missingPhone = await Business.countDocuments({ hasPhone: false })
    var missingWebsite = await Business.countDocuments({ hasWebsite: false })
    var missingBoth = await Business.countDocuments({ hasPhone: false, hasWebsite: false })

    // get unique categories count
    var categories = await Business.distinct('category')
    var totalCategories = categories.length

    // category counts for chart
    var categoryData = await Business.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    // city counts for chart
    var cityData = await Business.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    // rating distribution
    var ratingDist = await Business.aggregate([
      {
        $bucket: {
          groupBy: '$rating',
          boundaries: [0, 1, 2, 3, 3.5, 4, 4.5, 5.1],
          default: 'No Rating',
          output: { count: { $sum: 1 } }
        }
      }
    ])

    res.json({
      total,
      avgRating,
      totalCategories,
      missingPhone,
      missingWebsite,
      missingBoth,
      categoryData,
      cityData,
      ratingDist
    })

  } catch(err) {
    console.log('stats error:', err)
    res.status(500).json({ error: 'something went wrong' })
    // not sending err.message to client - good practice actually
  }
})


// ── GET /api/businesses ──────────────────────────────────────
// supports: search, category, rating, city, page, limit
router.get('/', async function(req, res) {
  try {

    // get query params - using destructuring here (learned this recently)
    var { search, category, rating, city, page, limit } = req.query

    // build the filter object for mongodb query
    var filter = {}

    if(search) {
      // regex for case-insensitive search
      // $options: 'i' means case insensitive
      filter.name = { $regex: search, $options: 'i' }
    }

    if(category && category != 'all') {
      filter.category = category
    }

    if(rating && rating != 'all') {
      // gte means "greater than or equal"
      filter.rating = { $gte: parseFloat(rating) }
    }

    if(city && city != 'all') {
      filter.city = city
    }

    // pagination
    var pageNum = parseInt(page) || 1
    var pageSize = parseInt(limit) || 20
    var skip = (pageNum - 1) * pageSize
    // e.g. page 2 with limit 20: skip = 20, so start from record 21

    // run query
    var businesses = await Business.find(filter)
      .skip(skip)
      .limit(pageSize)
      .lean()   // .lean() returns plain JS objects instead of mongoose documents - faster

    // total count for pagination (without skip/limit)
    var totalCount = await Business.countDocuments(filter)
    var totalPages = Math.ceil(totalCount / pageSize)

    res.json({
      data: businesses,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalCount: totalCount,
        pageSize: pageSize
      }
    })

  } catch(err) {
    console.log('get all error:', err)
    res.status(500).json({ error: 'failed to fetch businesses' })
  }
})


// ── GET /api/businesses/categories ──────────────────────────
// returns list of all unique categories for dropdown
router.get('/categories', async function(req, res) {
  try {
    var categories = await Business.distinct('category')
    categories.sort()
    res.json(categories)
  } catch(err) {
    res.status(500).json({ error: 'failed to get categories' })
  }
})


// ── GET /api/businesses/cities ───────────────────────────────
// returns list of all unique cities for dropdown
router.get('/cities', async function(req, res) {
  try {
    var cities = await Business.distinct('city')
    // filter out Unknown
    cities = cities.filter(function(c) { return c != 'Unknown' })
    cities.sort()
    res.json(cities)
  } catch(err) {
    res.status(500).json({ error: 'failed to get cities' })
  }
})


// ── GET /api/businesses/:id ──────────────────────────────────
// get single business by mongodb id
router.get('/:id', async function(req, res) {
  try {
    var business = await Business.findById(req.params.id)

    if(business == null) {
      return res.status(404).json({ error: 'business not found' })
    }

    res.json(business)

  } catch(err) {
    // if id format is wrong mongoose throws CastError
    if(err.name == 'CastError') {
      return res.status(400).json({ error: 'invalid id format' })
    }
    res.status(500).json({ error: 'something went wrong' })
  }
})


// ── POST /api/businesses/import ─────────────────────────────
// bulk import cleaned data from frontend
// expects array of business objects in req.body
router.post('/import', async function(req, res) {
  try {
    var records = req.body

    if(!records || records.length == 0) {
      return res.status(400).json({ error: 'no data provided' })
    }

    // delete existing data first
    // WARNING: this wipes the whole collection every import
    // not ideal but simpler than doing upserts
    await Business.deleteMany({})

    // insert all records
    // insertMany is faster than inserting one by one
    var result = await Business.insertMany(records, { ordered: false })
    // ordered: false means it continues even if some fail

    res.json({
      message: 'import successful',
      inserted: result.length
    })

  } catch(err) {
    console.log('import error:', err)
    res.status(500).json({ error: 'import failed: ' + err.message })
  }
})

module.exports = router

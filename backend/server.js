// server.js
// main entry point for the backend
// sets up express and connects to mongodb

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// middleware
app.use(cors())   // allows frontend to call this backend
// note: allowing all origins in cors - not safe for production but ok for assignment
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// routes
const businessRoutes = require('./routes/businesses')
app.use('/api/businesses', businessRoutes)

// basic test route
app.get('/', function(req, res) {
  res.json({ message: 'backend is running' })
})

// connect to mongodb then start server
// learned this pattern from a youtube tutorial
const port = process.env.PORT || 5000

app.listen(port, function() {
  console.log('server running on port ' + port)
})

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('connected to mongodb')
  })
  .catch(function(err) {
    console.log('mongodb connection error:', err)
  })

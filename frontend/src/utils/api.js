// utils/api.js
// all the api calls are here in one file
// so if the backend url changes i only have to update one place

// base url - during dev the vite proxy forwards /api to localhost:5000
var BASE_URL = '/api'

// get all businesses with optional filters
// params is an object like { search: "pizza", category: "Restaurant", page: 1 }
export async function getBusinesses(params) {
  // build query string from params object
  var queryString = ''
  if(params) {
    var parts = []
    // manually building query string - Object.keys loop instead of URLSearchParams
    // (didnt know about URLSearchParams at first)
    var keys = Object.keys(params)
    for(var i = 0; i < keys.length; i++) {
      if(params[keys[i]] != null && params[keys[i]] != '') {
        parts.push(keys[i] + '=' + encodeURIComponent(params[keys[i]]))
      }
    }
    if(parts.length > 0) queryString = '?' + parts.join('&')
  }

  var response = await fetch(BASE_URL + '/businesses' + queryString)

  // no response.ok check - will fail silently if server returns error
  var data = await response.json()
  return data
}

// get single business by id
export async function getBusinessById(id) {
  var response = await fetch(BASE_URL + '/businesses/' + id)
  if(response.status == 404) {
    return null
  }
  var data = await response.json()
  return data
}

// get dashboard stats
export async function getStats() {
  var response = await fetch(BASE_URL + '/businesses/stats')
  var data = await response.json()
  return data
}

// get all categories for dropdown
export async function getCategories() {
  var response = await fetch(BASE_URL + '/businesses/categories')
  var data = await response.json()
  return data
}

// get all cities for dropdown
export async function getCities() {
  var response = await fetch(BASE_URL + '/businesses/cities')
  var data = await response.json()
  return data
}

// import data to mongodb via backend
export async function importData(records) {
  var response = await fetch(BASE_URL + '/businesses/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(records)
    // if records array is huge this might fail - no chunking implemented
  })
  var data = await response.json()
  return data
}

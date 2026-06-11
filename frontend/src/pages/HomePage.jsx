// pages/HomePage.jsx
// main page - shows list of businesses with search and filters
// all data comes from the backend API

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBusinesses, getCategories, getCities } from '../utils/api'
import { Search } from 'lucide-react'

function HomePage() {

  // state for the business data
  var [businesses, setBusinesses] = useState([])
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)

  // filter states - separate variables again (same habit as assignment 2)
  var [search, setSearch] = useState('')
  var [category, setCategory] = useState('all')
  var [rating, setRating] = useState('all')
  var [city, setCity] = useState('all')
  var [page, setPage] = useState(1)

  // pagination info from api response
  var [totalPages, setTotalPages] = useState(1)
  var [totalCount, setTotalCount] = useState(0)

  // dropdown options
  var [categories, setCategories] = useState([])
  var [cities, setCities] = useState([])

  // load categories and cities once on mount
  // useEffect with empty [] runs only once when component mounts
  useEffect(function() {
    getCategories().then(function(data) {
      setCategories(data)
    }).catch(function(err) {
      console.log('failed to load categories', err)
      // silently fails - dropdown just stays empty
    })

    getCities().then(function(data) {
      setCities(data)
    }).catch(function(err) {
      console.log('failed to load cities', err)
    })
  }, [])

  // load businesses whenever filters or page changes
  useEffect(function() {
    setLoading(true)

    var params = { page: page, limit: 20 }
    if(search) params.search = search
    if(category != 'all') params.category = category
    if(rating != 'all') params.rating = rating
    if(city != 'all') params.city = city

    getBusinesses(params).then(function(result) {
      setBusinesses(result.data || [])
      setTotalPages(result.pagination?.totalPages || 1)
      setTotalCount(result.pagination?.totalCount || 0)
      setLoading(false)
    }).catch(function(err) {
      setError('failed to load businesses. is the backend running?')
      setLoading(false)
    })

  }, [search, category, rating, city, page])
  // dependencies array - effect reruns whenever any of these change

  // reset to page 1 when filters change
  // bug: this causes two renders when filter changes
  function handleFilterChange(type, value) {
    setPage(1)
    if(type == 'search') setSearch(value)
    if(type == 'category') setCategory(value)
    if(type == 'rating') setRating(value)
    if(type == 'city') setCity(value)
  }

  var dropStyle = {
    padding:"8px 10px", fontSize:"13px", color:"#cbd5e1",
    background:"#161920", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"10px", cursor:"pointer", outline:"none"
  }

  return (
    <div style={{maxWidth:"1280px", margin:"0 auto", padding:"32px 24px"}}>

      {/* page header */}
      <div style={{marginBottom:"24px"}}>
        <h1 style={{fontFamily:"var(--font-display)", fontSize:"28px", color:"#e2e8f0", margin:"0 0 4px 0"}}>
          Business Listings
        </h1>
        <p style={{color:"#475569", fontSize:"13px", margin:0}}>
          {totalCount} businesses found
        </p>
      </div>

      {/* filters */}
      <div style={{
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:"14px", padding:"16px", marginBottom:"24px",
        display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center"
      }}>
        {/* search */}
        <input
          type="text"
          placeholder="search by name..."
          value={search}
          onChange={function(e) { handleFilterChange('search', e.target.value) }}
          style={{
            flex:1, minWidth:"180px", padding:"8px 12px", fontSize:"13px",
            color:"#e2e8f0", background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", outline:"none"
          }}
        />
        <select value={category} onChange={function(e){ handleFilterChange('category', e.target.value) }} style={dropStyle}>
          <option value="all">All Categories</option>
          {categories.map(function(c,i){ return <option key={i} value={c}>{c}</option> })}
        </select>
        <select value={rating} onChange={function(e){ handleFilterChange('rating', e.target.value) }} style={dropStyle}>
          <option value="all">All Ratings</option>
          <option value="4.5">4.5+ ★</option>
          <option value="4">4.0+ ★</option>
          <option value="3.5">3.5+ ★</option>
          <option value="3">3.0+ ★</option>
        </select>
        <select value={city} onChange={function(e){ handleFilterChange('city', e.target.value) }} style={dropStyle}>
          <option value="all">All Cities</option>
          {cities.map(function(c,i){ return <option key={i} value={c}>{c}</option> })}
        </select>
        {/* no clear button - forgot to add */}
      </div>

      {/* error state */}
      {error && (
        <div style={{background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", borderRadius:"12px", padding:"16px", marginBottom:"24px", color:"#fca5a5", fontSize:"14px"}}>
          ⚠️ {error}
        </div>
      )}

      {/* loading state */}
      {loading && (
        <div style={{textAlign:"center", padding:"60px 0", color:"#475569"}}>
          loading...
        </div>
      )}

      {/* business cards grid */}
      {!loading && !error && (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"16px", marginBottom:"32px"}}>
          {businesses.map(function(biz) {
            return (
              <div key={biz._id}
                style={{
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:"14px", padding:"18px"
                }}
              >
                {/* category badge */}
                <span style={{
                  fontSize:"10px", padding:"2px 8px", borderRadius:"20px",
                  background:"rgba(167,139,250,0.1)", color:"#c4b5fd",
                  border:"1px solid rgba(167,139,250,0.2)"
                }}>
                  {biz.category}
                </span>

                {/* business name */}
                <h3 style={{color:"#e2e8f0", fontSize:"15px", fontWeight:"600", margin:"10px 0 6px 0",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                  {biz.name}
                </h3>

                {/* city */}
                <p style={{color:"#64748b", fontSize:"12px", margin:"0 0 10px 0"}}>
                  📍 {biz.city}
                </p>

                {/* rating */}
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span style={{
                    fontWeight:"700", fontSize:"14px",
                    color: biz.rating >= 4 ? "#34d399" : biz.rating >= 3 ? "#fbbf24" : "#f87171"
                  }}>
                    {biz.rating > 0 ? biz.rating + " ★" : "No rating"}
                  </span>

                  {/* view details link */}
                  <Link to={"/business/" + biz._id}
                    style={{fontSize:"12px", color:"#38bdf8", textDecoration:"none"}}>
                    View Details →
                  </Link>
                </div>

                {/* contact icons */}
                <div style={{display:"flex", gap:"8px", marginTop:"10px", paddingTop:"10px", borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{fontSize:"11px", color: biz.hasPhone ? "#34d399" : "#475569"}}>
                    {biz.hasPhone ? "✅ Phone" : "❌ No Phone"}
                  </span>
                  <span style={{fontSize:"11px", color: biz.hasWebsite ? "#34d399" : "#475569"}}>
                    {biz.hasWebsite ? "✅ Website" : "❌ No Website"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* no results */}
      {!loading && !error && businesses.length == 0 && (
        <div style={{textAlign:"center", padding:"60px 0", color:"#475569"}}>
          no businesses found
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div style={{display:"flex", justifyContent:"center", gap:"6px", flexWrap:"wrap"}}>
          <button onClick={function(){ setPage(function(p){ return Math.max(1, p-1) }) }}
            disabled={page == 1}
            style={{padding:"6px 14px", fontSize:"12px", borderRadius:"8px", cursor:"pointer",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
              color: page == 1 ? "#334155" : "#94a3b8"}}>
            ← Prev
          </button>

          {/* all page numbers again - same bug as before */}
          {Array.from({length: totalPages}, function(_, i){ return i+1 }).map(function(p) {
            return (
              <button key={p} onClick={function(){ setPage(p) }}
                style={{padding:"6px 10px", fontSize:"12px", borderRadius:"8px", cursor:"pointer", minWidth:"34px",
                  background: p == page ? "rgba(56,189,248,0.12)" : "transparent",
                  border: p == page ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  color: p == page ? "#38bdf8" : "#475569"}}>
                {p}
              </button>
            )
          })}

          <button onClick={function(){ setPage(function(p){ return Math.min(totalPages, p+1) }) }}
            disabled={page == totalPages}
            style={{padding:"6px 14px", fontSize:"12px", borderRadius:"8px", cursor:"pointer",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
              color: page == totalPages ? "#334155" : "#94a3b8"}}>
            Next →
          </button>
        </div>
      )}

    </div>
  )
}

export default HomePage

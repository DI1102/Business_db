// pages/BusinessDetailPage.jsx
// shows details of one business
// gets the id from the URL using useParams hook

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBusinessById } from '../utils/api'

function BusinessDetailPage() {

  var { id } = useParams()   // gets :id from the URL

  var [business, setBusiness] = useState(null)
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)

  useEffect(function() {
    getBusinessById(id).then(function(data) {
      if(data == null) {
        setError('business not found')
      } else {
        setBusiness(data)
      }
      setLoading(false)
    }).catch(function(err) {
      setError('failed to load business')
      setLoading(false)
    })
  }, [id])

  if(loading) {
    return (
      <div style={{textAlign:"center", padding:"80px", color:"#475569"}}>loading...</div>
    )
  }

  if(error) {
    return (
      <div style={{maxWidth:"600px", margin:"60px auto", padding:"24px", textAlign:"center"}}>
        <p style={{color:"#f87171", marginBottom:"16px"}}>{error}</p>
        <Link to="/" style={{color:"#38bdf8", fontSize:"14px"}}>← back to listings</Link>
      </div>
    )
  }

  return (
    <div style={{maxWidth:"700px", margin:"0 auto", padding:"40px 24px"}}>

      {/* back link */}
      <Link to="/" style={{color:"#38bdf8", fontSize:"13px", textDecoration:"none", display:"block", marginBottom:"24px"}}>
        ← Back to listings
      </Link>

      {/* main card */}
      <div style={{
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:"16px", padding:"28px"
      }}>

        {/* category + rating row */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
          <span style={{
            fontSize:"11px", padding:"3px 10px", borderRadius:"20px",
            background:"rgba(167,139,250,0.1)", color:"#c4b5fd",
            border:"1px solid rgba(167,139,250,0.2)"
          }}>
            {business.category}
          </span>
          <span style={{
            fontWeight:"700", fontSize:"20px",
            color: business.rating >= 4 ? "#34d399" : business.rating >= 3 ? "#fbbf24" : "#f87171"
          }}>
            {business.rating > 0 ? business.rating + " ★" : "No rating"}
          </span>
        </div>

        {/* name */}
        <h1 style={{fontFamily:"var(--font-display)", fontSize:"26px", color:"#f1f5f9", margin:"0 0 8px 0"}}>
          {business.name}
        </h1>

        {/* city */}
        <p style={{color:"#64748b", fontSize:"13px", margin:"0 0 24px 0"}}>
          📍 {business.city}
        </p>

        {/* divider */}
        <div style={{height:"1px", background:"rgba(255,255,255,0.06)", marginBottom:"24px"}}></div>

        {/* details grid */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>

          {/* address */}
          <div>
            <p style={{color:"#475569", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px"}}>Address</p>
            <p style={{color:"#94a3b8", fontSize:"13px", lineHeight:"1.5"}}>
              {business.address || "Not available"}
            </p>
          </div>

          {/* phone */}
          <div>
            <p style={{color:"#475569", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px"}}>Phone</p>
            <p style={{color: business.hasPhone ? "#94a3b8" : "#334155", fontSize:"13px"}}>
              {business.hasPhone ? business.phone : "Not listed"}
            </p>
          </div>

          {/* website */}
          <div>
            <p style={{color:"#475569", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px"}}>Website</p>
            {business.hasWebsite ? (
              <a href={business.website} target="_blank"
                style={{color:"#38bdf8", fontSize:"13px", wordBreak:"break-all"}}>
                {business.website}
                {/* no https check - same bug */}
              </a>
            ) : (
              <p style={{color:"#334155", fontSize:"13px"}}>Not listed</p>
            )}
          </div>

          {/* reviews */}
          <div>
            <p style={{color:"#475569", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px"}}>Reviews</p>
            <p style={{color:"#94a3b8", fontSize:"13px"}}>
              {business.reviews > 0 ? business.reviews + " reviews" : "No reviews"}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BusinessDetailPage

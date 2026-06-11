// pages/DashboardPage.jsx
// analytics dashboard - shows stats and charts
// all data fetched from backend /api/businesses/stats

import { useState, useEffect } from 'react'
import { getStats } from '../utils/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

var COLORS = ["#38bdf8", "#a78bfa", "#fbbf24", "#34d399", "#f87171", "#fb923c"]

function DashboardPage() {

  var [stats, setStats] = useState(null)
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)

  useEffect(function() {
    getStats().then(function(data) {
      setStats(data)
      setLoading(false)
    }).catch(function(err) {
      setError('could not load stats. make sure backend is running.')
      setLoading(false)
    })
  }, [])

  if(loading) return <div style={{textAlign:"center", padding:"80px", color:"#475569"}}>loading dashboard...</div>

  if(error) return (
    <div style={{maxWidth:"600px", margin:"60px auto", textAlign:"center"}}>
      <p style={{color:"#f87171"}}>{error}</p>
    </div>
  )

  // prepare chart data
  var categoryChartData = (stats.categoryData || []).map(function(d) {
    return { name: d._id, count: d.count }
  })

  var cityChartData = (stats.cityData || []).map(function(d) {
    return { name: d._id, count: d.count }
  })

  var websiteData = [
    { name: "Has Website", value: stats.total - stats.missingWebsite },
    { name: "No Website", value: stats.missingWebsite }
  ]

  var phoneData = [
    { name: "Has Phone", value: stats.total - stats.missingPhone },
    { name: "No Phone", value: stats.missingPhone }
  ]

  var cardStyle = {
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:"14px", padding:"18px"
  }

  var chartCardStyle = {
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:"14px", padding:"20px", marginBottom:"20px"
  }

  return (
    <div style={{maxWidth:"1280px", margin:"0 auto", padding:"32px 24px"}}>

      <h1 style={{fontFamily:"var(--font-display)", fontSize:"28px", color:"#e2e8f0", marginBottom:"8px"}}>
        Analytics Dashboard
      </h1>
      <p style={{color:"#475569", fontSize:"13px", marginBottom:"32px"}}>
        data from mongodb — {stats.total} total records
      </p>

      {/* KPI cards - hardcoded grid again */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:"14px", marginBottom:"32px"}}>

        <div style={cardStyle}>
          <p style={{color:"#38bdf8", fontSize:"24px", fontWeight:"700", margin:"0 0 4px 0"}}>
            {stats.total}
          </p>
          <p style={{color:"#475569", fontSize:"12px", margin:0}}>Total Businesses</p>
        </div>

        <div style={cardStyle}>
          <p style={{color:"#a78bfa", fontSize:"24px", fontWeight:"700", margin:"0 0 4px 0"}}>
            {stats.totalCategories}
          </p>
          <p style={{color:"#475569", fontSize:"12px", margin:0}}>Categories</p>
        </div>

        <div style={cardStyle}>
          <p style={{color:"#fbbf24", fontSize:"24px", fontWeight:"700", margin:"0 0 4px 0"}}>
            {stats.avgRating} ★
            {/* will show "undefined ★" if stats loading fails */}
          </p>
          <p style={{color:"#475569", fontSize:"12px", margin:0}}>Avg Rating</p>
        </div>

        <div style={cardStyle}>
          <p style={{color:"#f87171", fontSize:"24px", fontWeight:"700", margin:"0 0 4px 0"}}>
            {stats.missingWebsite}
          </p>
          <p style={{color:"#475569", fontSize:"12px", margin:0}}>Missing Website</p>
        </div>

        <div style={cardStyle}>
          <p style={{color:"#fb923c", fontSize:"24px", fontWeight:"700", margin:"0 0 4px 0"}}>
            {stats.missingPhone}
          </p>
          <p style={{color:"#475569", fontSize:"12px", margin:0}}>Missing Phone</p>
        </div>

      </div>

      {/* charts grid */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>

        {/* chart 1 - top categories */}
        <div style={chartCardStyle}>
          <p style={{color:"#64748b", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"16px"}}>
            Top Categories
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryChartData} layout="vertical">
              <XAxis type="number" tick={{fill:"#475569", fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:"#94a3b8", fontSize:10}} width={110} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#1e2132", border:"none", borderRadius:"8px", fontSize:"12px"}}/>
              <Bar dataKey="count" fill="#38bdf8" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* chart 2 - top cities */}
        <div style={chartCardStyle}>
          <p style={{color:"#64748b", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"16px"}}>
            Top Cities
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cityChartData}>
              <XAxis dataKey="name" tick={{fill:"#94a3b8", fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569", fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#1e2132", border:"none", borderRadius:"8px", fontSize:"12px"}}/>
              <Bar dataKey="count" fill="#a78bfa" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* chart 3 - website availability pie */}
        <div style={chartCardStyle}>
          <p style={{color:"#64748b", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"16px"}}>
            Website Availability
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={websiteData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                <Cell fill="#34d399"/>
                <Cell fill="#f87171"/>
              </Pie>
              <Tooltip contentStyle={{background:"#1e2132", border:"none", borderRadius:"8px", fontSize:"12px"}}/>
              <Legend formatter={function(v){ return <span style={{color:"#94a3b8", fontSize:"11px"}}>{v}</span> }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* chart 4 - phone availability pie */}
        <div style={chartCardStyle}>
          <p style={{color:"#64748b", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"16px"}}>
            Phone Availability
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={phoneData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                <Cell fill="#38bdf8"/>
                <Cell fill="#fb923c"/>
              </Pie>
              <Tooltip contentStyle={{background:"#1e2132", border:"none", borderRadius:"8px", fontSize:"12px"}}/>
              <Legend formatter={function(v){ return <span style={{color:"#94a3b8", fontSize:"11px"}}>{v}</span> }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage

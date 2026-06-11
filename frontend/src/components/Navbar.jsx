// components/Navbar.jsx
// top navigation bar
// using react-router Link instead of <a> tags so page doesnt reload

import { Link, useLocation } from 'react-router-dom'
import { BarChart2 } from 'lucide-react'

function Navbar() {

  // useLocation gives us the current URL path
  // using it to highlight the active nav link
  var location = useLocation()

  // helper to check if a path is active
  function isActive(path) {
    return location.pathname == path
  }

  return (
    <nav style={{
      background:"rgba(15,17,23,0.95)",
      borderBottom:"1px solid rgba(255,255,255,0.06)",
      padding:"0 24px",
      display:"flex",
      alignItems:"center",
      height:"56px",
      position:"sticky",
      top:0,
      zIndex:100
    }}>

      {/* logo */}
      <Link to="/" style={{textDecoration:"none", display:"flex", alignItems:"center", gap:"8px", marginRight:"32px"}}>
        <div style={{
          width:"28px", height:"28px", borderRadius:"8px",
          background:"rgba(56,189,248,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <BarChart2 size={14} color="#38bdf8" />
        </div>
        <span style={{fontFamily:"var(--font-display)", fontSize:"16px", color:"#e2e8f0", fontWeight:"700"}}>
          BizAnalytics
        </span>
      </Link>

      {/* nav links */}
      <div style={{display:"flex", gap:"4px"}}>
        {[
          { path: '/', label: 'Businesses' },
          { path: '/dashboard', label: 'Dashboard' },
          { path: '/import', label: 'Import Data' },
        ].map(function(link) {
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding:"6px 14px",
                borderRadius:"8px",
                fontSize:"13px",
                fontWeight:"500",
                textDecoration:"none",
                // ternary for active vs inactive style
                background: isActive(link.path) ? "rgba(56,189,248,0.1)" : "transparent",
                color: isActive(link.path) ? "#38bdf8" : "#64748b",
                border: isActive(link.path) ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent"
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

    </nav>
  )
}

export default Navbar

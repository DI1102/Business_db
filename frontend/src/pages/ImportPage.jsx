// pages/ImportPage.jsx
// user uploads their csv here
// we parse it, clean it, then POST it to the backend to save in mongodb

import { useState } from 'react'
import Papa from 'papaparse'
import { processData } from '../utils/dataProcessor'
import { importData } from '../utils/api'

function ImportPage() {

  var [status, setStatus] = useState('idle')  // idle | parsing | importing | done | error
  var [message, setMessage] = useState('')
  var [recordCount, setRecordCount] = useState(0)

  function handleFile(e) {
    var file = e.target.files[0]
    if(!file) return

    setStatus('parsing')
    setMessage('reading csv file...')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(result) {
        var cleaned = processData(result.data)
        setRecordCount(cleaned.length)
        setMessage('cleaned ' + cleaned.length + ' records. importing to mongodb...')
        setStatus('importing')

        // send to backend
        importData(cleaned).then(function(response) {
          if(response.error) {
            setStatus('error')
            setMessage('import failed: ' + response.error)
          } else {
            setStatus('done')
            setMessage('successfully imported ' + response.inserted + ' businesses to mongodb!')
          }
        }).catch(function(err) {
          setStatus('error')
          setMessage('could not reach backend. is it running on port 5000?')
        })
      },
      error: function() {
        setStatus('error')
        setMessage('failed to parse csv file')
      }
    })
  }

  // status color
  var msgColor = status == 'error' ? '#f87171' : status == 'done' ? '#34d399' : '#94a3b8'

  return (
    <div style={{maxWidth:"600px", margin:"0 auto", padding:"60px 24px"}}>

      <h1 style={{fontFamily:"var(--font-display)", fontSize:"28px", color:"#e2e8f0", marginBottom:"8px"}}>
        Import Data
      </h1>
      <p style={{color:"#475569", fontSize:"14px", marginBottom:"40px"}}>
        upload your csv to import into mongodb. existing data will be replaced.
      </p>

      {/* upload box */}
      <div style={{
        border:"2px dashed rgba(255,255,255,0.1)", borderRadius:"16px",
        padding:"48px", textAlign:"center", marginBottom:"24px",
        background:"rgba(255,255,255,0.02)"
      }}>
        <p style={{fontSize:"32px", marginBottom:"12px"}}>📁</p>
        <p style={{color:"#94a3b8", marginBottom:"20px", fontSize:"14px"}}>
          select your google maps csv file
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          disabled={status == 'parsing' || status == 'importing'}
          style={{color:"#94a3b8", fontSize:"13px"}}
        />
      </div>

      {/* status message */}
      {message && (
        <div style={{
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"12px", padding:"16px", textAlign:"center"
        }}>
          {/* loading spinner - just text, not an actual spinner */}
          {(status == 'parsing' || status == 'importing') && (
            <p style={{color:"#475569", fontSize:"12px", marginBottom:"6px"}}>⏳ processing...</p>
          )}
          <p style={{color:msgColor, fontSize:"14px", margin:0}}>{message}</p>
        </div>
      )}

      {/* instructions */}
      <div style={{marginTop:"32px", padding:"16px", background:"rgba(56,189,248,0.04)", borderRadius:"12px", border:"1px solid rgba(56,189,248,0.1)"}}>
        <p style={{color:"#7dd3fc", fontSize:"12px", fontWeight:"600", marginBottom:"8px"}}>Before importing:</p>
        <ul style={{color:"#475569", fontSize:"12px", paddingLeft:"16px", lineHeight:"1.8", margin:0}}>
          <li>Make sure your CSV has: Name, Category, Address, Rating, Phone, Website columns</li>
          <li>Make sure backend is running on port 5000</li>
          <li>This will DELETE all existing data and reimport</li>
          {/* warning about data deletion - at least mentioned it */}
        </ul>
      </div>

    </div>
  )
}

export default ImportPage

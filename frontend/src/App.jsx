// App.jsx
// sets up routing between pages
// using react-router-dom for navigation

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import BusinessDetailPage from './pages/BusinessDetailPage'
import ImportPage from './pages/ImportPage'

function App() {
  return (
    <div style={{minHeight:"100vh", background:"#0f1117"}}>
      <Navbar />
      {/* Routes - like a switch statement, shows the matching page */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/business/:id" element={<BusinessDetailPage />} />
        <Route path="/import" element={<ImportPage />} />
        {/* no 404 page - forgot to add it */}
      </Routes>
    </div>
  )
}

export default App

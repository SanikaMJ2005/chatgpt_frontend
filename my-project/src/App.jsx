import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Singnup from './pages/Singnup'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Header />

      {/* This wrapper ensures content is visible and doesn't hide behind a fixed header */}
      <div className="main-content" style={{ minHeight: '80vh', paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Singnup Routes - handling both spellings so you never get a blank page */}
          <Route path="/singnup" element={<Singnup />} />
          <Route path="/signup" element={<Singnup />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  )
}

export default App;
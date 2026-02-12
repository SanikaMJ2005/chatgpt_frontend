import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Singnup from './pages/Singnup'
import Dashboard from './pages/Dashboard'

// This helper component handles the logic of showing/hiding Header & Footer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Hide header/footer on dashboard because the dashboard has its own sidebar
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      {!isDashboard && <Header />}
      
      <div 
        className={!isDashboard ? "main-content" : ""} 
        style={!isDashboard ? { minHeight: '80vh', paddingTop: '20px' } : {}}
      >
        {children}
      </div>

      {!isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Signup Routes */}
          <Route path="/singnup" element={<Singnup />} />
          <Route path="/signup" element={<Singnup />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  )
}

export default App;
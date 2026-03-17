import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import './lib/i18n';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          {/*<Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />*/}
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
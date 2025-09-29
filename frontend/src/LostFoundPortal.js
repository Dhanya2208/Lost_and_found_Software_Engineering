import React, { useState,  useEffect } from 'react';
//import EnhancedDashboard from './components/Dashboard'; 
import axios from 'axios';
import { Search, Plus, MapPin, Calendar, User, Phone, Mail, Eye, Filter, X, Upload, CheckCircle, AlertCircle, Home as HomeIcon, LogIn, UserPlus, LogOut } from 'lucide-react';
import { login, signup, reportLostItem, reportFoundItem } from './api';
import { 
    getUserLostItems, 
    getUserFoundItems, 
    markGot,
    confirmMatch,
    getLostItemMatches,
    getFoundItemMatches
} from './api';



// CSS Styles (unchanged)
const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  background: 
     linear-gradient(135deg, rgba(232, 229, 235, 0.8) 0%, rgba(37,117,252,0.8) 100%), 
    url('https://cdn.akamai.steamstatic.com/steam/apps/2101390/header.jpg?t=1709035317') no-repeat center center fixed;
  background-size: cover;
   color: #2d3748; 
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: rgba(255,255,255,0.05); /* subtle overlay for text readability */
  backdrop-filter: blur(5px);
  
}

.card {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(127,90,240,0.2), transparent 70%);
  transform: rotate(25deg);
  pointer-events: none;
}

.home-hero {
  text-align: center;
  padding: 3rem 2rem;
  background: 
    linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7)),
    url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1950&q=80') no-repeat center center;
  background-size: cover;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  margin: 2rem auto;
  max-width: 900px;
  backdrop-filter: blur(12px);
  color: #1a202c;
}

.file-upload {
  border: 2px dashed #7f5af0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: url('https://www.transparenttextures.com/patterns/cubes.png') repeat center center;
}

.feature-card {
  background: 
    linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85)),
    url('https://images.unsplash.com/photo-1532284210639-44d1b0f87c2a?auto=format&fit=crop&w=1950&q=80') no-repeat center center;
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem 0;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  transition: all 0.4s ease;
  cursor: pointer;
  border-top: 4px solid transparent;
  background-size: cover;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-top: 4px solid #7f5af0;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}


/* .app-container {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
} */

.header h1, .header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 1rem;
}

.header p {
  color: #4a5568;
  text-align: center;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  border-color: #7f5af0;
  box-shadow: 0 0 0 4px rgba(127, 90, 240, 0.2);
  outline: none;
}

textarea.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #7f5af0, #4c2ed9);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4c2ed9, #7f5af0);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(127,90,240,0.3);
}

.btn-success {
  background: linear-gradient(135deg, #0fbcf9, #00d084);
  color: white;
}

.btn-success:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,216,132,0.3);
}

.btn-secondary {
  background: #718096;
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(43, 17, 238, 1);
  color:rgba(43, 17, 238, 1) ;
}

.btn-outline:hover {
  background: rgba(255,255,255,0.2);
  border-color: white;
  transform: translateY(-2px);
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

.flex-between {
  align-items: center;
  justify-content: space-between;
}

.flex-gap {
  gap: 1rem;
}

.grid {
  display: grid;
  gap: 2rem;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.text-center {
  text-align: center;
}

.alert {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
}

.alert-error {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #f56565;
}

.alert-success {
  background: #e6fffa;
  color: #2f855a;
  border: 1px solid #38a169;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem 0;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  transition: all 0.4s ease;
  cursor: pointer;
  border-top: 4px solid transparent;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-top: 4px solid #7f5af0;
}

.feature-card-danger {
  background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
  color: white;
}

.feature-card-success {
  background: linear-gradient(135deg, #00d084 0%, #00c6ff 100%);
  color: white;
}

.home-hero {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255,255,255,0.9);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  margin: 2rem auto;
  max-width: 900px;
  backdrop-filter: blur(12px);
}

.home-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.home-logo-icon {
  background: #7f5af0;
  padding: 1rem;
  border-radius: 50%;
  color: white;
  box-shadow: 0 5px 15px rgba(127,90,240,0.3);
}

.user-welcome {
  background: rgba(127,90,240,0.05);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border-left: 6px solid #7f5af0;
}

.file-upload {
  border: 2px dashed #7f5af0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload:hover {
  border-color: #4c2ed9;
  background: rgba(127,90,240,0.05);
}

.image-preview {
  max-width: 180px;
  max-height: 180px;
  border-radius: 12px;
  object-fit: cover;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
  
  .card, .home-hero {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .flex-gap {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .btn {
    width: 100%;
  }
}
`; // keep your existing styles here



// Home Component
const Home = ({ user, setUser, setCurrentPage }) => (
  <div className="app-container">
    <style>{styles}</style>
    <div className="container">
      <div className="home-hero">
        <div className="home-logo">
          <div className="home-logo-icon"><Search size={48} /></div>
          <div>
            <h1>Lost & Found Portal</h1>
            <p style={{ fontSize: '1.2rem', color: '#718096', marginTop: '0.5rem' }}>
              Reuniting people with their belongings
            </p>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '2rem', lineHeight: '1.8' }}>
          Welcome to our Lost & Found Portal! Whether you've lost something precious or found an item that belongs to someone else, 
          we're here to help connect you.
        </p>

        {!user ? (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#2d3748', marginBottom: '1.5rem' }}>Get Started</h3>
            <div className="flex flex-gap" style={{ justifyContent: 'center' }}>
              <button onClick={() => setCurrentPage('login')} className="btn btn-primary"><LogIn size={20} /> Login</button>
              <button onClick={() => setCurrentPage('signup')} className="btn btn-success"><UserPlus size={20} /> Sign Up</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="user-welcome">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>
                Welcome back, {user.name}!
              </h3>
             <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
  What would you like to do today?
</p>
<div className="flex flex-gap" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
  <button onClick={() => setCurrentPage('dashboard')} className="btn btn-primary">
    <User size={18} /> View Dashboard
  </button>
</div>

            </div>
            
            <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
              <div className="feature-card feature-card-danger" onClick={() => setCurrentPage('report-lost')}>
                <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Report Lost Item</h4>
                <p style={{ opacity: '0.9' }}>Lost something? Let us help you find it!</p>
              </div>
              <div className="feature-card feature-card-success" onClick={() => setCurrentPage('report-found')}>
                <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Report Found Item</h4>
                <p style={{ opacity: '0.9' }}>Found something? Help return it to its owner!</p>
              </div>
            </div>
            
            <button onClick={() => { setUser(null); setCurrentPage('home'); }} className="btn btn-secondary">
              <LogOut size={20} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Login Component
const Login = ({ setUser, setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setCurrentPage('home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <style>{styles}</style>
      <div className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ width:'80%'}}>
          <div className="header"><h2>Login</h2><p>Sign in to your account</p></div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group"><label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="Enter your email" required />
            </div>
            <div className="form-group"><label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="Enter your password" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="text-center">
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
              Don't have an account?{' '}
              <button onClick={() => setCurrentPage('signup')} style={{ color: '#3182ce', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Sign up
              </button>
            </p>
            <button onClick={() => setCurrentPage('home')} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
              <HomeIcon size={16} /> Back to Home
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Signup Component
const Signup = ({ setCurrentPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      setSuccess(true);
      setTimeout(() => setCurrentPage('login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="app-container">
        <style>{styles}</style>
        <div className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
          <div className="card text-center">
            <div className="icon-container icon-success"><CheckCircle size={64} /></div>
            <h2 style={{ marginBottom: '0.5rem' }}>Account Created!</h2>
            <p style={{ color: '#4a5568' }}>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <style>{styles}</style>
      <div className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ width:'80%'}}>
          <div className="header"><h2>Sign Up</h2><p>Create your account</p></div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSignup}>
            <div className="form-group"><label className="form-label">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Enter your full name" required />
            </div>
            <div className="form-group"><label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="Enter your email" required />
            </div>
            <div className="form-group"><label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="Create a password" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%', marginBottom: '1rem' }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center">
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
              Already have an account?{' '}
              <button onClick={() => setCurrentPage('login')} style={{ color: '#3182ce', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Login
              </button>
            </p>
            <button onClick={() => setCurrentPage('home')} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
              <HomeIcon size={16} /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};




// Helper for simple string similarity
const stringSimilarity = (str1, str2) => {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  if (str1 === str2) return 1;
  const len = Math.max(str1.length, str2.length);
  let matches = 0;
  for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
    if (str1[i] === str2[i]) matches++;
  }
  return matches / len;
};

const ReportItem = ({ user, type, setCurrentPage }) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [matchingItems, setMatchingItems] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large! Max 5MB allowed.');
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !description) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Prepare form data for image upload
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('item_name', itemName);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      if (image) formData.append('image', image);
      formData.append('date', new Date().toISOString().split('T')[0]);

      // Report item to backend
      const response = type === 'lost' ? await axios.post('http://localhost:5000/api/items/lost', formData)
                                       : await axios.post('http://localhost:5000/api/items/found', formData);

      setSuccess(true);

      // Fuzzy matching using backend returned matches
      const matches = response.data.matches || [];
      const fuzzyMatches = matches.filter(match => stringSimilarity(itemName, match.item_name) >= 0.6);
      setMatchingItems(fuzzyMatches);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to report item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="app-container">
        <style>{styles}</style>
        <div className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
          <div className="card text-center">
            <div className="icon-container icon-success"><CheckCircle size={64} /></div>
            <h2>Item Reported Successfully!</h2>
            {matchingItems.length > 0 && (
              <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                <h4>Potential Matches Found:</h4>
                <ul>
                  {matchingItems.map(item => (
                    <li key={item.id}>
                      {item.item_name} ({type === 'lost' ? 'Found' : 'Lost'}) - Contact: {item.user_name} ({item.user_email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={() => setCurrentPage('home')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <style>{styles}</style>
      <div className="container" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ width:'30%'}}>
          <div className="header"><h2>{type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}</h2></div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Item Name</label>
              <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="form-input" placeholder="Enter item name" required />
            </div>
            <div className="form-group"><label className="form-label">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" placeholder="Describe the item" required />
            </div>
            <div className="form-group"><label className="form-label">Category</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="form-input" placeholder="Optional category" />
            </div>
            <div className="form-group"><label className="form-label">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="form-input" placeholder="Optional location" />
            </div>
            <div className="form-group"><label className="form-label">Image</label>
              <input type="file" onChange={handleFileChange} accept="image/*" className="form-input" />
              {preview && <img src={preview} alt="preview" style={{ marginTop: '0.5rem', maxHeight: '150px', borderRadius: '8px' }} />}
            </div>
            <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%' }}>
              {loading ? 'Reporting...' : 'Submit'}
            </button>
          </form>
          <button onClick={() => setCurrentPage('home')} className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};
const dashboardStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      background-size: 200% 200%;
      animation: gradientShift 15s ease infinite;
      padding: 40px 20px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .dashboard-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      pointer-events: none;
      animation: float 20s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .dashboard-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .dashboard-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem 2rem;
      margin-bottom: 2.5rem;
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
      text-align: center;
      transform: translateY(0);
      animation: slideDown 0.6s ease-out;
      position: relative;
      overflow: hidden;
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shine 3s infinite;
    }

    @keyframes shine {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dashboard-header h1 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 3rem;
      margin-bottom: 0.75rem;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .dashboard-header p {
      color: #64748b;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 2rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      position: relative;
      overflow: hidden;
    }

    .back-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .back-btn:hover::before {
      left: 100%;
    }

    .back-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    }

    .back-btn:active {
      transform: translateY(-1px) scale(0.98);
    }

    .section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
      animation: fadeInUp 0.6s ease-out backwards;
      position: relative;
    }

    .section:nth-child(2) { animation-delay: 0.1s; }
    .section:nth-child(3) { animation-delay: 0.2s; }
    .section:nth-child(4) { animation-delay: 0.3s; }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  linear-gradient(90deg, #667eea, #764ba2, #f093fb) border-box;
      border-image: linear-gradient(90deg, #667eea, #764ba2, #f093fb) 1;
    }

    .section-header h2 {
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .section-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 14px;
      border-radius: 16px;
      color: white;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .item-card {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 2px solid rgba(102, 126, 234, 0.1);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .item-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }

    .item-card:hover::before {
      transform: scaleX(1);
    }

    .item-card:hover {
      border-color: rgba(102, 126, 234, 0.3);
      box-shadow: 
        0 20px 50px rgba(102, 126, 234, 0.15),
        0 0 0 1px rgba(102, 126, 234, 0.1);
      transform: translateY(-5px);
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .item-title {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.75rem;
      letter-spacing: -0.5px;
    }

    .item-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .meta-item:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
    }

    .status-badge {
      padding: 8px 16px;
      border-radius: 24px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: statusPulse 2s ease-in-out infinite;
    }

    @keyframes statusPulse {
      0%, 100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
      50% { box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25); }
    }

    .item-description {
      color: #475569;
      line-height: 1.8;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .item-image {
      width: 140px;
      height: 140px;
      border-radius: 16px;
      object-fit: cover;
      margin-right: 1.5rem;
      border: 3px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .item-image:hover {
      transform: scale(1.05) rotate(2deg);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    }

    .item-content {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .item-details {
      flex: 1;
    }

    .matches-section {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      border-radius: 16px;
      padding: 2rem;
      margin-top: 2rem;
      border-left: 5px solid transparent;
      border-image: linear-gradient(180deg, #667eea, #764ba2) 1;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
    }

    .matches-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.5rem;
    }

    .matches-header h4 {
      color: #1e293b;
      font-weight: 700;
      font-size: 1.2rem;
      margin: 0;
    }

    .match-card {
      background: white;
      border: 2px solid rgba(102, 126, 234, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .match-card::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.1), transparent);
      transform: translate(50%, -50%);
      transition: all 0.4s ease;
    }

    .match-card:hover {
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.15);
      border-color: rgba(102, 126, 234, 0.3);
      transform: translateX(5px);
    }

    .match-card:hover::after {
      width: 200px;
      height: 200px;
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .match-title {
      font-weight: 700;
      color: #1e293b;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .match-percentage {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: matchBounce 2s ease-in-out infinite;
    }

    @keyframes matchBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .match-content {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .match-image {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .match-image:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }

    .match-info {
      flex: 1;
    }

    .match-description {
      color: #64748b;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }

    .match-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn:active {
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-primary:hover {
      box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
    }

    .btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-success:hover {
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn:disabled:hover {
      transform: none;
      box-shadow: none;
    }

    .contact-info {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
      border: 2px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1.5rem;
      animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .contact-header {
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #475569;
      font-size: 0.95rem;
      padding: 8px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .contact-item:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateX(5px);
    }

    .contact-item a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .contact-item a:hover {
      color: #2563eb;
      text-decoration: underline;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #94a3b8;
    }

    .empty-state-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      color: #cbd5e0;
      animation: float 3s ease-in-out infinite;
    }

    .empty-state p {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: white;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.2);
      border-top: 5px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-container p {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .item-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 20px 10px;
      }
      
      .dashboard-header {
        padding: 2rem 1.5rem;
      }
      
      .dashboard-header h1 {
        font-size: 2rem;
      }
      
      .section {
        padding: 1.5rem;
      }
      
      .item-content {
        flex-direction: column;
      }
      
      .item-image {
        width: 100%;
        height: 220px;
        margin-right: 0;
        margin-bottom: 1rem;
      }
      
      .match-content {
        flex-direction: column;
      }
      
      .match-image {
        width: 100%;
        height: 180px;
      }
      
      .match-actions {
        justify-content: center;
      }

      .item-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    /* Scrollbar Styling */
    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  `;

const UserDashboard = ({ user, setCurrentPage }) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmedMatches, setConfirmedMatches] = useState(new Set());
  const [contactInfo, setContactInfo] = useState({});

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          getUserLostItems(user.id),
          getUserFoundItems(user.id),
        ]);

        const lostWithMatches = await Promise.all(
          (lostRes.data || []).map(async (item) => {
            try {
              const matchRes = await getLostItemMatches(item.id);
              return { 
                ...item, 
                matches: matchRes.data || [],
                type: 'lost'
              };
            } catch (err) {
              console.warn(`Failed to get matches for lost item ${item.id}:`, err);
              return { ...item, matches: [], type: 'lost' };
            }
          })
        );

        const foundWithMatches = await Promise.all(
          (foundRes.data || []).map(async (item) => {
            try {
              const matchRes = await getFoundItemMatches(item.id);
              return { 
                ...item, 
                matches: matchRes.data || [],
                type: 'found'
              };
            } catch (err) {
              console.warn(`Failed to get matches for found item ${item.id}:`, err);
              return { ...item, matches: [], type: 'found' };
            }
          })
        );

        setLostItems(lostWithMatches);
        setFoundItems(foundWithMatches);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const handleConfirmMatch = async (myItemId, matchedItemId, matchedItem) => {
    try {
      const res = await confirmMatch(myItemId, matchedItemId);
      const contacts = res.data.contacts || [];
      const contact = contacts.find(c => c.user_email !== user.email) || contacts[0];

      const matchKey = `${myItemId}-${matchedItemId}`;
      setConfirmedMatches(prev => new Set([...prev, matchKey]));

      setContactInfo(prev => ({
        ...prev,
        [matchKey]: {
          name: contact?.user_name || 'Unknown User',
          email: contact?.user_email || 'No email provided',
          phone: contact?.user_phone || 'No phone provided'
        }
      }));

      alert('Match confirmed! Contact details have been exchanged.');
    } catch (err) {
      console.error('Failed to confirm match:', err);
      alert('Failed to confirm match. Please try again.');
    }
  };

  const handleMarkGot = async (itemId, itemType) => {
    try {
      await markGot(itemId);
      
      if (itemType === 'lost') {
        setLostItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'completed' } : item
        ));
      } else {
        setFoundItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'completed' } : item
        ));
      }

      alert('Item marked as received/returned successfully!');
    } catch (err) {
      console.error('Failed to mark as got:', err);
      alert('Failed to update item status. Please try again.');
    }
  };

  const getMatchPercentageColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'confirmed': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'completed': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <style>{dashboardStyles}</style>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <style>{dashboardStyles}</style>
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Your Dashboard</h1>
          <p>Manage your lost and found items with smart matching</p>
        </div>

        <button className="back-btn" onClick={() => setCurrentPage('home')}>
          <HomeIcon size={18} />
          Back to Home
        </button>

        <div className="section">
          <div className="section-header">
            <div className="section-icon">
              <AlertCircle size={24} />
            </div>
            <h2>Your Lost Items ({lostItems.length})</h2>
          </div>

          {lostItems.length === 0 ? (
            <div className="empty-state">
              <Search className="empty-state-icon" />
              <p>You haven't reported any lost items yet.</p>
            </div>
          ) : (
            lostItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <div>
                    <div className="item-title">{item.item_name}</div>
                    <div className="item-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        {item.location || 'Location not specified'}
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Date not specified'}
                      </div>
                    </div>
                  </div>
                  <span 
                    className="status-badge" 
                    style={{ background: getStatusBadgeColor(item.status || 'available') }}
                  >
                    {item.status || 'available'}
                  </span>
                </div>

                <div className="item-content">
                  {item.image && (
                    <img 
                      src={`http://localhost:5000/uploads/${item.image}`} 
                      alt={item.item_name} 
                      className="item-image" 
                    />
                  )}
                  <div className="item-details">
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleMarkGot(item.id, 'lost')}
                    disabled={item.status === 'completed'}
                  >
                    <CheckCircle size={14} />
                    {item.status === 'completed' ? 'Item Received' : 'Mark as Got'}
                  </button>
                </div>

                {item.matches && item.matches.length > 0 && (
                  <div className="matches-section">
                    <div className="matches-header">
                      <Search size={20} />
                      <h4>Potential Matches ({item.matches.length})</h4>
                    </div>

                    {item.matches.map(match => {
                      const matchKey = `${item.id}-${match.id}`;
                      const isConfirmed = confirmedMatches.has(matchKey);
                      
                      return (
                        <div key={match.id} className="match-card">
                          <div className="match-header">
                            <div className="match-title">{match.item_name}</div>
                            <div 
                              className="match-percentage"
                              style={{ backgroundColor: getMatchPercentageColor(match.match_percentage || 0) }}
                            >
                              {match.match_percentage || 0}% match
                            </div>
                          </div>

                          <div className="match-content">
                            {match.image && (
                              <img 
                                src={`http://localhost:5000/uploads/${match.image}`} 
                                alt={match.item_name} 
                                className="match-image" 
                              />
                            )}
                            <div className="match-info">
                              <p className="match-description">{match.description}</p>
                              <div className="meta-item">
                                <MapPin size={14} />
                                {match.location || 'Location not specified'} • {match.date ? new Date(match.date).toLocaleDateString() : 'Date not specified'}
                              </div>
                            </div>
                          </div>

                          <div className="match-actions">
                            {!isConfirmed ? (
                              <button
                                className="btn btn-primary"
                                onClick={() => handleConfirmMatch(item.id, match.id, match)}
                              >
                                <CheckCircle size={14} />
                                Confirm Match
                              </button>
                            ) : (
                              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1rem' }}>
                                Match Confirmed ✓
                              </span>
                            )}
                          </div>

                          {isConfirmed && contactInfo[matchKey] && (
                            <div className="contact-info">
                              <div className="contact-header">
                                <User size={16} />
                                Finder Contact Information
                              </div>
                              <div className="contact-details">
                                <div className="contact-item">
                                  <User size={14} />
                                  <span>{contactInfo[matchKey].name}</span>
                                </div>
                                <div className="contact-item">
                                  <Mail size={14} />
                                  <a href={`mailto:${contactInfo[matchKey].email}`}>
                                    {contactInfo[matchKey].email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-icon">
              <CheckCircle size={24} />
            </div>
            <h2>Your Found Items ({foundItems.length})</h2>
          </div>

          {foundItems.length === 0 ? (
            <div className="empty-state">
              <Search className="empty-state-icon" />
              <p>You haven't reported any found items yet.</p>
            </div>
          ) : (
            foundItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <div>
                    <div className="item-title">{item.item_name}</div>
                    <div className="item-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        {item.location || 'Location not specified'}
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Date not specified'}
                      </div>
                    </div>
                  </div>
                  <span 
                    className="status-badge" 
                    style={{ background: getStatusBadgeColor(item.status || 'available') }}
                  >
                    {item.status || 'available'}
                  </span>
                </div>

                <div className="item-content">
                  {item.image && (
                    <img 
                      src={`http://localhost:5000/uploads/${item.image}`} 
                      alt={item.item_name} 
                      className="item-image" 
                    />
                  )}
                  <div className="item-details">
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleMarkGot(item.id, 'found')}
                    disabled={item.status === 'completed'}
                  >
                    <CheckCircle size={14} />
                    {item.status === 'completed' ? 'Item Returned' : 'Mark as Returned'}
                  </button>
                </div>

                {item.matches && item.matches.length > 0 && (
                  <div className="matches-section">
                    <div className="matches-header">
                      <Search size={20} />
                      <h4>Potential Owners ({item.matches.length})</h4>
                    </div>

                    {item.matches.map(match => {
                      const matchKey = `${item.id}-${match.id}`;
                      const isConfirmed = confirmedMatches.has(matchKey);
                      
                      return (
                        <div key={match.id} className="match-card">
                          <div className="match-header">
                            <div className="match-title">{match.item_name}</div>
                            <div 
                              className="match-percentage"
                              style={{ backgroundColor: getMatchPercentageColor(match.match_percentage || 0) }}
                            >
                              {match.match_percentage || 0}% match
                            </div>
                          </div>

                          <div className="match-content">
                            {match.image && (
                              <img 
                                src={`http://localhost:5000/uploads/${match.image}`} 
                                alt={match.item_name} 
                                className="match-image" 
                              />
                            )}
                            <div className="match-info">
                              <p className="match-description">{match.description}</p>
                              <div className="meta-item">
                                <MapPin size={14} />
                                {match.location || 'Location not specified'} • {match.date ? new Date(match.date).toLocaleDateString() : 'Date not specified'}
                              </div>
                            </div>
                          </div>

                          <div className="match-actions">
                            {!isConfirmed ? (
                              <button
                                className="btn btn-primary"
                                onClick={() => handleConfirmMatch(item.id, match.id, match)}
                              >
                                <CheckCircle size={14} />
                                Confirm Owner
                              </button>
                            ) : (
                              <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1rem' }}>
                                Owner Confirmed ✓
                              </span>
                            )}
                          </div>

                          {isConfirmed && contactInfo[matchKey] && (
                            <div className="contact-info">
                              <div className="contact-header">
                                <User size={16} />
                                Owner Contact Information
                              </div>
                              <div className="contact-details">
                                <div className="contact-item">
                                  <User size={14} />
                                  <span>{contactInfo[matchKey].name}</span>
                                </div>
                                <div className="contact-item">
                                  <Mail size={14} />
                                  <a href={`mailto:${contactInfo[matchKey].email}`}>
                                    {contactInfo[matchKey].email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


// Main LostFoundPortal Component
export default function LostFoundPortal() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  switch (currentPage) {
    case 'login': return <Login setUser={setUser} setCurrentPage={setCurrentPage} />;
    case 'signup': return <Signup setCurrentPage={setCurrentPage} />;
    case 'report-lost': return <ReportItem user={user} type="lost" setCurrentPage={setCurrentPage} />;
    case 'report-found': return <ReportItem user={user} type="found" setCurrentPage={setCurrentPage} />;
    case 'dashboard': return <UserDashboard user={user} setCurrentPage={setCurrentPage} />;
    default: return <Home user={user} setUser={setUser} setCurrentPage={setCurrentPage} />;
  }
}

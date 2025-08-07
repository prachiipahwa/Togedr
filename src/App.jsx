// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ActivityPage from './pages/ActivityPage';
import PostActivityPage from './pages/PostActivityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';

const MainLayout = () =>{
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar />
      <main>
        {}
        <Outlet />
      </main>
    </div>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="activity/:id" element={<ActivityPage />} />
          <Route path="post" element={<PostActivityPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
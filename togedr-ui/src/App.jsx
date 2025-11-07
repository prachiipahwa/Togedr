// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityPage from './pages/ActivityPage';
import PostActivityPage from './pages/PostActivityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GroupChatPage from './pages/GroupChatPage';
import TogedrMomentPage from './pages/TogedrMomentPage';
import ProfilePage from './pages/ProfilePage';
import SetupProfilePage from './pages/SetupProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import PrivateChatPage from './pages/PrivateChatPage';
import EditActivityPage from './pages/EditActivityPage';

const MainLayout = () => {
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="activity/:id" element={<ActivityPage />} />
            <Route path="users/:id" element={<PublicProfilePage/>}/>
            
            <Route element={<ProtectedRoute />}>
              <Route path="post" element={<PostActivityPage />} />
              <Route path="activity/:id/edit" element={<EditActivityPage />} />
              <Route path="activity/:id/chat" element={<GroupChatPage />} />
              <Route path="chat/:roomId" element={<PrivateChatPage />} />
              <Route path="activity/:id/moment" element={<TogedrMomentPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="setup-profile" element={<SetupProfilePage />} /> 
            </Route>

          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
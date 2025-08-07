// // src/components/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// // --- SVG Icon Components ---
// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
// );

// const LogoutIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
// );

// const Navbar = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
//           Togedr
//         </Link>

//         <div className="flex items-center space-x-6">
//           {isAuthenticated ? (
//             <>
//               <div className="flex items-center space-x-2">
//                 <UserIcon />
//                 <span className="text-gray-800 font-medium">Hi, {user.name}!</span>
//               </div>
//               <button 
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
//               >
//                 <LogoutIcon />
//                 <span className="font-medium">Logout</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
//               <Link 
//                 to="/register" 
//                 className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- SVG Icon Components ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

// New Icon for "Post Activity"
const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);


const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          Togedr
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <UserIcon />
                <span className="text-gray-800 font-medium">Hi, {user.name}!</span>
              </div>
              
              {/* This is the new "Post Activity" link */}
              <Link to="/post" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <PlusCircleIcon />
                <span className="font-medium">Post Activity</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
              >
                <LogoutIcon />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

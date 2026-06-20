import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { Home, Auth, Orders, Tables, Menu, Dashboard, More } from './pages'; 
import Header from './components/shared/Header';
import { useSelector } from 'react-redux';
import useLoadData from './hooks/useLoadData';
import FullScreenLoader from './components/shared/FullScreenLoader';

// This component wraps all routes that NEED a Header
function MainLayout() {
  return (
    <>
      <Header />
      {/* This Outlet acts as a placeholder where sub-pages will render */}
      <Outlet />
    </>
  );
}

// This component defines all the routes for the application
function AppRoutes() {
  const { isAuth, role } = useSelector(state => state.user);
  const isLoading = useLoadData(); 

  if (isLoading) return <FullScreenLoader />; 

  return (
    <Routes>
      {/* Protected Staff-only routes (Header Layout included) */}
      <Route element={<MainLayout />}>
        <Route path='/' element={
          <ProtectedRoutes allowedRole="StaffOnly">
            <Home />
          </ProtectedRoutes>
        } />

        <Route path='/orders' element={
          <ProtectedRoutes allowedRole="StaffOnly">
            <Orders />
          </ProtectedRoutes>
        } />

        <Route path='/tables' element={
          <ProtectedRoutes allowedRole="StaffOnly">
            <Tables />
          </ProtectedRoutes>
        } />

        <Route path='/menu' element={
          <ProtectedRoutes allowedRole="StaffOnly">
            <Menu />
          </ProtectedRoutes>
        } /> 
      </Route>

      {/* Protected Admin-only route (Header Layout excluded) */}
      <Route path='/dashboard' element={
        <ProtectedRoutes allowedRole="Admin">
          <Dashboard />
        </ProtectedRoutes>
      } />

      <Route path='/more' element={
          <ProtectedRoutes allowedRole="StaffOnly">
            <More />
          </ProtectedRoutes>
        } />

      {/* Auth page with role-based dispatch routing */}
      <Route path='/auth' element={ 
        isAuth ? ( 
          role === 'Admin' ? <Navigate to='/dashboard' replace /> : <Navigate to='/' replace /> 
        ) : (
          <Auth />
        )
      } />

      {/* Catch-all 404 Route */}
      <Route path='*' element={<div>Page Not Found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

// Complete Role Guard implementation 
function ProtectedRoutes({ children, allowedRole }) {
  const { isAuth, role } = useSelector(state => state.user);

  // If not logged in, go back to the login portal
  if (!isAuth) {
    return <Navigate to='/auth' replace />;
  }

  // If user is an Admin, block them from all Staff paths and force redirect to Dashboard
  if (allowedRole === "StaffOnly" && role === "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is a Cashier/Waiter, block them from Admin Dashboard and force redirect to Home
  if (allowedRole === "Admin" && role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // Allow normal viewing if the role condition passes
  return children;
}

export default App;

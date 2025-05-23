import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AircraftFinder from './pages/AircraftFinder';
import RouteFinder from './pages/RouteFinder';
import CabinConfigurator from './pages/CabinConfigurator';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="toast-container"></div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/aircraft-finder" element={<AircraftFinder />} />
              <Route path="/route-finder" element={<RouteFinder />} />
              <Route path="/cabin-configurator" element={<CabinConfigurator />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

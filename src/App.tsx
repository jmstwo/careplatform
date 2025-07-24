import React, { useState } from 'react';
import { Layout } from './components/templates/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { RotaManagement } from './pages/RotaManagement';
import { ClientManagement } from './pages/ClientManagement';
import { AddNewClient } from './pages/AddNewClient';
import { StaffManagement } from './pages/StaffManagement';
import { EMAR } from './pages/EMAR';
import { Timesheets } from './pages/Timesheets';
import { Patches } from './pages/Patches';
import { Reports } from './pages/Reports';
import { Incidents } from './pages/Incidents';
import { SettingsPage } from './pages/SettingsPage';
import { ROUTES } from './utils/constants';
import './styles/themes.css';

function App() {
  const [currentPath, setCurrentPath] = useState(ROUTES.DASHBOARD);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const renderPage = () => {
    switch (currentPath) {
      case ROUTES.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case ROUTES.ALERTS:
        return <Alerts />;
      case ROUTES.ROTA:
        return <RotaManagement />;
      case ROUTES.CLIENTS:
        return <ClientManagement />;
      case ROUTES.ADD_CLIENT:
        return <AddNewClient onNavigate={handleNavigate} />;
      case ROUTES.STAFF:
        return <StaffManagement />;
      case ROUTES.EMAR:
        return <EMAR />;
      case ROUTES.TIMESHEETS:
        return <Timesheets />;
      case ROUTES.PATCHES:
        return <Patches />;
      case ROUTES.REPORTS:
        return <Reports />;
      case ROUTES.INCIDENTS:
        return <Incidents />;
      case ROUTES.SETTINGS:
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Layout
            currentPath={currentPath}
            onNavigate={handleNavigate}
          >
            {renderPage()}
          </Layout>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
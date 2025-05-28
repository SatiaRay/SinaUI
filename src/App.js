import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Chat from './components/Chat/Chat';
import DataSources from './components/Chat/DataSources';
import Documents from './components/Chat/Documents';
import Wizard from './components/Chat/Wizard';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const location = useLocation();
    const showNavbar = location.pathname !== '/login';
    const [desktopSidebarVisible, setDesktopSidebarVisible] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {showNavbar && <Navbar desktopSidebarVisible={desktopSidebarVisible} setDesktopSidebarVisible={setDesktopSidebarVisible} />}
            <div className={`transition-all duration-300 ${desktopSidebarVisible ? 'md:mr-64' : 'md:mr-0'}`}>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={<Navigate to="/chat" replace />}
                    />

                    <Route
                        path="/chat"
                        element={
                            <PrivateRoute>
                                <Chat />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/data-sources"
                        element={
                            <PrivateRoute>
                                <DataSources />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/documents"
                        element={
                            <PrivateRoute>
                                <Documents />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/wizard"
                        element={
                            <PrivateRoute>
                                <Wizard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
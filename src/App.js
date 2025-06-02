import React, { useEffect, useState, version } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Chat from './components/Chat/Chat';
import DataSources from './components/Chat/DataSources';
import Documents from './components/Chat/Documents';
import Wizard from './components/Chat/Wizard';
import Workflow from './components/Workflow/WorkflowIndex';
import WorkflowEditor from './components/Workflow/editor/WorkflowEditor';
import { getVersion } from './utils/apis';

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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [appVersion, setAppVersion] = useState(null)

    useEffect(() => {
        const fetchVersion = async () => {
            try{
                const res = await getVersion()
                setAppVersion(res.version)
            } catch (err) {
                setAppVersion('undefined')
            }
        }

        fetchVersion()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {showNavbar && <Navbar onSidebarCollapse={setSidebarCollapsed} />}
            <div 
                className={`transition-all duration-300 ${
                    showNavbar 
                        ? (sidebarCollapsed ? 'md:mr-0' : 'md:mr-64') 
                        : 'flex items-center justify-center'
                }`}
            >
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
                    <Route path="/workflow">
                        <Route
                            index
                            element={
                                <PrivateRoute>
                                    <Workflow />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path=":workflowId"
                            element={
                                <PrivateRoute>
                                    <WorkflowEditor />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="create"
                            element={
                                <PrivateRoute>
                                    <WorkflowEditor />
                                </PrivateRoute>
                            }
                        />
                    </Route>
                </Routes>
                <span style={{position:'fixed', bottom: "5px", left: "10px"}}>
                    نسخه : {appVersion}
                </span>
            </div>
        </div>
    );
}

export default App;
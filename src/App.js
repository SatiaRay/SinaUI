import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Chat from './components/Chat/Chat';
import DataSources from './components/Chat/DataSources';
import { Document, DocumentIndex, DomainIndex, EditDocument } from './components/Chat/Document';
import Wizard from './components/Chat/Wizard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import CrawlUrl from './components/Chat/CrawlUrl';

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {showNavbar && <Navbar onSidebarCollapse={setSidebarCollapsed} />}
            <div
                className={`transition-all duration-300 ${showNavbar
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
                    /** Document routes */
                    <Route>
                        <Route
                            path="/document"
                            element={
                                <PrivateRoute>
                                    <Document />
                                </PrivateRoute>
                            }
                        >
                            <Route
                                path=''
                                element={<Navigate to="domains" />}
                            />
                            <Route
                                path="domains"
                                element={
                                    <PrivateRoute>
                                        <DomainIndex />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="domain/:domain_id"
                                element={
                                    <PrivateRoute>
                                        <DocumentIndex />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="manuals"
                                element={
                                    <PrivateRoute>
                                        <DocumentIndex />
                                    </PrivateRoute>
                                }
                            />
                        </Route>
                    </Route>
                    <Route
                        path="document/edit/:document_id"
                        element={
                            <PrivateRoute>
                                <EditDocument />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path='crawl-url'
                        element={<CrawlUrl/>}
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
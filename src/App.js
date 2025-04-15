import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import AccidentList from './components/AccidentList';
import AccidentForm from './components/AccidentForm';
import PassList from './components/PassList';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import GuardLogList from './components/GuardLogList';
import AddGuardLog from './components/AddGuardLog';
import VehicleList from './components/VehicleList';
import StationList from './components/StationList';
import PersonnelList from './components/PersonnelList';
import PersonnelCreate from './components/PersonnelCreate';
import PersonnelEdit from './components/PersonnelEdit';
import RolesList from './components/RolesList';
import RoleCreate from './components/RoleCreate';
import RolePermissions from './components/RolePermissions';
import OilList from './components/OilList';
import OilEdit from './components/OilEdit';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <Chat />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/accidents"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <AccidentList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/accidents/create"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <AccidentForm />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/passes"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <PassList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/guard-logs"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <GuardLogList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/guard-logs/create"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <AddGuardLog />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/vehicles"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <VehicleList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/stations"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <StationList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/personnel"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <PersonnelList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/personnel/create"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <PersonnelCreate />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/personnel/:id/edit"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <PersonnelEdit />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <RolesList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/roles/create"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <RoleCreate />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/role-permissions"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <RolePermissions />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/oils"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <OilList />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/oils/edit/:id"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <div className="md:mr-64">
                      <OilEdit />
                    </div>
                  </>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/accidents" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 
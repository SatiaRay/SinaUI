import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import Chat from './components/chat/Chat';
import {
  CreateDocument,
  DocumentIndex,
  EditDocument,
  VectorSearchingPage,
} from './pages/document';
import {
  WorkflowIndexPage,
  EditWorkflowPage,
  CreateWorkflowPage,
} from './pages/workflow';
import {
  CreateInstruction,
  InstructionIndex,
  EditInstruction,
} from './pages/instruction';
import { 
  Integrations,
  WidgetPreview,
} from './pages/integration';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { WorkflowEditor } from './pages/workflow';
import { AuthProvider } from './contexts/AuthContext';
import { getVersion } from './utils/apis';
import Register from './components/register';
import Setting from '@pages/setting/SettingIndex/SettingIndexPage';
import ChatBoxPreview from './pages/widget/chat-box-perview';
import { ChatProvider } from './contexts/ChatContext';

import {
  MonitoringIndex,
  RecentLogsPage,
  LogSearchPage,
  ToolUsageStats,
} from '@pages/monitoring';
import {
  CreateWizardPage,
  EditWizardPage,
  ShowWizardPage,
  WizardIndexPage,
} from '@pages/wizard';
import { ThemeProvider } from '@contexts/ThemeContext';
// import { VoiceAgentProvider } from './contexts/VoiceAgentContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/*<VoiceAgentProvider>*/}
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppContent />
        </Router>
        {/*</VoiceAgentProvider>*/}
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [containerOverflowHidden, setContainerOverflowHidden] = useState(false);
  const isPrivateRoute =
    location.pathname !== '/login' && location.pathname !== '/register';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('khan-sidebar-expanded');
    if (savedState === null || savedState === undefined) {
      return false;
    }
    return !JSON.parse(savedState);
  });
  const [appVersion, setAppVersion] = useState(null);

  /**
   * Setup window event on container overflow hidden
   */
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'CONTAINER_OVERFLOW_HIDDEN') {
        setContainerOverflowHidden(true);
      } else if (event.data.type === 'CONTAINER_OVERFLOW_AUTO') {
        setContainerOverflowHidden(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /**
   * Fetch App Version
   */
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const res = await getVersion();
        setAppVersion(res.version);
      } catch (err) {
        setAppVersion('undefined');
      }
    };

    fetchVersion();
  }, []);

  return (
    <div
      id="khan"
      className={`min-h-screen main-content bg-neutral-50 dark:bg-gray-900 flex transition-all duration-300 h-screen ${
        isPrivateRoute
          ? sidebarCollapsed
            ? 'mr-10'
            : 'mr-10 md:mr-64'
          : 'flex items-center justify-center'
      }`}
    >
      {isPrivateRoute && <Navbar onSidebarCollapse={setSidebarCollapsed} />}

      {isPrivateRoute && (
        <div
          className={`md:container mx-auto md:px-10 py-0 md:py-2 lg:px-0 w-[100%] lg:w-[90%] xl:w-[85%] xxl:w-[1400px] ${containerOverflowHidden ? 'overflow-hidden' : ''}`}
        >
          {privateRoutes()}
        </div>
      )}

      {!isPrivateRoute && publicRoutes()}

      <span
        className="text-xs dark:text-neutral-100 fixed bottom-[2px] left-2 md:left-1"
        dir="ltr"
      >
        {appVersion}
      </span>
    </div>
  );
}

function privateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route>
        /** CHAT */
        <Route path="/chat">
          <Route
            path=""
            element={
              <PrivateRoute>
                <ChatProvider>
                  <Chat />
                </ChatProvider>
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/monitoring">
          <Route
            path=""
            element={
              <PrivateRoute>
                <MonitoringIndex />
              </PrivateRoute>
            }
          />
          <Route
            path="logs"
            element={
              <PrivateRoute>
                <RecentLogsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="log-by-id"
            element={
              <PrivateRoute>
                <LogSearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="tools"
            element={
              <PrivateRoute>
                <ToolUsageStats />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/setting">
          <Route
            path=""
            element={
              <PrivateRoute>
                <Setting />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
      /** Document routes */
      <Route>
        <Route path="/document">
          <Route
            index
            path=""
            element={
              <PrivateRoute>
                <DocumentIndex />
              </PrivateRoute>
            }
          />
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
          path="document/vector-search"
          element={
            <PrivateRoute>
              <VectorSearchingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="document/create"
          element={
            <PrivateRoute>
              <CreateDocument />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/wizard">
        <Route
          index
          element={
            <PrivateRoute>
              <WizardIndexPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":wizard_id"
          element={
            <PrivateRoute>
              <ShowWizardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="edit/:wizard_id"
          element={
            <PrivateRoute>
              <EditWizardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="create"
          element={
            <PrivateRoute>
              <CreateWizardPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/workflow">
        <Route
          index
          element={
            <PrivateRoute>
              <WorkflowIndexPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":id"
          element={
            <PrivateRoute>
              <EditWorkflowPage />
            </PrivateRoute>
          }
        />
        <Route
          path="create"
          element={
            <PrivateRoute>
              <CreateWorkflowPage />
            </PrivateRoute>
          }
        />
      </Route>
      {/* Instruction Routes */}
      <Route path="/instruction">
        <Route
          index
          element={
            <PrivateRoute>
              <InstructionIndex />
            </PrivateRoute>
          }
        />
        <Route
          path="create"
          element={
            <PrivateRoute>
              <CreateInstruction />
            </PrivateRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <PrivateRoute>
              <EditInstruction />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/integration">
        <Route
          index
          element={
            <PrivateRoute>
              <Integrations />
            </PrivateRoute>
          }
        />
        <Route
          path="preview"
          element={
            <PrivateRoute>
              <WidgetPreview />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

function publicRoutes() {
  return (
    <div className="w-full h-full grid grid-cols-1 justify-center items-center">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

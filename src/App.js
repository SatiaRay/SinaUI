import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import Chat from '@components/chat/Chat';
import {
  CreateDocument,
  DocumentIndex,
  EditDocument,
  VectorSearchingPage,
} from '@pages/document';
import {
  WorkflowIndexPage,
  EditWorkflowPage,
  CreateWorkflowPage,
} from '@pages/workflow';
import {
  CreateInstruction,
  InstructionIndex,
  EditInstruction,
} from '@pages/instruction';
import Login from '@components/Login';
import Navbar from '@components/Navbar';
import PrivateRoute from '@components/PrivateRoute';
import { AuthProvider } from '@contexts/AuthContext';
import Register from '@components/register';
import Setting from '@pages/setting/SettingIndex/SettingIndexPage';
import { ChatProvider } from '@contexts/ChatContext';

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
import {
  WorkspaceIndexPage,
  CreateWorkspacePage,
  EditWorkspacePage,
  ShowWorkspacePage,
  WorkspaceSettingsPage,
  AuditLogIndex,
  AuditLogDetails,
  WorkspaceSelectionPage,
} from '@pages/workspace';
import {
  FlowPage,
  CreateFlow,
  EditFlowPage,
  ShowFlowPage,
} from '@pages/project';
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

  /**
   * Check if current route is workspace selection page
   * This page needs full-screen layout without navbar
   */
  const isWorkspaceSelectPage = location.pathname === '/workspace/select';

  /**
   * Determine if current route is private (requires authentication)
   */
  const isPrivateRoute =
    location.pathname !== '/login' && location.pathname !== '/register';

  /**
   * Determine if we should show the full layout with navbar
   * Full layout is shown for private routes except workspace selection page
   */
  const showFullLayout = isPrivateRoute && !isWorkspaceSelectPage;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('khan-sidebar-expanded');
    if (savedState === null || savedState === undefined) {
      return false;
    }
    return !JSON.parse(savedState);
  });

  /**
   * Setup window event on container overflow hidden
   */
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'CONTAINER_OVERFLOW_HIDDEN') {
        setContainerOverflowHidden(true);
      } else if (event.data.type === 'CONTAINER_OVERFLOW_AUTO') {
        setContainerOverflowHidden(false);
      } else if (event.data.type === 'HIDE_NAVBAR') {
      /**
       * Handle navbar visibility messages from child components
       * WorkspaceSelectionPage uses these to hide/show navbar
       */
        document.body.style.overflow = 'hidden';
      } else if (event.data.type === 'SHOW_NAVBAR') {
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /**
   * Handle body overflow for workspace selection page
   * This prevents scrolling when the page is in full-screen mode
   */
  useEffect(() => {
    if (isWorkspaceSelectPage) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isWorkspaceSelectPage]);

  /**
   * Special handling for workspace selection page
   * This page needs to take full screen without any layout wrappers
   */
  if (isWorkspaceSelectPage) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route
            path="/workspace/select"
            element={
              <PrivateRoute>
                <WorkspaceSelectionPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    );
  }

  return (
    <div
      id="khan"
      className={`min-h-screen main-content bg-neutral-50 dark:bg-gray-900 flex transition-all duration-300 h-screen ${
        showFullLayout
          ? sidebarCollapsed
            ? 'mr-10'
            : 'mr-10 md:mr-64'
          : 'flex items-center justify-center'
      }`}
    >
      {showFullLayout && <Navbar onSidebarCollapse={setSidebarCollapsed} />}

      {showFullLayout && (
        <div
          className={`md:container mx-auto md:px-10 py-0 md:py-2 lg:px-0 w-[100%] lg:w-[90%] xl:w-[85%] xxl:w-[1400px] ${containerOverflowHidden ? 'overflow-hidden' : ''}`}
        >
          {privateRoutes()}
        </div>
      )}

      {!showFullLayout && publicRoutes()}
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
      {/* Workspace Routes */}
      <Route path="/workspace">
        <Route
          index
          element={
            <PrivateRoute>
              <WorkspaceIndexPage />
            </PrivateRoute>
          }
        />
        <Route
          path={'/workspace/create'}
          element={
            <PrivateRoute>
              <CreateWorkspacePage />
            </PrivateRoute>
          }
        />
        <Route
          path={'/workspace/edit/:id'}
          element={
            <PrivateRoute>
              <EditWorkspacePage />
            </PrivateRoute>
          }
        />
        <Route
          path={'/workspace/:workspaceId'}
          element={
            <PrivateRoute>
              <ShowWorkspacePage />
            </PrivateRoute>
          }
        />
      </Route>
      {/* Project Routes */}
      <Route path="/projects">
        <Route
          index
          element={
            <PrivateRoute>
              <FlowPage />
            </PrivateRoute>
          }
        />
        <Route
          path={'/projects/create'}
          element={
            <PrivateRoute>
              <CreateFlow />
            </PrivateRoute>
          }
        />
        <Route
          path={'/projects/edit/:projectId'}
          element={
            <PrivateRoute>
              <EditFlowPage />
            </PrivateRoute>
          }
        />
        <Route
          path={'/projects/:projectId'}
          element={
            <PrivateRoute>
              <ShowFlowPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route
        path="/w/:workspaceId/audit-logs"
        element={
          <PrivateRoute>
            <AuditLogIndex />
          </PrivateRoute>
        }
      />
      <Route
        path="/w/:workspaceId/audit-logs/:logId"
        element={
          <PrivateRoute>
            <AuditLogDetails />
          </PrivateRoute>
        }
      />
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

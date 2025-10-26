import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import Chat from './components/Chat/Chat';
import CrawlUrl from './components/Chat/CrawlUrl';
import { DocumentIndex, EditDocument } from './components/Chat/Document';
import CreateInstruction from './components/Chat/Instruction/CreateInstruction';
import EditInstruction from './components/Chat/Instruction/EditInstruction';
import InstructionIndex from './components/Chat/Instruction/InstructionIndex';
import Status1 from './components/Chat/Status';
import Wizard from './components/Chat/Wizard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Workflow from './components/Workflow/WorkflowIndex';
import WorkflowEditor from './components/Workflow/editor/WorkflowEditor';
import { AuthProvider } from './contexts/AuthContext';
import { VoiceAgentProvider } from './contexts/VoiceAgentContext';
import VoiceAgentConversation from './pages/VoiceAgentConversation';
import AiToolsFunctionTester from './pages/AiToolsFunctionTester';
import { getVersion } from './utils/apis';
import Register from './components/register';
import Setting from './pages/setting';
import ChatBoxPreview from './pages/widget/chat-box-perview';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <AuthProvider>
      <VoiceAgentProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppContent />
        </Router>
      </VoiceAgentProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [appVersion, setAppVersion] = useState(null);
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
      className={`min-h-screen bg-neutral-50 dark:bg-gray-900 flex transition-all duration-300 h-screen ${
        showNavbar
          ? sidebarCollapsed
            ? 'md:mr-0'
            : 'md:mr-64'
          : 'flex items-center justify-center'
      }`}
    >
      {showNavbar && <Navbar onSidebarCollapse={setSidebarCollapsed} />}

      <div className="container mx-auto md:px-10 md:py-3 lg:px-0 lg:w-[90%] xl:w-[85%] xxl:w-[1400px]">{privateRoutes()}</div>

      {publicRoutes()}

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
        /** VOICE AGENT CONVERSATION */
        <Route path="/voice-agent">
          <Route
            path=""
            element={
              <PrivateRoute>
                <VoiceAgentConversation />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/ai-tools">
          <Route
            path=""
            element={
              <PrivateRoute>
                <AiToolsFunctionTester />
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
        path="/processes"
        element={
          <PrivateRoute>
            <Status1 />
          </PrivateRoute>
        }
      />
      <Route path="crawl-url" element={<CrawlUrl />} />
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
      {/* Instruction Routes */}
      <Route path="/instructions">
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
      {/* Widget  */}
      <Route
        path="widget/chat"
        element={
          <PrivateRoute>
            <ChatBoxPreview />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function publicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

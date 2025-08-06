import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Chat from "./components/Chat/Chat";
import CrawlUrl from "./components/Chat/CrawlUrl";
import {
  Document,
  DocumentIndex,
  DomainIndex,
  EditDocument,
} from "./components/Chat/Document";
import CreateInstruction from "./components/Chat/Instruction/CreateInstruction";
import EditInstruction from "./components/Chat/Instruction/EditInstruction";
import InstructionIndex from "./components/Chat/Instruction/InstructionIndex";
import Status1 from "./components/Chat/Status";
import Wizard from "./components/Chat/Wizard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Workflow from "./components/Workflow/WorkflowIndex";
import WorkflowEditor from "./components/Workflow/editor/WorkflowEditor";
import { AuthProvider } from "./contexts/AuthContext";
import { VoiceAgentProvider } from "./contexts/VoiceAgentContext";
import VoiceAgentConversation from "./pages/VoiceAgentConversation";
import { VoiceAgentProvider } from "./contexts/VoiceAgentContext";

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
  const showNavbar = location.pathname !== "/login";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [appVersion, setAppVersion] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const res = await getVersion();
        setAppVersion(res.version);
      } catch (err) {
        setAppVersion("undefined");
      }
    };

    fetchVersion();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showNavbar && <Navbar onSidebarCollapse={setSidebarCollapsed} />}

      <div
        className={`transition-all duration-300 ${
          showNavbar
            ? sidebarCollapsed
              ? "md:mr-0"
              : "md:mr-64"
            : "flex items-center justify-center"
        }`}
      >
        {privateRoutes()}
      </div>

      <div className="flex items-center justify-center">{publicRoutes()}</div>

      <span className="text-sm fixed bottom-[2px] left-1">
        نسخه : {appVersion}
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
                <Chat />
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
      </Route>
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
          <Route path="" element={<Navigate to="domains" />} />
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
    </Routes>
  );
}

function publicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import AskPage from './pages/AskPage';
import ToolkitPage from './pages/ToolkitPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import GuidesPage from './pages/GuidesPage';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-ink-bg text-slate-200 lg:flex-row">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ask" element={<AskPage />} />
              <Route path="/toolkit" element={<ToolkitPage />} />
              <Route path="/diagnostics" element={<DiagnosticsPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Old routes kept working, mapped to the consolidated pages */}
              <Route path="/commands" element={<Navigate to="/toolkit" replace />} />
              <Route path="/windows" element={<Navigate to="/toolkit?category=windows" replace />} />
              <Route path="/networking" element={<Navigate to="/toolkit?category=networking" replace />} />
              <Route path="/hardware" element={<Navigate to="/toolkit?category=hardware" replace />} />
              <Route path="/security" element={<Navigate to="/toolkit?category=security" replace />} />
              <Route path="/server" element={<Navigate to="/toolkit?category=windows-server" replace />} />
              <Route path="/linux" element={<Navigate to="/toolkit?category=linux" replace />} />
              <Route path="/printers" element={<Navigate to="/toolkit?category=printers" replace />} />
              <Route path="/troubleshooting" element={<Navigate to="/guides" replace />} />
              <Route path="/pc-info" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/performance" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/quick-scan" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/privacy" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/vulnerabilities" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/app-scanner" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/malware-removal" element={<Navigate to="/diagnostics" replace />} />
              <Route path="/customers" element={<Navigate to="/" replace />} />
              <Route path="/tickets" element={<Navigate to="/" replace />} />
              <Route path="/repairs" element={<Navigate to="/" replace />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

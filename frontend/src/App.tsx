import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import RouteGuard from './components/shared/RouteGuard';
import AdminLayout from './components/layout/AdminLayout';
import ContestantLayout from './components/layout/ContestantLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import CompetitionListPage from './pages/admin/competitions/CompetitionListPage';
import CompetitionFormPage from './pages/admin/competitions/CompetitionFormPage';
import CompetitionDetailPage from './pages/admin/competitions/CompetitionDetailPage';
import DayFormPage from './pages/admin/days/DayFormPage';
import QuestionBuilderPage from './pages/admin/questions/QuestionBuilderPage';
import ManualGradingPage from './pages/admin/grading/ManualGradingPage';
import LeaderboardPage from './pages/admin/leaderboard/LeaderboardPage';

// Contestant Pages
import CompetitionBrowserPage from './pages/contestant/CompetitionBrowserPage';
import CompetitionDayPage from './pages/contestant/CompetitionDayPage';
import SubmissionPage from './pages/contestant/SubmissionPage';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Guarded Routes */}
            <Route element={<RouteGuard role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="competitions" element={<CompetitionListPage />} />
                <Route path="competitions/new" element={<CompetitionFormPage />} />
                <Route path="competitions/:id/edit" element={<CompetitionFormPage />} />
                <Route path="competitions/:id" element={<CompetitionDetailPage />} />
                <Route path="competitions/:competitionId/days/new" element={<DayFormPage />} />
                <Route path="competitions/:competitionId/days/:dayId/edit" element={<DayFormPage />} />
                <Route path="competitions/:competitionId/days/:dayId/questions/new" element={<QuestionBuilderPage />} />
                <Route path="competitions/:competitionId/questions/:questionId/edit" element={<QuestionBuilderPage />} />
                <Route path="grading" element={<ManualGradingPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
              </Route>
            </Route>

            {/* Contestant Guarded Routes */}
            <Route element={<RouteGuard role="contestant" />}>
              <Route path="/competitions" element={<ContestantLayout />}>
                <Route index element={<CompetitionBrowserPage />} />
                <Route path=":competitionId/days" element={<CompetitionDayPage />} />
                <Route path=":competitionId/days/:dayId/submit" element={<SubmissionPage />} />
              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

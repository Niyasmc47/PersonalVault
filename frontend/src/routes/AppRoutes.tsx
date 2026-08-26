import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import OAuth2CallbackPage from '../features/auth/pages/OAuth2CallbackPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

import MainLayout from '../layouts/MainLayout';
import HomePage from '../features/dashboard/pages/HomePage';
import VaultPage from '../features/vault/pages/VaultPage';
import ExpensesPage from '../features/expenses/pages/ExpensesPage';
import SkillsPage from '../features/skills/pages/SkillsPage';
import ProjectsPage from '../features/projects/pages/ProjectsPage';
import AchievementsPage from '../features/achievements/pages/AchievementsPage';
import CertificatesPage from '../features/certificates/pages/CertificatesPage';
import SocialPage from '../features/social/pages/SocialPage';
import ResumePage from '../features/resume/pages/ResumePage';

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading Application...</div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/resume" element={<ResumePage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

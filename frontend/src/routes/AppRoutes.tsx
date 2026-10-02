import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import OAuth2CallbackPage from '../pages/OAuth2CallbackPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import VaultPage from '../pages/VaultPage';
import ExpensesPage from '../pages/ExpensesPage';
import SkillsPage from '../pages/SkillsPage';
import ProjectsPage from '../pages/ProjectsPage';
import AchievementsPage from '../pages/AchievementsPage';
import CertificatesPage from '../pages/CertificatesPage';
import SocialPage from '../pages/SocialPage';
import ResumePage from '../pages/ResumePage';

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

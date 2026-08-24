import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCourses from './pages/ManageCourses';
import ManageAssets from './pages/ManageAssets';
import ManagePortfolios from './pages/ManagePortfolios';
import ViewInquiries from './pages/ViewInquiries';
import ManageEditing from './pages/ManageEditing';
import ManageLiveChat from './pages/ManageLiveChat';
import ManageContactNewsletter from './pages/ManageContactNewsletter';
import ManageHomeVideo from './pages/ManageHomeVideo';
import SimulatePayment from './pages/SimulatePayment';
import AdminLogin from './pages/AdminLogin';
import FloatingChatWidget from './components/FloatingChatWidget';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/users" element={<ManageUsers />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/courses" element={<ManageCourses />} />
      <Route path="/admin/courses" element={<ManageCourses />} />
      <Route path="/assets" element={<ManageAssets />} />
      <Route path="/admin/assets" element={<ManageAssets />} />
      <Route path="/portfolios" element={<ManagePortfolios />} />
      <Route path="/admin/portfolios" element={<ManagePortfolios />} />
      <Route path="/inquiries" element={<ViewInquiries />} />
      <Route path="/admin/inquiries" element={<ViewInquiries />} />
      <Route path="/editing" element={<ManageEditing />} />
      <Route path="/admin/editing" element={<ManageEditing />} />
      <Route path="/chat" element={<ManageLiveChat />} />
      <Route path="/admin/chat" element={<ManageLiveChat />} />
      <Route path="/contact-newsletter" element={<ManageContactNewsletter />} />
      <Route path="/admin/contact-newsletter" element={<ManageContactNewsletter />} />
      <Route path="/home-video" element={<ManageHomeVideo />} />
      <Route path="/admin/home-video" element={<ManageHomeVideo />} />
      <Route path="/payment-simulate" element={<SimulatePayment />} />
      <Route path="/admin/payment-simulate" element={<SimulatePayment />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

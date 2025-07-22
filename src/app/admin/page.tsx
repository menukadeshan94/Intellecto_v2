'use client';

import React, { useState } from 'react';
import {
  Home,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import UserwithDarkMode from '../../../components/UserwithDarkMode/UserwithDarkMode';

interface User {
  firstName?: string;
  email?: string;
}

interface AdminDashboardProps {
  user?: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'categories', label: 'Categories', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  /* ---------- Sidebar ---------- */
  const Sidebar: React.FC = () => (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border shadow-lg md:w-72 flex-shrink-0 hidden md:block">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">Intelleto Admin</h2>
      </div>
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-muted/30 hover:text-foreground'
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className="w-6 h-6 mr-3" aria-hidden="true" />
              <span className="text-base font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  /* ---------- Mobile Sidebar ---------- */
  const MobileSidebar: React.FC = () => (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: isSidebarOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border shadow-lg z-30 md:hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">Intelleto Admin</h2>
        <button
          className="p-2 rounded-full hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6 text-sidebar-foreground" />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-muted/30 hover:text-foreground'
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className="w-6 h-6 mr-3" aria-hidden="true" />
              <span className="text-base font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );

  /* ---------- Top bar ---------- */
  const TopBar: React.FC = () => (
    <header className="bg-card border-b border-muted px-6 py-4 shadow-lg sticky top-0 z-20">
      <div className="flex items-center max-w-7xl mx-auto">
        <div className="flex items-center justify-between w-full space-x-6">
          <button
            className="md:hidden p-2 rounded-full hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground hidden md:block">
            Admin Dashboard
          </h1>
          <UserwithDarkMode />
        </div>
      </div>
    </header>
  );

  /* ---------- Overview ---------- */
  const OverviewContent: React.FC = () => (
    <div className="space-y-10 max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
      {/* Welcome / hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl border border-muted p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome, {user?.firstName || 'Admin'}!
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Streamline your quiz platform management with this powerful dashboard.
        </p>
      </motion.div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Total Users', 'Active Quizzes', 'Completions', 'Average Score'].map(
          (label) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-xl border border-muted p-6 hover:shadow-lg transition-all duration-300 group"
              role="region"
              aria-label={`${label} statistics`}
            >
              <div className="text-sm font-medium text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
                {label}
              </div>
              <div className="text-3xl font-bold text-foreground">-</div>
            </motion.div>
          ),
        )}
      </div>

      {/* Quick-action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create quiz */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => router.push('/admin/categories')}
          className="bg-card rounded-xl border border-muted p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Create new quiz"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
              <Plus className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-foreground">Create Quiz</h4>
              <p className="text-base text-muted-foreground group-hover:text-foreground transition-colors">
                Design new quizzes to engage users
              </p>
            </div>
          </div>
        </motion.button>

        {/* Manage users */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={() => router.push('/admin/users')}
          className="bg-card rounded-xl border border-muted p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Manage users"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
              <Users className="w-6 h-6 text-secondary-foreground" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-foreground">Manage Users</h4>
              <p className="text-base text-muted-foreground group-hover:text-foreground transition-colors">
                Oversee user accounts and permissions
              </p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );

  /* ---------- Empty state template ---------- */
  const EmptyState: React.FC<{
    title: string;
    description: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = ({ title, description, icon: Icon, url }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl border border-muted p-10 text-center shadow-md hover:shadow-lg transition-shadow duration-300 max-w-2xl mx-auto"
    >
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-4">{title}</h3>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        {description}
      </p>
      <button
        onClick={() => router.push(url)}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Get started with ${title}`}
      >
        Get Started
      </button>
    </motion.div>
  );

  /* ---------- View router ---------- */
  const renderContent = (): React.ReactNode => {
    switch (activeView) {
      case 'overview':
        return <OverviewContent />;
      case 'categories':
        return (
          <EmptyState
            title="Category Management"
            description="Organize and create quiz categories to enhance content structure"
            icon={BookOpen}
            url="/admin/categories"
          />
        );
      case 'users':
        return (
          <EmptyState
            title="User Management"
            description="Manage user accounts and configure their permissions"
            icon={Users}
            url="/admin/users"
          />
        );
      case 'analytics':
        return (
          <EmptyState
            title="Analytics"
            description="Explore detailed insights and performance metrics"
            icon={BarChart3}
            url="/admin/analytics"
          />
        );
      case 'settings':
        return (
          <EmptyState
            title="Settings"
            description="Customize application preferences and configurations"
            icon={Settings}
            url="/admin/settings"
          />
        );
      default:
        return <OverviewContent />;
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="h-screen bg-background flex">
      {/* Desktop Sidebar - Always visible on md+ screens */}
      <Sidebar />
      
      {/* Mobile Sidebar - Animated overlay for mobile */}
      <MobileSidebar />
      
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black md:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
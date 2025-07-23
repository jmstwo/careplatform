import React from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPath, 
  onNavigate 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
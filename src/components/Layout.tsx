
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import TaskGrid from './TaskGrid';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
        <Sidebar />
        <TaskGrid />
      </div>
    </div>
  );
};

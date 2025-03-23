
import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-b dark:from-cronoz-black dark:to-cronoz-black-light flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 dark:bg-cronoz-black/95 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <Navbar />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-24 animate-fade-in">
        {title && (
          <div className="mb-6">
            <div className="inline-block rounded-full bg-cronoz-green/10 px-3 py-1 text-xs font-medium text-cronoz-green-dark mb-2 animate-slide-in">
              Cronoz
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cronoz-green to-cronoz-green-dark bg-clip-text text-transparent">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;

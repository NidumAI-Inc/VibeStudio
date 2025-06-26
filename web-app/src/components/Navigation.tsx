
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LogoSection from "./navigation/LogoSection";
import ProjectControls from "./navigation/ProjectControls";
import NavigationMenu from "./navigation/NavigationMenu";
import UserMenu from "./navigation/UserMenu";
import MobileMenu from "./navigation/MobileMenu";
import ServerStatusIndicator from "./ServerStatusIndicator";

interface NavigationProps {
  projectName?: string;
  onProjectNameUpdate?: (newName: string) => void;
  // Developer Mode props
  showFileExplorer?: boolean;
  onToggleFileExplorer?: () => void;
  streamId?: string | null;
  isStreaming?: boolean;
}

const Navigation = ({ 
  projectName, 
  onProjectNameUpdate,
  showFileExplorer,
  onToggleFileExplorer,
  streamId,
  isStreaming
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isProjectView = location.pathname.includes('/project');
  const isSettingsPage = location.pathname === '/settings';
  const isSystemPromptPage = location.pathname === '/system-prompt';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo, BETA, and Project controls */}
          <div className="flex items-center space-x-4">
            <LogoSection />
            
            {/* Project controls */}
            {isProjectView && (
              <ProjectControls 
                projectName={projectName}
                onProjectNameUpdate={onProjectNameUpdate}
                isStreaming={isStreaming}
              />
            )}
          </div>

          {/* Right side - Server Status, Navigation and Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Server Status - show for all authenticated pages */}
            {(isDashboard || isProjectView || isSettingsPage || isSystemPromptPage) && (
              <ServerStatusIndicator />
            )}
            
            {!isDashboard && !isProjectView && !isSettingsPage && !isSystemPromptPage && <NavigationMenu />}
            <UserMenu 
              isDashboard={isDashboard || isSystemPromptPage} 
              isProjectView={isProjectView}
              showFileExplorer={showFileExplorer}
              onToggleFileExplorer={onToggleFileExplorer}
              streamId={streamId}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <MobileMenu isDashboard={isDashboard || isSystemPromptPage} isProjectView={isProjectView} />
        )}
      </div>
    </nav>
  );
};

export default Navigation;

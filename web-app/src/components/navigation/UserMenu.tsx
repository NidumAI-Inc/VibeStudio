
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Wrench, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DeveloperModeToggle from "../DeveloperModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isDashboard: boolean;
  isProjectView: boolean;
  // Developer Mode props
  showFileExplorer?: boolean;
  onToggleFileExplorer?: () => void;
  streamId?: string | null;
}

const UserMenu = ({ 
  isDashboard, 
  isProjectView, 
  showFileExplorer, 
  onToggleFileExplorer, 
  streamId 
}: UserMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Check if we're on settings page
  const isSettingsPage = location.pathname === '/settings';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleAccountSettings = () => {
    navigate('/profile');
  };

  const handleProjectSettings = () => {
    navigate('/settings');
  };

  if (!isAuthenticated) {
    return (
      <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleGetStarted}>
        Get Started
      </Button>
    );
  }

  // Show dashboard-style navigation for both dashboard and settings pages
  if (isDashboard || isSettingsPage) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-gray-300 text-black hover:bg-gray-100">
            <User className="w-4 h-4 mr-2" />
            {user?.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-white border-gray-200 shadow-xl"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuItem 
            onClick={() => navigate('/system-prompt')}
            className="text-black hover:text-black hover:bg-gray-100 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            System Prompt
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleProjectSettings}
            className="text-black hover:text-black hover:bg-gray-100 cursor-pointer"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Project Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleAccountSettings}
            className="text-black hover:text-black hover:bg-gray-100 cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-black hover:text-black hover:bg-gray-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (isProjectView) {
    return (
      <div className="flex items-center space-x-3">
        {/* Developer Mode Toggle */}
        <DeveloperModeToggle
          showFileExplorer={showFileExplorer || false}
          onToggleFileExplorer={onToggleFileExplorer || (() => {})}
          streamId={streamId}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gray-300 text-black hover:bg-gray-100"
          onClick={handleProjectSettings}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gray-300 text-black hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return null;
};

export default UserMenu;

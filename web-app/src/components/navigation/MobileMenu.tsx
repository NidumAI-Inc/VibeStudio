
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ServerStatusIndicator from "../ServerStatusIndicator";

interface MobileMenuProps {
  isDashboard: boolean;
  isProjectView: boolean;
}

const MobileMenu = ({ isDashboard, isProjectView }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="md:hidden border-t border-gray-200 py-4">
      <div className="flex flex-col space-y-4">
        {/* Server Status */}
        <div className="px-2">
          <ServerStatusIndicator />
        </div>
        
        {isDashboard && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="justify-start text-black hover:text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="justify-start text-black hover:text-gray-700 hover:bg-gray-100"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
          </>
        )}
        
        {isProjectView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="justify-start text-black hover:text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="justify-start text-black hover:text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;

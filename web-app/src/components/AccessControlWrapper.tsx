
import React from 'react';
import { useAccessControl } from '@/hooks/useAccessControl';
import { Button } from '@/components/ui/button';
import { Settings, DollarSign, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessControlWrapperProps {
  userId?: string;
  children: React.ReactNode;
  requireChat?: boolean;
  requireFiles?: boolean;
  fallbackComponent?: React.ReactNode;
}

const AccessControlWrapper = ({ 
  userId, 
  children, 
  requireChat = false, 
  requireFiles = false,
  fallbackComponent 
}: AccessControlWrapperProps) => {
  const navigate = useNavigate();
  
  // Always call the hook - no conditional hook usage
  const { 
    isLoading, 
    hasApiSetup, 
    hasExceededBudget, 
    totalCost, 
    canChat, 
    canAccessFiles,
    recheckAccess 
  } = useAccessControl(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-500 rounded animate-pulse"></div>
            <span>Checking access permissions...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if access is denied based on requirements
  const accessDenied = (requireChat && !canChat) || (requireFiles && !canAccessFiles);

  if (accessDenied) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          
          {!hasApiSetup ? (
            <>
              <h3 className="text-xl font-semibold mb-2">API Setup Required</h3>
              <p className="text-gray-400 mb-4">
                Please configure your API credentials to access this feature.
              </p>
              <Button 
                onClick={() => navigate('/settings')}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Go to Settings
              </Button>
            </>
          ) : hasExceededBudget ? (
            <>
              <h3 className="text-xl font-semibold mb-2">Usage Limit Exceeded</h3>
              <p className="text-gray-400 mb-2">
                You've reached the $10.00 usage limit (${totalCost.toFixed(2)} used).
              </p>
              <p className="text-gray-400 mb-4">
                Chat functionality is currently disabled.
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={recheckAccess}
                  variant="outline"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Refresh Usage
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
              <p className="text-gray-400 mb-4">
                You don't have permission to access this feature.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessControlWrapper;

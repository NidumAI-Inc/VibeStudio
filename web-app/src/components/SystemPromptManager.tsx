
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Save, MessageSquare, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useSystemPrompt } from '@/hooks/useSystemPrompt';
import { useNavigate } from 'react-router-dom';

const SystemPromptManager = () => {
  const { systemPrompt, loading, updating, updatePrompt, refreshPrompt } = useSystemPrompt();
  const [editedPrompt, setEditedPrompt] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();

  // Update editedPrompt when systemPrompt loads/changes
  useEffect(() => {
    if (systemPrompt) {
      setEditedPrompt(systemPrompt);
      setHasChanges(false);
    }
  }, [systemPrompt]);

  const handlePromptChange = (value: string) => {
    setEditedPrompt(value);
    setHasChanges(value !== systemPrompt);
  };

  const handleSave = async () => {
    const success = await updatePrompt(editedPrompt);
    if (success) {
      setHasChanges(false);
    }
  };

  const handleRefresh = async () => {
    await refreshPrompt();
    // The useEffect will automatically update editedPrompt and hasChanges
  };

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmNavigation = window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving?"
      );
      if (!confirmNavigation) return;
    }
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-black">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded animate-pulse"></div>
              <span>Loading system prompt...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-black hover:text-blue-500 hover:bg-gray-100 mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-black">System Prompt Manager</h1>
              <p className="text-gray-600">Configure the AI assistant's behavior and personality</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={updating}
            className="border-gray-300 hover:bg-gray-100 text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Current System Prompt</CardTitle>
            <CardDescription className="text-gray-600">
              This prompt defines how the AI assistant behaves across all your projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={editedPrompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Enter your system prompt here..."
              className="min-h-[200px] bg-white border-gray-300 text-black placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500"
              disabled={updating}
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {editedPrompt.length} characters
                {hasChanges && (
                  <span className="ml-2 text-blue-500">• Unsaved changes</span>
                )}
              </div>
              
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updating}
                className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black text-lg">Tips for Writing System Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            {/* Warning about port */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Important: Port Configuration</h4>
                  <p className="text-sm text-yellow-700">
                    Do not change the port from 3455 in your system prompt or project settings. 
                    The preview functionality requires this specific port to work correctly.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-black">Examples:</h4>
              <ul className="space-y-1 text-sm">
                <li>• "You are a helpful coding mentor. Always encourage learning and curiosity!"</li>
                <li>• "You are a professional software architect focused on clean, maintainable code."</li>
                <li>• "You are a creative UI/UX designer who thinks outside the box."</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-black">Best Practices:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Be specific about the assistant's role and expertise</li>
                <li>• Include the tone and style you want (formal, casual, encouraging, etc.)</li>
                <li>• Mention any specific focus areas or constraints</li>
                <li>• Keep it concise but descriptive</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemPromptManager;

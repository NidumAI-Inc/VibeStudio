
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjectSetup } from "@/hooks/useProjectSetup";
import ProjectSetupHeader from "./setup/ProjectSetupHeader";
import AnthropicConfigCard from "./setup/AnthropicConfigCard";
import GitHubConfigCard from "./setup/GitHubConfigCard";
import ProjectSetupActions from "./setup/ProjectSetupActions";
import ProjectSetupLoading from "./setup/ProjectSetupLoading";

const ProjectSetup = () => {
  const navigate = useNavigate();
  const {
    credentials,
    loading,
    loadingEnv,
    hasUnsavedChanges,
    showPasswords,
    loadCredentials,
    handleSave,
    handleInputChange,
    togglePasswordVisibility,
  } = useProjectSetup();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loadingEnv) {
    return <ProjectSetupLoading />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="border-gray-300 hover:bg-gray-100 text-black bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <ProjectSetupHeader />

        {/* Configuration Cards */}
        <div className="space-y-8">
          <AnthropicConfigCard
            apiKey={credentials.ANTHROPIC_API_KEY}
            showPassword={showPasswords.ANTHROPIC_API_KEY}
            onInputChange={(value) => handleInputChange('ANTHROPIC_API_KEY', value)}
            onToggleVisibility={() => togglePasswordVisibility('ANTHROPIC_API_KEY')}
          />

          <GitHubConfigCard
            username={credentials.GITHUB_USERNAME}
            token={credentials.GITHUB_TOKEN}
            showPassword={showPasswords.GITHUB_TOKEN}
            onUsernameChange={(value) => handleInputChange('GITHUB_USERNAME', value)}
            onTokenChange={(value) => handleInputChange('GITHUB_TOKEN', value)}
            onToggleVisibility={() => togglePasswordVisibility('GITHUB_TOKEN')}
          />
        </div>

        {/* Action Buttons */}
        <ProjectSetupActions
          loading={loading}
          hasUnsavedChanges={hasUnsavedChanges}
          onRefresh={loadCredentials}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ProjectSetup;

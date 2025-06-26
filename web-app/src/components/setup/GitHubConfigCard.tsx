
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Eye, EyeOff } from "lucide-react";

interface GitHubConfigCardProps {
  username: string;
  token: string;
  showPassword: boolean;
  onUsernameChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onToggleVisibility: () => void;
}

const GitHubConfigCard = ({ 
  username, 
  token, 
  showPassword, 
  onUsernameChange, 
  onTokenChange, 
  onToggleVisibility 
}: GitHubConfigCardProps) => {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-black text-xl">GitHub Integration</CardTitle>
            <CardDescription className="text-gray-600">
              Configure GitHub for repository management and deployments
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="github-username" className="text-black font-medium mb-2 block">
            Username
          </Label>
          <Input
            id="github-username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="your-username"
            className="bg-white border-gray-300 text-black placeholder-gray-400 h-12 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <Label htmlFor="github-token" className="text-black font-medium mb-2 block">
            Personal Access Token
          </Label>
          <div className="relative">
            <Input
              id="github-token"
              type={showPassword ? "text" : "password"}
              value={token}
              onChange={(e) => onTokenChange(e.target.value)}
              placeholder="ghp_..."
              className="bg-white border-gray-300 text-black placeholder-gray-400 h-12 pr-12 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 hover:bg-gray-100"
              onClick={onToggleVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Generate a token at{' '}
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:text-blue-600 underline"
            >
              GitHub Settings
            </a>
            {' '}with repo permissions
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubConfigCard;

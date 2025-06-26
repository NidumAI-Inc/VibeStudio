
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Project } from "@/services/api";
import ProjectCard from "./ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  selectedProject: string | null;
  runningProject: string | null;
  onNewChat: () => void;
  onProjectSelect: (streamId: string) => void;
  onProjectChat: (streamId: string) => void;
  onProjectFiles: (streamId: string) => void;
  onProjectRun: (streamId: string) => void;
  onProjectStop: (streamId: string) => void;
  onProjectDelete: (streamId: string) => void;
}

const ProjectsGrid = ({
  projects,
  selectedProject,
  runningProject,
  onNewChat,
  onProjectSelect,
  onProjectChat,
  onProjectFiles,
  onProjectRun,
  onProjectStop,
  onProjectDelete
}: ProjectsGridProps) => {
  // Only show the projects grid if there are projects
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-blue-200/30 pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-black">Your Projects</h2>
          <p className="text-black">Manage your AI-powered development projects</p>
        </div>
        <Button
          onClick={onNewChat}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.stream_id}
            project={project}
            isSelected={selectedProject === project.stream_id}
            isRunning={runningProject === project.stream_id}
            onSelect={onProjectSelect}
            onChat={onProjectChat}
            onFiles={onProjectFiles}
            onRun={onProjectRun}
            onStop={onProjectStop}
            onDelete={onProjectDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;

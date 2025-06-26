
import { BASE_URL } from './config';

export class ProjectService {
  async getProjects() {
    const response = await fetch(`${BASE_URL}/projects`);
    return response.json();
  }

  async renameProject(streamId: string, projectName: string) {
    const response = await fetch(`${BASE_URL}/projects/${streamId}/rename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_name: projectName }),
    });
    return response.json();
  }

  async deleteProject(streamId: string) {
    const response = await fetch(`${BASE_URL}/projects/${streamId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export const projectService = new ProjectService();

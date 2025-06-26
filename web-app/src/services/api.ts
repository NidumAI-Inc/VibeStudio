/**
 * API Service Module
 *
 * This module provides a centralized interface for all API communications.
 * It re-exports individual service modules and provides a legacy unified API class.
 *
 * Architecture:
 * - Individual service modules for different API domains
 * - Legacy ApiService class for backward compatibility
 * - Centralized configuration and error handling
 * - Type-safe interfaces for all API calls
 *
 * Services included:
 * - Setup: Environment and credential management
 * - Chat: AI conversation handling
 * - Project: Project CRUD operations
 * - File: File system operations
 * - Session: Development server management
 * - Pricing: Cost tracking and budget management
 */

// Re-export types for backward compatibility
export * from './types'

// Re-export individual services for direct use
export { setupService } from './setupService'
export { chatService } from './chatService'
export { projectService } from './projectService'
export { fileService } from './fileService'
export { sessionService } from './sessionService'
export { pricingService } from './pricingService'

// Import services and types for the legacy unified class
import { setupService } from './setupService'
import { chatService } from './chatService'
import { projectService } from './projectService'
import { fileService } from './fileService'
import { sessionService } from './sessionService'
import { pricingService } from './pricingService'
import type { SetupCredentials, ChatStartRequest } from './types'

/**
 * Legacy ApiService Class
 *
 * This class provides a unified interface for all API operations.
 * It's maintained for backward compatibility with existing code.
 * New code should prefer using the individual service modules directly.
 */
class ApiService {
  // Setup and Environment Management Methods

  /**
   * Setup API credentials for external services
   */
  async setupCredentials(credentials: SetupCredentials) {
    return setupService.setupCredentials(credentials)
  }

  /**
   * Get current API credentials
   */
  async getSetupCredentials() {
    return setupService.getSetupCredentials()
  }

  /**
   * Update environment variables
   */
  async updateEnvironmentVariables(envVars: Record<string, string>) {
    return setupService.updateEnvironmentVariables(envVars)
  }

  /**
   * Get current environment variables
   */
  async getEnvironmentVariables() {
    return setupService.getEnvironmentVariables()
  }

  // Chat and AI Conversation Methods

  /**
   * Start a new chat session or continue existing one
   */
  async startChat(request: ChatStartRequest) {
    return chatService.startChat(request)
  }

  /**
   * Get the streaming URL for a chat session
   */
  getStreamUrl(streamId: string) {
    return chatService.getStreamUrl(streamId)
  }

  /**
   * Stop an active chat session
   */
  async stopChat(streamId: string) {
    return chatService.stopChat(streamId)
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(streamId: string) {
    return chatService.getChatHistory(streamId)
  }

  // Project Management Methods

  /**
   * Get list of all user projects
   */
  async getProjects() {
    return projectService.getProjects()
  }

  /**
   * Rename a project
   */
  async renameProject(streamId: string, projectName: string) {
    return projectService.renameProject(streamId, projectName)
  }

  /**
   * Delete a project
   */
  async deleteProject(streamId: string) {
    return projectService.deleteProject(streamId)
  }

  // File System Methods

  /**
   * List files in a directory
   */
  async listFiles(path = '/') {
    return fileService.listFiles(path)
  }

  /**
   * Read file contents
   */
  async readFile(path: string) {
    return fileService.readFile(path)
  }

  /**
   * Write content to a file
   */
  async writeFile(path: string, content: string) {
    return fileService.writeFile(path, content)
  }

  /**
   * Upload a file to the project
   */
  async uploadFile(file: File, destination: string) {
    return fileService.uploadFile(file, destination)
  }

  // Development Server Session Methods

  /**
   * Start the development server for a project
   */
  async runApp(streamId: string, script = 'dev', port = 3455) {
    return sessionService.runApp(streamId, script, port)
  }

  /**
   * Stop the development server
   */
  async killApp(streamId: string) {
    return sessionService.killApp(streamId)
  }

  /**
   * Get logs from the development server
   */
  async getSessionLogs(streamId: string, tail?: number) {
    return sessionService.getSessionLogs(streamId, tail)
  }

  // Pricing and Cost Management Methods

  /**
   * Update pricing/cost data for a user
   */
  async updatePricing(userId: string, costUsd: number, streamId: string, token: string) {
    return pricingService.updatePricing(userId, costUsd, streamId, token)
  }

  /**
   * Get total cost for a user
   */
  async getUserTotalCost(userId: string, token: string) {
    // console.log(userId)
    return pricingService.getUserTotalCost(userId, token)
  }

  /**
   * Get cost for a specific stream
   */
  async getStreamCost(streamId: string) {
    return pricingService.getStreamCost(streamId)
  }
}

// Export the unified API service instance for legacy compatibility
export const apiService = new ApiService()

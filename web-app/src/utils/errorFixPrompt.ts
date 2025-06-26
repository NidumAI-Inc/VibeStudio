
interface ErrorContext {
  install: string;
  runtime: string;
  streamId: string;
}

export const generateErrorFixPrompt = (errorContext: ErrorContext): string => {
  const { install, runtime, streamId } = errorContext;
  
  let prompt = `I'm experiencing errors in my project (Stream ID: ${streamId}). Please analyze and fix the following issues:\n\n`;
  
  if (install && install.trim()) {
    prompt += `**INSTALL LOG ERRORS:**\n\`\`\`\n${install}\n\`\`\`\n\n`;
  }
  
  if (runtime && runtime.trim()) {
    prompt += `**RUNTIME LOG ERRORS:**\n\`\`\`\n${runtime}\n\`\`\`\n\n`;
  }
  
  prompt += `Please:
1. Identify the root cause of these errors
2. Fix any configuration issues (package.json, dependencies, etc.)
3. Resolve any build or runtime problems
4. Ensure the project runs successfully

Focus on the most critical errors first and provide a working solution.`;

  return prompt;
};

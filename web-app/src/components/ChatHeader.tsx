
import { Bot } from "lucide-react";

interface ChatHeaderProps {
  currentStreamId: string | null;
  projectName?: string;
}

const ChatHeader = ({ currentStreamId, projectName }: ChatHeaderProps) => {
  if (!currentStreamId || !projectName) {
    return null;
  }

  return null;
};

export default ChatHeader;

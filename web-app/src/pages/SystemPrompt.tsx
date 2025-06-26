
import Navigation from "@/components/Navigation";
import SystemPromptManager from "@/components/SystemPromptManager";

const SystemPrompt = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <div className="pt-16">
        <main className="w-full py-8">
          <SystemPromptManager />
        </main>
      </div>
    </div>
  );
};

export default SystemPrompt;

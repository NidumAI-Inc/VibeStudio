
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const NavigationMenu = () => {
  return (
    <>
      <a href="#features" className="text-black hover:text-gray-700 transition-colors">
        Features
      </a>
      <a href="#pricing" className="text-black hover:text-gray-700 transition-colors">
        Pricing
      </a>
      <a href="#docs" className="text-black hover:text-gray-700 transition-colors">
        Docs
      </a>
      <Button variant="outline" size="sm" className="border-gray-300 text-black hover:bg-gray-100">
        <Github className="w-4 h-4 mr-2" />
        GitHub
      </Button>
    </>
  );
};

export default NavigationMenu;

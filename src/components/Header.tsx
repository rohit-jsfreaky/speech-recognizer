import { Bot, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-center items-center h-[12%] bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <Bot className="h-7 w-7 text-white" />
        <h1 className="text-2xl font-medium tracking-tight">
        Ask the AI  
        </h1>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          BETA
        </span>
      </div>
    </div>
  );
};

export default Header;
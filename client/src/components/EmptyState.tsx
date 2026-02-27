import { FileSearch } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200"
    >
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600">
        <FileSearch className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">{title}</h3>
      <p className="text-slate-500 max-w-sm">{description}</p>
    </motion.div>
  );
}

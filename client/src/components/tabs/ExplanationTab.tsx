import { motion } from "framer-motion";
import { BookOpen, Languages, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrescriptionContext } from "@/context/PrescriptionContext";
import { EmptyState } from "@/components/EmptyState";

export function ExplanationTab() {
  const { parsedData } = usePrescriptionContext();

  if (!parsedData) {
    return (
      <EmptyState 
        title="No Explanations Yet" 
        description="Please parse a prescription first to view the multilingual explanations and safety notes." 
      />
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <motion.div variants={item}>
        <Card className="h-full shadow-lg border-0 shadow-slate-200/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-display text-slate-800">Simplified Explanation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">
              {parsedData.simplified_explanation || "No explanation provided."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="h-full shadow-lg border-0 shadow-slate-200/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-display text-slate-800">Vernacular Translation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed font-medium">
              {parsedData.vernacular_translation || "No translation provided."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
        <Card className="h-full shadow-lg border-0 shadow-amber-200/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-amber-50/30">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-display text-slate-800">Safety Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed font-medium">
              {parsedData.safety_notes || "No critical safety notes provided."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

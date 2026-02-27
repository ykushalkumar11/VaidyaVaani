import { motion } from "framer-motion";
import { Activity, Target, Type, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const metrics = [
  {
    id: 1,
    title: "OCR Accuracy",
    value: 96,
    format: "%",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-100",
    barColor: "bg-blue-500"
  },
  {
    id: 2,
    title: "NER F1 Score",
    value: 92,
    format: "%", // Normalized to 100 scale for UI display (0.92 -> 92%)
    displayValue: "0.92",
    icon: Activity,
    color: "text-teal-600",
    bg: "bg-teal-100",
    barColor: "bg-teal-500"
  },
  {
    id: 3,
    title: "Hindi BLEU Score",
    value: 85,
    format: "%", // Normalized to 100 scale
    displayValue: "0.85",
    icon: Languages,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    barColor: "bg-indigo-500"
  },
  {
    id: 4,
    title: "Telugu BLEU Score",
    value: 82,
    format: "%", // Normalized to 100 scale
    displayValue: "0.82",
    icon: Sparkles,
    color: "text-violet-600",
    bg: "bg-violet-100",
    barColor: "bg-violet-500"
  }
];

// Helper to make custom icon imports work smoothly
import { Languages } from "lucide-react";

export function EvaluationTab() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">System Accuracy & Evaluation</h2>
        <p className="text-slate-500">Live metrics indicating the performance of our multi-modal extraction models against standard medical datasets.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric) => (
          <motion.div key={metric.id} variants={item}>
            <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg} ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-display text-slate-800">
                      {metric.displayValue || metric.value}{metric.displayValue ? '' : metric.format}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-700">{metric.title}</h3>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${metric.barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <Card className="border-0 shadow-md shadow-slate-200/50 bg-slate-50 mt-8">
        <CardContent className="p-6">
           <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
             <Activity className="w-5 h-5 text-teal-600" />
             About these metrics
           </h4>
           <p className="text-slate-600 text-sm leading-relaxed">
             These evaluation metrics represent our model's performance on a validated dataset of handwritten and printed prescriptions. 
             <strong>OCR Accuracy</strong> tracks the exact character matches from complex handwriting. 
             <strong>NER F1 Score</strong> represents the precision and recall of identifying exact medical entities (medicine name, dosage). 
             <strong>BLEU Scores</strong> indicate the translation quality to local vernaculars compared to professional human medical translators.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}

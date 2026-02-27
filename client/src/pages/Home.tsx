import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParserTab } from "@/components/tabs/ParserTab";
import { ExplanationTab } from "@/components/tabs/ExplanationTab";
import { VoiceTab } from "@/components/tabs/VoiceTab";
import { MedicineTrackerTab } from "@/components/tabs/MedicineTrackerTab";
import { PrescriptionProvider } from "@/context/PrescriptionContext";
import { Stethoscope, ClipboardList, Globe2, Volume2, Pill } from "lucide-react";

export default function Home() {
  return (
    <PrescriptionProvider>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-teal-500 p-2 rounded-lg text-white shadow-md shadow-teal-500/20">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-slate-900 leading-tight">
                    Vaidya<span className="text-teal-600">Vaani</span>
                  </h1>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">Intelligent Prescription Parser</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="parser" className="w-full space-y-8">
            
            <div className="flex justify-center md:justify-start">
              <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto flex-wrap sm:flex-nowrap">
                <TabsTrigger 
                  value="parser" 
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 flex items-center gap-2 font-medium"
                >
                  <ClipboardList className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Parser</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="explanation" 
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 flex items-center gap-2 font-medium"
                >
                  <Globe2 className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Explanation</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="voice" 
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 flex items-center gap-2 font-medium"
                >
                  <Volume2 className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Voice Output</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="tracker" 
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 flex items-center gap-2 font-medium"
                >
                  <Pill className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Medicine Tracker</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-8">
              <TabsContent value="parser" className="focus-visible:outline-none">
                <ParserTab />
              </TabsContent>

              <TabsContent value="explanation" className="focus-visible:outline-none">
                <ExplanationTab />
              </TabsContent>

              <TabsContent value="voice" className="focus-visible:outline-none">
                <VoiceTab />
              </TabsContent>

              <TabsContent value="tracker" className="focus-visible:outline-none">
                <MedicineTrackerTab />
              </TabsContent>
            </div>
            
          </Tabs>
        </main>
      </div>
    </PrescriptionProvider>
  );
}


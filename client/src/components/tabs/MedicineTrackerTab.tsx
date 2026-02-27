import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Plus, Save, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export function MedicineTrackerTab() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [servings, setServings] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: medicines, isLoading } = useQuery<any[]>({
    queryKey: ["/api/medicine-images"],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name || !servings || !image) {
      toast({
        title: "Missing fields",
        description: "Please provide a name, servings, and an image.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/medicine-images", {
        name,
        servings,
        imageUrl: image,
      });
      
      toast({
        title: "Saved",
        description: "Medicine details saved successfully.",
      });
      
      setName("");
      setServings("");
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-images"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save medicine details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Medicine Tracker</h2>
        <p className="text-slate-500">Upload images of your prescribed medicines and record their serving instructions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-600" />
              Add New Medicine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="med-name">Medicine Name</Label>
              <Input 
                id="med-name" 
                placeholder="e.g. Paracetamol 500mg" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings / Instructions</Label>
              <Input 
                id="servings" 
                placeholder="e.g. 1 tablet after food" 
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Medicine Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                />
                {image ? (
                  <img src={image} alt="Preview" className="max-h-48 rounded-lg" />
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Click to upload photo</span>
                  </>
                )}
              </div>
            </div>
            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white" 
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Medicine Details"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Your Medicines
          </h3>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl" />
              ))}
            </div>
          ) : medicines?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
              <p className="text-slate-500 text-sm">No medicines saved yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {medicines?.map((med: any) => (
                <Card key={med.id} className="border-0 shadow-sm overflow-hidden flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    <img src={med.imageUrl} alt={med.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4 flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800">{med.name}</h4>
                    <p className="text-slate-600 text-sm">{med.servings}</p>
                    <p className="text-slate-400 text-[10px] mt-2 italic">
                      Saved on {new Date(med.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

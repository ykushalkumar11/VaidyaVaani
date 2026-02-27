import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePrescriptionContext } from "@/context/PrescriptionContext";
import { useParsePrescription } from "@/hooks/use-prescriptions";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";

export function ParserTab() {
  const { image, setImage, language, setLanguage, parsedData, setParsedData } = usePrescriptionContext();
  const { mutate: parsePrescription, isPending } = useParsePrescription();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1
  });

  const handleParse = () => {
    if (!image) return;
    
    parsePrescription(
      { image, language },
      {
        onSuccess: (data) => {
          setParsedData(data);
          toast({
            title: "Prescription Parsed!",
            description: "Successfully extracted medicines and translations.",
          });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Parsing Failed",
            description: err.message,
          });
        }
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN - UPLOAD & CONTROLS */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="shadow-lg border-0 shadow-slate-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display text-slate-800">Upload Prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`
                relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'}
                ${image ? 'p-2' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {image ? (
                <div className="relative rounded-lg overflow-hidden group">
                  <img src={image} alt="Prescription" className="w-full h-auto object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white font-medium flex items-center gap-2">
                      <UploadCloud className="w-5 h-5" /> Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Drag & drop your file here</p>
                    <p className="text-sm text-slate-500 mt-1">or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Languages className="w-4 h-4 text-teal-600" /> Target Language
              </label>
              <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-teal-500/20 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
              onClick={handleParse}
              disabled={!image || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Image...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-5 w-5" /> Parse Prescription
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN - RESULTS */}
      <div className="lg:col-span-8">
        {!parsedData ? (
          <EmptyState 
            title="Awaiting Prescription" 
            description="Upload an image and hit parse to extract the medicines, dosages, and instructions." 
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="shadow-lg border-0 shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-teal-50/50 border-b border-teal-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl font-display text-slate-800">Extracted Medicines</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">Medicine Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Strength</TableHead>
                      <TableHead className="font-semibold text-slate-700">Dosage</TableHead>
                      <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                      <TableHead className="font-semibold text-slate-700">Instructions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.parsed_medicines.map((med, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium text-slate-900">{med.medicine_name}</TableCell>
                        <TableCell className="text-slate-600">{med.strength}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {med.dosage_frequency}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">{med.duration}</TableCell>
                        <TableCell className="text-slate-600">{med.instructions}</TableCell>
                      </TableRow>
                    ))}
                    {parsedData.parsed_medicines.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                          No medicines detected in this image.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

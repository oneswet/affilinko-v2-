
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AdminPlaceholderProps {
    title: string;
    description?: string;
}

const AdminModulePlaceholder = ({ title, description = "This module is currently under development." }: AdminPlaceholderProps) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-xl bg-white/50 backdrop-blur-xl border-white/20">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                            <Construction className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <p className="text-slate-500">
                            {description} We are working hard to bring you these advanced features. Stay tuned for updates!
                        </p>

                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 text-sm text-indigo-700">
                            <strong>Feature Status:</strong> Planned for Q3 2024
                        </div>

                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
                            Notify Me When Ready <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminModulePlaceholder;

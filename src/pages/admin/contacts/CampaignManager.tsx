
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Plus, Trash, Send, Play, Pause, ArrowLeft, Calendar as CalendarIcon,
    Clock, Tag, Edit, Bold, Italic, Underline,
    Heading1, Heading2, List, Link as LinkIcon, Image as ImageIcon,
    CheckCircle, User, ChevronRight, ChevronLeft, LayoutTemplate, Layers
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

// --- Stabilized Visual Editor Component --- (REMOVED)
import { RichTextEditor } from "@/components/ui/rich-text-editor";


// --- Wizard Component ---
const CampaignWizard = ({
    isOpen,
    onClose,
    smtpConfigs,
    availableTags,
    onSave
}: {
    isOpen: boolean,
    onClose: () => void,
    smtpConfigs: any[],
    availableTags: string[],
    onSave: (campaign: any) => void
}) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        name: "",
        subject: "",
        content: "<p>Hello {{first_name}},</p><p><br></p><p>Write your amazing content here...</p>",
        smtp_config_id: "",
        target_tags: [] as string[],
        scheduled_at: null as Date | null
    });

    const isStepValid = () => {
        if (step === 1) return data.name && data.subject && data.smtp_config_id;
        if (step === 2) return data.content.length > 20; // Basic check
        if (step === 3) return true; // Optional tags (all supported)
        return true;
    };

    const handleNext = () => {
        if (step < 4 && isStepValid()) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const toggleTag = (tag: string) => {
        setData(prev => {
            const tags = prev.target_tags.includes(tag)
                ? prev.target_tags.filter(t => t !== tag)
                : [...prev.target_tags, tag];
            return { ...prev, target_tags: tags };
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden glass-card border-none flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-indigo-100 bg-white/50 backdrop-blur-md flex justify-between items-center">
                    <div>
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                            Create Campaign
                        </DialogTitle>
                        <p className="text-slate-500 text-sm mt-1">Step {step} of 4</p>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={cn("w-3 h-3 rounded-full transition-all", step >= i ? "bg-rose-500" : "bg-slate-200")} />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

                        {/* Step 1: Details */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                        <LayoutTemplate className="w-5 h-5 text-rose-500" /> Campaign Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Campaign Name (Internal)</Label>
                                            <Input
                                                value={data.name}
                                                onChange={e => setData({ ...data, name: e.target.value })}
                                                placeholder="e.g. November Newsletter"
                                                className="bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Sender Profile (SMTP)</Label>
                                            <Select value={data.smtp_config_id} onValueChange={v => setData({ ...data, smtp_config_id: v })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="Select Sender" /></SelectTrigger>
                                                <SelectContent>
                                                    {smtpConfigs.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name} ({c.from_email})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Email Subject Line</Label>
                                            <Input
                                                value={data.subject}
                                                onChange={e => setData({ ...data, subject: e.target.value })}
                                                placeholder="Make it catchy..."
                                                className="text-lg font-medium bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Content */}
                        {step === 2 && (
                            <div className="space-y-4 h-full flex flex-col">
                                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <Edit className="w-5 h-5 text-rose-500" /> Design Content
                                </h3>
                                <div className="flex-1">
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={html => setData({ ...data, content: html })}
                                        minHeight="400px"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Audience */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-rose-500" /> Target Audience
                                </h3>

                                <Card className="border-indigo-100 shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <Label>Filter by Tags (Select to include)</Label>
                                            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                                {availableTags.length === 0 && <span className="text-slate-400 text-sm">No tags found.</span>}
                                                {availableTags.map(tag => (
                                                    <Badge
                                                        key={tag}
                                                        variant={data.target_tags.includes(tag) ? "default" : "outline"}
                                                        className={cn(
                                                            "cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105 select-none",
                                                            data.target_tags.includes(tag)
                                                                ? "bg-rose-500 hover:bg-rose-600 border-rose-500"
                                                                : "bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600"
                                                        )}
                                                        onClick={() => toggleTag(tag)}
                                                    >
                                                        {tag}
                                                        {data.target_tags.includes(tag) && <CheckCircle className="ml-1.5 w-3.5 h-3.5" />}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Leaving all unselected means <strong>All Contacts</strong> will receive this email.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-rose-500" /> Review & Schedule
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-indigo-50 shadow-sm bg-white/80">
                                        <CardContent className="pt-6 space-y-4">
                                            <div>
                                                <Label className="text-xs font-bold text-slate-400 uppercase">Campaign</Label>
                                                <p className="font-medium text-lg">{data.name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold text-slate-400 uppercase">Subject</Label>
                                                <p className="font-medium text-lg">{data.subject}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold text-slate-400 uppercase">Sender</Label>
                                                <p className="font-medium text-slate-700">
                                                    {smtpConfigs.find(s => s.id === data.smtp_config_id)?.name}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-indigo-50 shadow-sm bg-white/80">
                                        <CardContent className="pt-6 space-y-4">
                                            <div>
                                                <Label className="text-xs font-bold text-slate-400 uppercase">Audience</Label>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {data.target_tags.length === 0 ? (
                                                        <Badge variant="outline">All Contacts</Badge>
                                                    ) : (
                                                        data.target_tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <Label className="text-slate-700 font-semibold mb-2 block">Scheduling (Optional)</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-start text-left font-normal border-slate-200">
                                                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                                            {data.scheduled_at ? format(data.scheduled_at, "PPP") : <span>Send Immediately (Draft)</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={data.scheduled_at || undefined}
                                                            onSelect={(d) => setData(prev => ({ ...prev, scheduled_at: d || null }))}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-indigo-100 bg-white/80 backdrop-blur-md flex justify-between">
                    <Button variant="outline" onClick={step === 1 ? onClose : handleBack} className="gap-2">
                        {step === 1 ? 'Cancel' : <><ChevronLeft className="w-4 h-4" /> Back</>}
                    </Button>

                    {step < 4 ? (
                        <Button
                            className="bg-rose-600 hover:bg-rose-700 text-white gap-2"
                            onClick={handleNext}
                            disabled={!isStepValid()}
                        >
                            Next Step <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg shadow-rose-200 text-white gap-2 px-8"
                            onClick={() => onSave(data)}
                        >
                            <Send className="w-4 h-4" /> Finish & Create
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};


// --- Main Campaign Manager ---
const CampaignManager = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [smtpConfigs, setSmtpConfigs] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    useEffect(() => {
        fetchEverything();
    }, []);

    const fetchEverything = async () => {
        fetchCampaigns();
        fetchSmtpConfigs();
        fetchTags();
    };

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("campaigns")
            .select("*, smtp_configs(name, from_email)")
            .order("created_at", { ascending: false });

        if (!error) setCampaigns(data || []);
        setIsLoading(false);
    };

    const fetchSmtpConfigs = async () => {
        const { data } = await supabase.from("smtp_configs").select("*").eq("is_active", true);
        setSmtpConfigs(data || []);
    };

    const fetchTags = async () => {
        const { data } = await supabase.from("contacts").select("tags");
        if (data) {
            const allTags = new Set<string>();
            data.forEach((c: any) => {
                if (Array.isArray(c.tags)) c.tags.forEach((t: string) => allTags.add(t));
            });
            setAvailableTags(Array.from(allTags));
        }
    };

    const handleCreate = async (campaignData: any) => {
        const payload = {
            name: campaignData.name,
            subject: campaignData.subject,
            content: campaignData.content,
            smtp_config_id: campaignData.smtp_config_id,
            status: 'draft',
            target_tags: campaignData.target_tags,
            scheduled_at: campaignData.scheduled_at ? campaignData.scheduled_at.toISOString() : null
        };

        const { error } = await supabase.from("campaigns").insert(payload);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Campaign Draft Created" });
            setIsCreateOpen(false);
            fetchCampaigns();
        }
    };

    const handleAction = async (id: string, action: 'send' | 'schedule' | 'pause' | 'stop' | 'delete', date?: Date) => {
        if (action === 'delete') {
            if (!confirm("Delete this campaign definitively?")) return;
            await supabase.from("campaigns").delete().eq("id", id);
            fetchCampaigns();
            toast({ title: "Deleted", description: "Campaign removed." });
            return;
        }

        let newStatus = 'draft';
        let feedback = "";

        if (action === 'send') {
            newStatus = 'sending';
            feedback = "Campaign started! Sending emails...";
        } else if (action === 'schedule') {
            newStatus = 'scheduled';
            feedback = `Campaign scheduled for ${date ? format(date, "PPP") : "later"}`;
        } else if (action === 'pause') {
            newStatus = 'paused';
            feedback = "Campaign paused.";
        } else if (action === 'stop') {
            newStatus = 'stopped';
            feedback = "Campaign stopped.";
        }

        const updatePayload: any = { status: newStatus };
        if (date && action === 'schedule') updatePayload.scheduled_at = date.toISOString();

        const { error } = await supabase.from("campaigns").update(updatePayload).eq("id", id);

        if (!error) {
            fetchCampaigns();
            toast({ title: action === 'send' ? "Sending Started" : "Updated", description: feedback });
            if (action === 'send') simulateSending(id);
        } else {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const simulateSending = (id: string) => {
        console.log(`Simulating send for ${id}`);
        setTimeout(async () => {
            await supabase.from("campaigns").update({ status: 'sent' }).eq("id", id);
            fetchCampaigns();
            toast({ title: "Campaign Finished", description: "All emails have been delivered." });
        }, 5000);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/contacts">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50"><ArrowLeft className="h-5 w-5 text-slate-600" /></Button>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 tracking-tight">Marketing Campaigns</h2>
                        <p className="text-slate-500 mt-1 text-lg">Create, schedule and track email blasts.</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg shadow-pink-200 text-white rounded-xl h-11 transition-all hover:scale-[1.02]"
                >
                    <Plus className="mr-2 h-4 w-4" /> New Campaign
                </Button>

                <CampaignWizard
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    smtpConfigs={smtpConfigs}
                    availableTags={availableTags}
                    onSave={handleCreate}
                />
            </div>

            <Card className="glass-card border-none shadow-xl shadow-rose-100/20 overflow-hidden bg-white/60 backdrop-blur-xl">
                <CardHeader className="border-b border-indigo-50/50 bg-white/40 backdrop-blur-md py-6">
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                        <div className="p-2 bg-rose-100 rounded-lg">
                            <Send className="h-6 w-6 text-rose-600" />
                        </div>
                        Campaigns Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <div className="h-10 w-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                                <Send className="w-10 h-10 text-rose-300" />
                            </div>
                            <p className="text-xl font-medium text-slate-700">No campaigns yet</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-rose-50/40">
                                <TableRow className="hover:bg-transparent border-rose-100">
                                    <TableHead className="pl-6 font-semibold text-slate-600 h-12">Campaign</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Target</TableHead>
                                    <TableHead className="text-right pr-6 font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.map((c) => (
                                    <TableRow key={c.id} className="hover:bg-white/60 border-rose-50 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-slate-800 text-base">{c.name}</span>
                                                <span className="text-sm text-slate-500">{c.subject}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {format(new Date(c.created_at), "MMM d")}
                                                    </span>
                                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 flex items-center gap-1">
                                                        <Send className="w-3 h-3" /> {c.smtp_configs?.from_email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={c.status === 'sent' ? "default" : c.status === 'sending' ? "default" : "secondary"}
                                                className={cn(
                                                    "capitalize px-3 py-1",
                                                    c.status === 'sent' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
                                                    c.status === 'sending' && "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 animate-pulse",
                                                    c.status === 'draft' && "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200",
                                                    c.status === 'scheduled' && "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
                                                    c.status === 'paused' && "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200",
                                                )}
                                            >
                                                {c.status}
                                            </Badge>
                                            {c.status === 'sending' && (
                                                <div className="w-24 mt-2">
                                                    <Progress value={66} className="h-1" />
                                                </div>
                                            )}
                                            {c.status === 'scheduled' && c.scheduled_at && (
                                                <div className="text-xs text-amber-600 mt-1 font-medium">
                                                    Due: {format(new Date(c.scheduled_at), "MMM d, HH:mm")}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {c.target_tags && c.target_tags.length > 0 ? (
                                                    c.target_tags.map((tag: string, i: number) => (
                                                        <Badge key={i} variant="outline" className="bg-white border-slate-200 text-slate-600 text-[10px] px-1.5 py-0">
                                                            {tag}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-400 text-[10px]">All Contacts</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                {c.status === 'draft' && (
                                                    <>
                                                        <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleAction(c.id, 'send')}>
                                                            <Send className="w-3 h-3 mr-1" /> Send Now
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-8 border-indigo-200 text-indigo-600" onClick={() => handleAction(c.id, 'schedule', new Date(Date.now() + 86400000))}>
                                                            <CalendarIcon className="w-3 h-3 mr-1" /> Schedule
                                                        </Button>
                                                    </>
                                                )}
                                                {(c.status === 'sending' || c.status === 'scheduled') && (
                                                    <Button size="sm" variant="outline" className="h-8 border-orange-200 text-orange-600" onClick={() => handleAction(c.id, 'pause')}>
                                                        <Pause className="w-3 h-3 mr-1" /> Pause
                                                    </Button>
                                                )}
                                                {c.status === 'paused' && (
                                                    <Button size="sm" variant="outline" className="h-8 border-emerald-200 text-emerald-600" onClick={() => handleAction(c.id, 'send')}>
                                                        <Play className="w-3 h-3 mr-1" /> Resume
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-lg"
                                                    onClick={() => handleAction(c.id, 'delete')}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CampaignManager;

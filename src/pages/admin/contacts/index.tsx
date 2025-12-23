

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Trash, Settings, Send, Mail, User, Calendar, CheckCircle2, XCircle, Tag, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { format } from "date-fns";

const ContactManager = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [importData, setImportData] = useState("");
    const [importTags, setImportTags] = useState("");
    const [isImportOpen, setIsImportOpen] = useState(false);

    const [editingContact, setEditingContact] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) setContacts(data || []);
        setIsLoading(false);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this contact?")) return;
        const { error } = await supabase.from("contacts").delete().eq("id", id);
        if (!error) {
            toast({ title: "Success", description: "Contact deleted" });
            fetchContacts();
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingContact) return;

        // Parse tags if string, else keep array
        let tags = editingContact.tags;
        if (typeof tags === 'string') {
            tags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        const { error } = await supabase
            .from("contacts")
            .update({
                first_name: editingContact.first_name,
                last_name: editingContact.last_name,
                tags: tags
            })
            .eq("id", editingContact.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Contact updated" });
            setIsEditOpen(false);
            setEditingContact(null);
            fetchContacts();
        }
    };

    const openEdit = (contact: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingContact({
            ...contact,
            tags: Array.isArray(contact.tags) ? contact.tags.join(", ") : contact.tags
        });
        setIsEditOpen(true);
    };

    const handleImport = async () => {
        if (!importData) return;

        // Simple CSV parser: assumes email is the first column
        const lines = importData.split("\n");
        const newContacts = [];
        let skipped = 0;

        // Parse global tags for this import batch
        const batchTags = importTags.split(",").map(t => t.trim()).filter(t => t);

        for (const line of lines) {
            const parts = line.split(",");
            const email = parts[0]?.trim();
            if (email && email.includes("@")) {
                newContacts.push({
                    email,
                    first_name: parts[1]?.trim() || null,
                    last_name: parts[2]?.trim() || null,
                    tags: batchTags // Apply tags to all imported
                });
            } else {
                skipped++;
            }
        }

        if (newContacts.length === 0) {
            toast({ title: "Error", description: "No valid emails found", variant: "destructive" });
            return;
        }

        const { error } = await supabase.from("contacts").insert(newContacts);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({
                title: "Import Successful",
                description: `Imported ${newContacts.length} contacts. Skipped ${skipped} lines.`
            });
            setIsImportOpen(false);
            setImportData("");
            setImportTags("");
            fetchContacts();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 animate-fade-in"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 tracking-tight">CRM & Audience</h2>
                    <p className="text-slate-500 mt-2 text-lg">Manage your subscribers, segment tags, and email lists.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link to="smtp">
                        <Button variant="outline" className="bg-white/50 border-indigo-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all rounded-xl shadow-sm h-11">
                            <Settings className="mr-2 h-4 w-4" /> SMTP Config
                        </Button>
                    </Link>
                    <Link to="campaigns">
                        <Button variant="outline" className="bg-white/50 border-indigo-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all rounded-xl shadow-sm h-11">
                            <Send className="mr-2 h-4 w-4" /> Marketing Campaigns
                        </Button>
                    </Link>

                    {/* Import Dialog */}
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 text-white rounded-xl h-11 transition-all hover:scale-[1.02]">
                                <Upload className="mr-2 h-4 w-4" /> Import Contacts
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-none shadow-2xl max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Import Contacts</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-5 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-semibold">Step 1: Assign Tags (Optional)</Label>
                                    <Input
                                        placeholder="e.g. Newsletter, VIP, Q1-Leads"
                                        value={importTags}
                                        onChange={(e) => setImportTags(e.target.value)}
                                        className="glass-input"
                                    />
                                    <p className="text-xs text-slate-400">Comma separated tags applied to all imported contacts.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-semibold">Step 2: Paste CSV Data</Label>
                                    <p className="text-xs text-slate-500 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 font-mono">
                                        Format: email, first_name, last_name
                                    </p>
                                    <Textarea
                                        rows={8}
                                        placeholder="john@example.com, John, Doe&#10;sarah@test.com, Sarah, Smith"
                                        value={importData}
                                        onChange={(e) => setImportData(e.target.value)}
                                        className="glass-input font-mono text-sm leading-relaxed"
                                    />
                                </div>
                                <Button onClick={handleImport} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 h-12 text-lg shadow-lg shadow-indigo-100 rounded-xl hover:scale-[1.01] transition-transform">
                                    Process Import
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="glass-card border-none shadow-2xl max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-slate-800">Edit Contact</DialogTitle>
                            </DialogHeader>
                            {editingContact && (
                                <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input
                                            value={editingContact.first_name || ''}
                                            onChange={e => setEditingContact({ ...editingContact, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input
                                            value={editingContact.last_name || ''}
                                            onChange={e => setEditingContact({ ...editingContact, last_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tags</Label>
                                        <Input
                                            value={editingContact.tags || ''}
                                            onChange={e => setEditingContact({ ...editingContact, tags: e.target.value })}
                                            placeholder="tag1, tag2"
                                        />
                                        <p className="text-xs text-slate-400">Comma separated</p>
                                    </div>
                                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                        Save Changes
                                    </Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="glass-card border-none shadow-xl shadow-indigo-100/20 overflow-hidden bg-white/60 backdrop-blur-xl">
                <CardHeader className="border-b border-indigo-50/50 bg-white/40 backdrop-blur-md py-6">
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <User className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl">Contact List</span>
                            <span className="text-sm font-normal text-slate-500">Total Subscribers: {contacts.length}</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                                <Mail className="w-10 h-10 text-indigo-300" />
                            </div>
                            <div>
                                <p className="text-xl font-medium text-slate-700">No contacts found</p>
                                <p className="text-base text-slate-400 mt-1">Import new contacts to start your marketing campaigns.</p>
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-indigo-50/40">
                                <TableRow className="hover:bg-transparent border-indigo-100">
                                    <TableHead className="pl-6 text-slate-600 font-semibold h-12">Subscriber</TableHead>
                                    <TableHead className="text-slate-600 font-semibold">Tags</TableHead>
                                    <TableHead className="text-slate-600 font-semibold">Status</TableHead>
                                    <TableHead className="text-slate-600 font-semibold">Date Added</TableHead>
                                    <TableHead className="text-right pr-6 text-slate-600 font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow key={contact.id} className="hover:bg-white/60 border-indigo-50 transition-colors group cursor-pointer" onClick={(e) => openEdit(contact, e)}>
                                        <TableCell className="font-medium text-slate-700 pl-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-100">
                                                    {contact.email[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{contact.first_name} {contact.last_name}</span>
                                                    <span className="text-xs text-slate-500">{contact.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {contact.tags && contact.tags.length > 0 ? (
                                                    contact.tags.map((tag: string, i: number) => (
                                                        <Badge key={i} variant="outline" className="bg-white border-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5">
                                                            <Tag className="w-3 h-3 mr-1 opacity-50" /> {tag}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-300 text-xs italic">No tags</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {contact.is_subscribed ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 gap-1.5 pl-1.5 pr-2.5 py-1 shadow-sm font-medium">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-rose-50 text-rose-500 border-rose-100 gap-1.5 pl-1.5 pr-2.5 py-1">
                                                    <XCircle className="w-3.5 h-3.5" /> Unsubscribed
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                {format(new Date(contact.created_at), "MMM d, yyyy")}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-lg group-hover:bg-white"
                                                    onClick={(e) => openEdit(contact, e)}
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-lg group-hover:bg-white"
                                                    onClick={(e) => handleDelete(contact.id, e)}
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
        </motion.div>
    );
};

export default ContactManager;

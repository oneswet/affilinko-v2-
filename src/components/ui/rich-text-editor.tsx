
import React, { useEffect, useRef, useState } from 'react';
import {
    Bold, Italic, Underline, Heading1, Heading2, Heading3,
    List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
    Quote, Table as TableIcon, Undo, Redo, RemoveFormatting,
    Code, AlignLeft, AlignCenter, AlignRight, Upload, Globe, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/upload-service';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    className?: string;
    placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, className, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);

    // Image Upload State
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Sync external value changes to editor
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const exec = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const triggerChange = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            exec('insertImage', url);
            setImageDialogOpen(false);
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlInsert = () => {
        if (!imageUrl) return;
        exec('insertImage', imageUrl);
        setImageDialogOpen(false);
        setImageUrl("");
    };

    const ToolbarButton = ({ icon: Icon, command, arg, onClick, label, active = false }: any) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-8 w-8 p-0 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors",
                        active && "bg-indigo-100 text-indigo-700"
                    )}
                    onClick={() => onClick ? onClick() : exec(command, arg)}
                    tabIndex={-1} // Prevent toolbar buttons from stealing focus flow
                >
                    <Icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );

    const Separator = () => <div className="w-px h-5 bg-slate-200 mx-1" />;

    return (
        <div className={cn(
            "flex flex-col border border-slate-200 rounded-lg overflow-hidden transition-all shadow-sm bg-white",
            isFocused && "ring-2 ring-indigo-100 border-indigo-300 shadow-md",
        )}>
            {/* Sticky Professional Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-0.5">
                    <ToolbarButton icon={Undo} command="undo" label="Undo" />
                    <ToolbarButton icon={Redo} command="redo" label="Redo" />
                </div>

                <Separator />

                <div className="flex items-center gap-0.5">
                    <ToolbarButton icon={Heading1} command="formatBlock" arg="H1" label="Heading 1" />
                    <ToolbarButton icon={Heading2} command="formatBlock" arg="H2" label="Heading 2" />
                    <ToolbarButton icon={Heading3} command="formatBlock" arg="H3" label="Heading 3" />
                </div>

                <Separator />

                <div className="flex items-center gap-0.5">
                    <ToolbarButton icon={Bold} command="bold" label="Bold" />
                    <ToolbarButton icon={Italic} command="italic" label="Italic" />
                    <ToolbarButton icon={Underline} command="underline" label="Underline" />
                    <ToolbarButton icon={Code} command="formatBlock" arg="pre" label="Code Block" />
                </div>

                <Separator />

                <div className="flex items-center gap-0.5">
                    <ToolbarButton icon={List} command="insertUnorderedList" label="Bullet List" />
                    <ToolbarButton icon={ListOrdered} command="insertOrderedList" label="Numbered List" />
                    <ToolbarButton icon={Quote} command="formatBlock" arg="blockquote" label="Quote" />
                </div>

                <Separator />

                <div className="flex items-center gap-0.5">
                    <ToolbarButton icon={AlignLeft} command="justifyLeft" label="Align Left" />
                    <ToolbarButton icon={AlignCenter} command="justifyCenter" label="Align Center" />
                    <ToolbarButton icon={AlignRight} command="justifyRight" label="Align Right" />
                </div>

                <Separator />

                <div className="flex items-center gap-0.5">
                    <ToolbarButton icon={LinkIcon} command="createLink" arg={prompt}
                        label="Link"
                        onClick={() => { const url = prompt('URL:'); if (url) exec('createLink', url); }}
                    />

                    {/* Image Mananger Dialog */}
                    <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Insert Image</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="upload" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                    <TabsTrigger value="url">From URL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload" className="space-y-4 py-4">
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <Upload className="h-10 w-10 text-slate-400 mb-4" />
                                        <Label htmlFor="image-upload" className="mb-2 text-sm font-semibold text-slate-700 cursor-pointer">
                                            {isUploading ? "Uploading..." : "Click to Upload Image"}
                                        </Label>
                                        <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP</p>
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="url" className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Image URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                            />
                                            <Button onClick={handleUrlInsert} disabled={!imageUrl}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="ml-auto flex items-center gap-0.5">
                    <ToolbarButton icon={RemoveFormatting} command="removeFormat" label="Clear Formatting" />
                </div>
            </div>

            {/* Editor Content Area */}
            <div
                className={cn("bg-white overflow-y-auto cursor-text min-h-[500px] p-6 outline-none", className)}
                onClick={() => editorRef.current?.focus()}
            >
                <div
                    ref={editorRef}
                    className="prose prose-lg max-w-none text-slate-700 font-sans leading-relaxed focus:outline-none"
                    contentEditable
                    onInput={triggerChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    suppressContentEditableWarning
                />
                {!value && placeholder && (
                    <div className="absolute top-[60px] left-8 text-slate-400 pointer-events-none text-lg">
                        {placeholder}
                    </div>
                )}
            </div>
        </div>
    );
};


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Play, Terminal as TerminalIcon, Trash2, Database, AlertCircle, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const SqlConsole = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    const executeQuery = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const { data, error: rpcError } = await (supabase as any).rpc("invoke_sql_query", {
                query: query.trim(),
            });

            if (rpcError) throw rpcError;

            // Check if the function returned an error object itself (handled in PL/PGSQL exception block)
            if (data && !Array.isArray(data) && (data as any).error) {
                throw new Error((data as any).error);
            }

            setResults(Array.isArray(data) ? data : []);
            setHistory((prev) => [query, ...prev].slice(0, 10)); // Keep last 10
            toast.success("Query executed successfully");
        } catch (err: any) {
            console.error("SQL Error:", err);
            setError(err.message || "An unknown error occurred");
            toast.error("Query Execution Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            executeQuery();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Editor Section */}
            <motion.div
                className="lg:col-span-2 flex flex-col gap-4 h-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="relative flex-1 bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                    <div className="bg-[#252526] px-4 py-2 border-b border-black/20 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                            <TerminalIcon className="w-4 h-4 text-emerald-500" />
                            <span>SQL EDITOR (ADMIN)</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">CMD + ENTER to run</div>
                    </div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="SELECT * FROM profiles LIMIT 5;"
                        className="flex-1 w-full bg-[#1e1e1e] text-emerald-400 font-mono p-4 resize-none outline-none focus:ring-0 border-none md:text-sm leading-relaxed selection:bg-emerald-900/50 selection:text-white placeholder:text-slate-600"
                        spellCheck="false"
                    />
                    <div className="bg-[#252526] p-3 border-t border-black/20 flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white hover:bg-white/10"
                            onClick={() => setQuery("")}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                        <Button
                            size="sm"
                            onClick={executeQuery}
                            disabled={isLoading || !query}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/20"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            ) : (
                                <Play className="w-4 h-4 mr-2 fill-current" />
                            )}
                            Run Query
                        </Button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="h-1/2 glass-card bg-white/60 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl overflow-hidden flex flex-col">
                    <div className="bg-indigo-50/50 border-b border-indigo-100/50 px-4 py-2 text-xs font-bold text-indigo-900/70 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-500" />
                        Results {results ? `(${results.length} rows)` : ""}
                    </div>

                    <ScrollArea className="flex-1">
                        {error ? (
                            <div className="p-6 text-red-600 bg-red-50/50 h-full flex items-start gap-3 font-mono text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="whitespace-pre-wrap break-words">{error}</div>
                            </div>
                        ) : results ? (
                            results.length > 0 ? (
                                <div className="w-full overflow-auto">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead className="bg-slate-50/80 text-slate-500 font-medium sticky top-0 backdrop-blur-sm">
                                            <tr>
                                                {Object.keys(results[0]).map((key) => (
                                                    <th key={key} className="px-4 py-2 border-b border-slate-200 whitespace-nowrap">
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {results.map((row, i) => (
                                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                                    {Object.values(row).map((val: any, j) => (
                                                        <td key={j} className="px-4 py-2 font-mono text-xs text-slate-600 whitespace-nowrap max-w-[200px] truncate">
                                                            {val === null ? (
                                                                <span className="text-slate-400 italic">null</span>
                                                            ) : typeof val === "object" ? (
                                                                JSON.stringify(val)
                                                            ) : (
                                                                String(val)
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                                    <div className="w-12 h-12 rounded-full bg-slate-100/50 flex items-center justify-center mb-3">
                                        <Database className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p>Query returned no results</p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                                <p>Run a query to see results here</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </motion.div>

            {/* History Sidebar */}
            <motion.div
                className="hidden lg:flex flex-col glass-card bg-white/60 backdrop-blur-xl rounded-xl border border-white/40 shadow-xl overflow-hidden h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100/50 font-bold text-sm text-indigo-900/80 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-500" />
                    Query History
                </div>
                <ScrollArea className="flex-1 p-2">
                    <div className="space-y-2">
                        {history.map((h, i) => (
                            <button
                                key={i}
                                onClick={() => setQuery(h)}
                                className="w-full text-left p-3 rounded-lg text-xs font-mono bg-white/50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors truncate border border-transparent hover:border-indigo-100/50 shadow-sm"
                            >
                                {h}
                            </button>
                        ))}
                        {history.length === 0 && (
                            <p className="text-center text-xs text-slate-400 py-8 italic">No history yet</p>
                        )}
                    </div>
                </ScrollArea>
            </motion.div>
        </div>
    );
};

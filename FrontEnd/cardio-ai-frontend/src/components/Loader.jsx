import { Activity } from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050510]">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
            </div>
            <p className="mt-4 text-blue-400 font-mono text-sm tracking-widest animate-pulse">
                INITIALIZING SYSTEM...
            </p>
        </div>
    );
}

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('cardio_history');
        if (stored) {
            setHistory(JSON.parse(stored));
        } else {
            const demoData = [
                { date: "2023-10-01", risk: 0.15, risk_category: "Low Risk" },
                { date: "2023-11-20", risk: 0.12, risk_category: "Low Risk" },
                { date: "2024-01-15", risk: 0.25, risk_category: "Elevated" },
            ];
            setHistory(demoData);
        }
    }, []);

    return (
        <div className="container max-w-5xl mx-auto px-4">

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">History Dashboard</h1>
                <p className="text-slate-500">Track and monitor your assessment trends over time.</p>
            </div>

            {/* Chart Section */}
            <div className="card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Risk Timeline</h2>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1 text-slate-600 outline-none">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                    </select>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val * 100}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#0f172a' }}
                                formatter={(value) => [`${value * 100}%`, "Risk Probability"]}
                            />
                            <Area type="monotone" dataKey="risk" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table Section */}
            <div className="card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Score</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right pr-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4 pl-6 text-slate-700 font-medium flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" /> {item.date}
                                </td>
                                <td className="p-4">
                                    <StatusBadge risk={item.risk} />
                                </td>
                                <td className="p-4 font-bold text-slate-900">
                                    {(item.risk * 100).toFixed(1)}%
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function StatusBadge({ risk }) {
    const isHigh = risk > 0.5;
    const isMed = risk > 0.2;

    let styles = "bg-emerald-50 text-emerald-700 border-emerald-100";
    let label = "Normal";

    if (isHigh) {
        styles = "bg-rose-50 text-rose-700 border-rose-100";
        label = "High Risk";
    } else if (isMed) {
        styles = "bg-amber-50 text-amber-700 border-amber-100";
        label = "Elevated";
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles}`}>
            {label}
        </span>
    )
}

"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllRegistrations, verifyPayment } from "../dashboard/actions";

export default function AdminPortal() {
    const { data: session, status } = useSession();
    const [list, setList] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    const loadData = async () => {
        const data = await getAllRegistrations();
        setList(data);
    };

    useEffect(() => {
        if (session?.user?.role === "ADMIN") loadData();
    }, [session]);

    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") redirect("/");

    // UI Refinement: Dashboard Stats
    const stats = {
        total: list.length,
        verified: list.filter(r => r.payment?.status === "VERIFIED").length,
        pending: list.filter(r => r.payment?.status === "PENDING").length,
        revenue: list.filter(r => r.payment?.status === "VERIFIED" && r.payment.currency === "INR")
            .reduce((sum, r) => sum + (r.payment?.amount || 0), 0)
    };

    const filteredList = list.filter((reg) => {
        const matchesSearch = reg.user.name?.toLowerCase().includes(search.toLowerCase()) ||
            reg.user.email?.toLowerCase().includes(search.toLowerCase());
        const regStatus = reg.payment?.status || "UNREGISTERED";
        const matchesStatus = filterStatus === "ALL" || regStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // CSV Export Logic
    const exportToCSV = () => {
        const headers = ["Name", "Email", "Institution", "Category", "Payment ID (UTR)", "Status", "Amount (INR)"];

        // Format rows and escape commas inside strings (like institution names)
        const rows = filteredList.map(reg => [
            `"${reg.user.name || ''}"`,
            `"${reg.user.email || ''}"`,
            `"${reg.institution || ''}"`,
            `"${reg.category || ''}"`,
            `"${reg.payment?.transactionId || 'No Data'}"`,
            `"${reg.payment?.status || 'UNREGISTERED'}"`,
            `"${reg.payment?.amount || '0'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ICAIAC_Attendees_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM after download
    };

    return (
        <main className="min-h-screen bg-cream-100 p-8 text-charcoal font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Institutional Admin</span>
                        <h1 className="font-serif text-5xl text-charcoal">Attendee Queue</h1>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="bg-charcoal text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all shadow-xl rounded-sm"
                    >
                        Export Participant List
                    </button>
                </header>

                {/* REFINED: Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatsCard label="Verified Attendees" value={stats.verified} sub={`of ${stats.total} registrations`} />
                    <StatsCard label="Pending Approval" value={stats.pending} color="text-gold" />
                    <StatsCard label="Total Revenue (INR)" value={`₹${stats.revenue.toLocaleString()}`} />
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="flex-1 p-4 bg-white border border-charcoal/5 rounded-sm text-sm outline-none focus:border-gold shadow-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="p-4 bg-white border border-charcoal/5 rounded-sm text-sm outline-none"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Filter: All</option>
                        <option value="PENDING">Status: Pending</option>
                        <option value="VERIFIED">Status: Verified</option>
                    </select>
                </div>

                <div className="bg-white border border-charcoal/5 overflow-hidden shadow-2xl rounded-sm">
                    <table className="w-full text-left">
                        <thead className="bg-charcoal text-white text-[10px] uppercase tracking-widest">
                            <tr>
                                <th className="p-5">Participant</th>
                                <th className="p-5">Institution</th>
                                <th className="p-5">Payment ID</th>
                                <th className="p-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                            {filteredList.map((reg) => (
                                <tr key={reg.id} className="hover:bg-cream-100/30 transition-colors">
                                    <td className="p-5">
                                        <div className="font-bold text-sm">{reg.user.name}</div>
                                        <div className="text-[10px] opacity-40 uppercase tracking-tighter">{reg.user.email}</div>
                                    </td>
                                    <td className="p-5 text-xs">
                                        <div className="font-medium text-charcoal truncate max-w-xs">{reg.institution}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-[10px] font-mono font-bold text-gold uppercase">{reg.payment?.transactionId || "No Data"}</div>
                                        {reg.payment?.receiptUrl && (
                                            <a href={reg.payment.receiptUrl} target="_blank" className="text-[9px] underline opacity-40 hover:opacity-100 block mt-1">
                                                View Receipt
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <span className={`px-2 py-1 text-[8px] font-bold rounded-full uppercase ${reg.payment?.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold'}`}>
                                                {reg.payment?.status || "NOT PAID"}
                                            </span>
                                            {reg.payment?.status === "PENDING" && (
                                                <button
                                                    onClick={async () => {
                                                        // Optional: Add a confirmation dialog to prevent accidental clicks
                                                        if (confirm(`Are you sure you want to verify the payment for ${reg.user.name}?`)) {
                                                            await verifyPayment(reg.payment.id);
                                                            loadData(); // This instantly updates the UI to show "VERIFIED"
                                                        }
                                                    }}
                                                    className="bg-gold text-charcoal px-4 py-2 text-[9px] font-bold uppercase hover:bg-charcoal hover:text-white transition-all rounded-sm shadow-md"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-charcoal/40 text-sm">
                                        No attendees match your current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

function StatsCard({ label, value, sub, color = "text-charcoal" }: any) {
    return (
        <div className="bg-white p-8 border-b-2 border-gold shadow-sm">
            <p className="text-[10px] uppercase font-bold text-charcoal/30 tracking-[0.2em] mb-2">{label}</p>
            <p className={`text-4xl font-serif ${color}`}>{value}</p>
            {sub && <p className="text-[10px] opacity-40 mt-1 uppercase">{sub}</p>}
        </div>
    );
}
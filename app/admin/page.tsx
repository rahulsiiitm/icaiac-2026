"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllRegistrations, verifyPayment, rejectPayment } from "../dashboard/actions";

export default function AdminPortal() {
    const { data: session, status } = useSession();
    const [list, setList] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);
    // Rejection modal state
    const [rejectModal, setRejectModal] = useState<{ paymentId: string; name: string } | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try { const data = await getAllRegistrations(); setList(data); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (session?.user?.role === "ADMIN") loadData();
    }, [session]);

    if (status === "loading") {
        return (
            <main className="min-h-screen bg-cream-100 flex items-center justify-center">
                <p className="text-charcoal/40 text-sm uppercase tracking-widest animate-pulse">Loading...</p>
            </main>
        );
    }

    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") redirect("/");

    const stats = {
        total: list.length,
        verified: list.filter((r) => r.payment?.status === "VERIFIED").length,
        pending: list.filter((r) => r.payment?.status === "PENDING").length,
        rejected: list.filter((r) => r.payment?.status === "FAILED").length,
        revenue: list
            .filter((r) => r.payment?.status === "VERIFIED" && r.payment.currency === "INR")
            .reduce((sum, r) => sum + (r.payment?.amount || 0), 0),
    };

    const filteredList = list.filter((reg) => {
        const matchesSearch =
            reg.user.name?.toLowerCase().includes(search.toLowerCase()) ||
            reg.user.email?.toLowerCase().includes(search.toLowerCase());
        const regStatus = reg.payment?.status || "UNREGISTERED";
        const matchesStatus = filterStatus === "ALL" || regStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Institution", "Category", "Payment ID (UTR)", "Status", "Amount"];
        const rows = filteredList.map((reg) => [
            `"${(reg.user.name || "").replace(/"/g, '""')}"`,
            `"${(reg.user.email || "").replace(/"/g, '""')}"`,
            `"${(reg.institution || "").replace(/"/g, '""')}"`,
            `"${(reg.category || "").replace(/"/g, '""')}"`,
            `"${(reg.payment?.transactionId || "No Data").replace(/"/g, '""')}"`,
            `"${reg.payment?.status || "UNREGISTERED"}"`,
            `"${reg.payment?.amount || 0}"`,
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `ICAIAC_Attendees_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReject = async () => {
        if (!rejectModal || !rejectReason.trim()) return;
        setIsRejecting(true);
        const res = await rejectPayment(rejectModal.paymentId, rejectReason);
        if (res.success) { loadData(); setRejectModal(null); setRejectReason(""); }
        else alert(res.error || "Rejection failed.");
        setIsRejecting(false);
    };

    return (
        <main className="min-h-screen bg-cream-100 p-8 text-charcoal font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Institutional Admin</span>
                        <h1 className="font-serif text-5xl text-charcoal">Attendee Queue</h1>
                    </div>
                    <button onClick={exportToCSV} disabled={isLoading || list.length === 0} className="bg-charcoal text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all shadow-xl rounded-sm disabled:opacity-40">
                        Export Participant List
                    </button>
                </header>

                {/* Stats — now includes rejected count */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <StatsCard label="Verified" value={isLoading ? "—" : stats.verified} sub={isLoading ? "" : `of ${stats.total} total`} />
                    <StatsCard label="Pending" value={isLoading ? "—" : stats.pending} color="text-gold" />
                    <StatsCard label="Rejected" value={isLoading ? "—" : stats.rejected} color="text-red-500" />
                    <StatsCard label="Revenue (INR)" value={isLoading ? "—" : `₹${stats.revenue.toLocaleString()}`} />
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input type="text" placeholder="Search by name or email..." className="flex-1 p-4 bg-white border border-charcoal/5 rounded-sm text-sm outline-none focus:border-gold shadow-sm" onChange={(e) => setSearch(e.target.value)} />
                    <select className="p-4 bg-white border border-charcoal/5 rounded-sm text-sm outline-none" onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="ALL">Filter: All</option>
                        <option value="PENDING">Pending</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="FAILED">Rejected</option>
                        <option value="UNREGISTERED">Unregistered</option>
                    </select>
                </div>

                {/* Table */}
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
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                                        <td key={j} className="p-5"><div className="h-4 bg-charcoal/5 rounded animate-pulse w-3/4" /></td>
                                    ))}</tr>
                                ))
                            ) : filteredList.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-charcoal/40 text-sm">No attendees match your current filters.</td></tr>
                            ) : (
                                filteredList.map((reg) => (
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
                                                <a href={reg.payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] underline opacity-40 hover:opacity-100 block mt-1">View Receipt</a>
                                            )}
                                            {reg.payment?.rejectionNote && (
                                                <div className="text-[9px] text-red-400 mt-1 max-w-xs truncate" title={reg.payment.rejectionNote}>
                                                    ✕ {reg.payment.rejectionNote}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <StatusBadge status={reg.payment?.status} />
                                                {reg.payment?.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm(`Verify payment for ${reg.user.name}?`)) {
                                                                    const res = await verifyPayment(reg.payment.id);
                                                                    if (res.success) loadData();
                                                                    else alert(res.error || "Verification failed.");
                                                                }
                                                            }}
                                                            className="bg-gold text-charcoal px-3 py-2 text-[9px] font-bold uppercase hover:bg-charcoal hover:text-white transition-all rounded-sm shadow-md"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModal({ paymentId: reg.payment.id, name: reg.user.name })}
                                                            className="bg-red-100 text-red-600 px-3 py-2 text-[9px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all rounded-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-sm shadow-2xl max-w-md w-full p-8">
                        <h3 className="font-serif text-2xl text-charcoal mb-2">Reject Payment</h3>
                        <p className="text-sm text-charcoal/60 mb-6">
                            Rejecting payment for <strong>{rejectModal.name}</strong>. They will receive an email with this reason and can resubmit.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. UTR number not found in bank records, incorrect amount transferred..."
                            rows={4}
                            className="w-full border border-charcoal/20 p-4 text-sm outline-none focus:border-gold transition-all resize-none mb-6"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleReject}
                                disabled={isRejecting || !rejectReason.trim()}
                                className="flex-1 bg-red-500 text-white font-bold py-3 text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-40"
                            >
                                {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                            </button>
                            <button
                                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                                className="px-6 border border-charcoal/20 text-charcoal/60 font-bold text-[10px] uppercase tracking-widest hover:text-charcoal transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function StatusBadge({ status }: { status?: string }) {
    const map: Record<string, string> = {
        VERIFIED: "bg-green-100 text-green-700",
        PENDING: "bg-gold/10 text-gold",
        FAILED: "bg-red-100 text-red-600",
    };
    return (
        <span className={`px-2 py-1 text-[8px] font-bold rounded-full uppercase ${map[status || ""] || "bg-charcoal/5 text-charcoal/40"}`}>
            {status || "NOT PAID"}
        </span>
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
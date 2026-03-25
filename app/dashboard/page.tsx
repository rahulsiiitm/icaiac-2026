"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { registerUser, getRegistrationStatus, submitPaymentProof, updateProfile, resubmitPaymentProof } from "./actions";
import { UploadButton } from "@uploadthing/react";
import { useReactToPrint } from "react-to-print";
import { InvitationLetter } from "../components/InvitationLetter";
import { OurFileRouter } from "../api/uploadthing/core";

type RegistrationStatus = Awaited<ReturnType<typeof getRegistrationStatus>>;

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registration, setRegistration] = useState<RegistrationStatus>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `ICAIAC_Invitation_${session?.user?.name?.replace(/\s+/g, "_") || "Attendee"}`,
  });

  const refresh = async () => {
    if (session?.user?.id) {
      const data = await getRegistrationStatus(session.user.id);
      setRegistration(data);
    }
  };

  useEffect(() => {
    async function checkStatus() {
      if (session?.user?.id) {
        try { await refresh(); } catch { setError("Failed to load registration status"); }
      }
      setLoading(false);
    }
    if (status === "authenticated") checkStatus();
  }, [session, status]);

  if (status === "unauthenticated") redirect("/sign-in");

  if (session?.user?.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-gold">Admin Access</h1>
          <Link href="/admin" className="inline-block bg-gold text-charcoal px-10 py-5 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl">
            Go to Management Console
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-[10px] text-white/30 uppercase tracking-widest mx-auto mt-8 hover:text-white/60 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <div className="text-xl font-bold tracking-[0.3em] uppercase animate-pulse text-white/50">Accessing Portal</div>
      </div>
    );
  }

  const paymentRejected = registration?.payment?.status === "FAILED";

  return (
    <div className="min-h-screen bg-charcoal text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3">Attendee Portal</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
              Signed in as <span className="text-white">{session?.user?.name || session?.user?.email}</span>
            </p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[10px] font-bold opacity-40 hover:opacity-100 hover:text-gold uppercase tracking-[0.3em] transition-all pb-1">
            Log Out
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-5 rounded-sm mb-12 text-xs tracking-wider">{error}</div>
        )}

        {/* ── STEP 1: Registration Form ── */}
        {!registration && (
          <div className="bg-white/5 p-8 md:p-16 rounded-sm border border-white/10 backdrop-blur-sm">
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-2">Step 1: Participant Profile</h2>
              <div className="h-1 w-20 bg-gold" />
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setError("");
                const formData = new FormData(e.currentTarget);
                formData.append("category", "Non-Author");
                const res = await registerUser(formData, session?.user?.id as string);
                if (res.success) await refresh();
                else setError(res.error || "Registration failed");
                setIsSubmitting(false);
              }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Region</label>
                  <select name="region" required className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-gold outline-none transition-all appearance-none cursor-pointer">
                    <option value="INR">India / SAARC (INR)</option>
                    <option value="USD">International (USD)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Phone Number</label>
                  <input type="tel" name="phone" placeholder="+91 ..." required className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-gold outline-none transition-all placeholder:text-white/10" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Institution / Organization</label>
                <input type="text" name="institution" placeholder="IIIT Manipur" required className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-gold outline-none transition-all placeholder:text-white/10" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Designation</label>
                <input type="text" name="designation" placeholder="e.g. PhD Scholar / Assistant Professor" required className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-gold outline-none transition-all placeholder:text-white/10" />
              </div>
              <button disabled={isSubmitting} className="w-full bg-gold text-charcoal font-bold py-6 text-[11px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl disabled:opacity-30">
                {isSubmitting ? "Generating Profile..." : "Confirm & Proceed to Payment"}
              </button>
            </form>
          </div>
        )}

        {/* ── EDIT PROFILE (shown when registered but no payment yet, or payment rejected) ── */}
        {registration && (!registration.payment || paymentRejected) && (
          <div className="mb-8">
            {!isEditing ? (
              <div className="bg-white/5 p-6 rounded-sm border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Registered as</p>
                  <p className="text-sm font-bold">{registration.institution} — {registration.designation}</p>
                  <p className="text-xs text-white/40 mt-1">{registration.phoneNumber}</p>
                </div>
                {!registration.payment && (
                  <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white transition-colors border border-gold/30 px-4 py-2 rounded-sm hover:border-white/30">
                    Edit Profile
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white/5 p-8 rounded-sm border border-gold/30">
                <div className="mb-8">
                  <h3 className="text-lg font-serif font-bold mb-2">Edit Profile</h3>
                  <div className="h-px w-12 bg-gold" />
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    const formData = new FormData(e.currentTarget);
                    const res = await updateProfile(formData, registration.id);
                    if (res.success) { await refresh(); setIsEditing(false); }
                    else setError(res.error || "Update failed");
                    setIsSubmitting(false);
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Phone Number</label>
                    <input type="tel" name="phone" defaultValue={registration.phoneNumber || ""} required className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-gold outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Institution</label>
                    <input type="text" name="institution" defaultValue={registration.institution || ""} required className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-gold outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Designation</label>
                    <input type="text" name="designation" defaultValue={registration.designation || ""} required className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-gold outline-none transition-all" />
                  </div>
                  <div className="flex gap-4">
                    <button disabled={isSubmitting} className="flex-1 bg-gold text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30">
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-8 border border-white/20 text-white/50 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Payment (new submission) ── */}
        {registration && !registration.payment && (
          <div className="bg-white/5 p-8 md:p-16 rounded-sm border border-white/10 backdrop-blur-sm">
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-2">Step 2: Bank Transfer (ICICI)</h2>
              <div className="h-1 w-20 bg-gold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="bg-white/5 p-8 border border-white/10 space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-4">Official A/C Details</h3>
                <div className="space-y-2 text-xs tracking-widest text-white/70">
                  <p><span className="text-white/30">Account:</span> IIIT Manipur Conference</p>
                  <p><span className="text-white/30">Number:</span> 123456789012</p>
                  <p><span className="text-white/30">IFSC:</span> ICIC0001234</p>
                </div>
              </div>
              <div className="bg-gold/10 p-8 border border-gold/30 flex flex-col justify-center">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-2">Applicable Fee</h3>
                <p className="text-4xl font-serif font-bold">{registration.region === "INR" ? "₹4,000" : "$80"}</p>
                <p className="text-[9px] uppercase tracking-widest text-gold/60 mt-2">Verified Transaction Required</p>
              </div>
            </div>
            <PaymentForm
              isSubmitting={isSubmitting}
              onSubmit={async (txId, url) => {
                setIsSubmitting(true);
                const res = await submitPaymentProof(registration.id, txId, url);
                if (res.success) await refresh();
                else setError(res.error || "Submission failed.");
                setIsSubmitting(false);
              }}
            />
          </div>
        )}

        {/* ── PAYMENT REJECTED: Resubmit ── */}
        {paymentRejected && registration?.payment && (
          <div className="bg-white/5 p-8 md:p-16 rounded-sm border border-red-500/30 backdrop-blur-sm">
            <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Payment Rejected</p>
              <p className="text-sm text-white/70">{registration.payment.rejectionNote || "Your payment could not be verified."}</p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-2">Resubmit Payment</h2>
              <div className="h-1 w-20 bg-gold" />
            </div>
            <PaymentForm
              isSubmitting={isSubmitting}
              onSubmit={async (txId, url) => {
                setIsSubmitting(true);
                const res = await resubmitPaymentProof(registration.payment!.id, txId, url);
                if (res.success) await refresh();
                else setError(res.error || "Resubmission failed.");
                setIsSubmitting(false);
              }}
            />
          </div>
        )}

        {/* ── STEP 3: Pending ── */}
        {registration?.payment?.status === "PENDING" && (
          <div className="bg-white/5 p-12 md:p-20 rounded-sm border border-white/10 text-center">
            <div className="text-5xl mb-8 animate-pulse">⏳</div>
            <h2 className="text-2xl font-serif font-bold mb-4 tracking-tight">Review in Progress</h2>
            <p className="text-white/40 text-sm tracking-widest uppercase mb-8">
              Transaction Reference: <span className="text-gold">{registration.payment.transactionId}</span>
            </p>
            <div className="max-w-xs mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-1/3 animate-pulse" />
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-8">IIIT Manipur Registration Cell</p>
          </div>
        )}

        {/* ── STEP 3: Verified ── */}
        {registration?.payment?.status === "VERIFIED" && (
          <div className="bg-white/5 p-12 md:p-24 rounded-sm border border-gold/30 text-center backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-24 h-24 border-r-2 border-t-2 border-gold/20" />
            </div>
            <div className="text-7xl mb-8">✓</div>
            <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight text-gold">Registration Verified</h2>
            <p className="text-white/50 mb-12 max-w-md mx-auto text-sm leading-relaxed tracking-wide">
              Your credentials and payment have been officially confirmed. You are now cleared to attend ICAIAC 2026.
            </p>
            <button onClick={() => handlePrint()} className="bg-white text-charcoal px-12 py-6 font-bold uppercase text-[11px] tracking-[0.4em] hover:bg-gold transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              Download Official Invitation
            </button>
            <div className="hidden">
              <InvitationLetter ref={contentRef} user={session?.user} registration={registration} />
            </div>
          </div>
        )}
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}

// ── Reusable payment form component ──
function PaymentForm({ isSubmitting, onSubmit }: {
  isSubmitting: boolean;
  onSubmit: (transactionId: string, receiptUrl: string) => Promise<void>;
}) {
  const [transactionId, setTransactionId] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">UTR / Transaction ID</label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter 12-digit reference number"
          className="w-full bg-white/5 border border-white/10 p-5 text-sm focus:border-gold outline-none transition-all placeholder:text-white/10"
        />
      </div>
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Payment Receipt (Image/PDF)</label>
        {uploadedUrl ? (
          <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-sm flex items-center justify-between">
            <span className="text-xs text-green-400 font-bold tracking-widest uppercase">✓ Document Uploaded</span>
            <button onClick={() => setUploadedUrl("")} className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest border-b border-white/20">Replace</button>
          </div>
        ) : (
          <UploadButton<OurFileRouter, "receiptUploader">
            endpoint="receiptUploader"
            onClientUploadComplete={(res) => { if (res?.[0]) setUploadedUrl(res[0].url); }}
            onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
            appearance={{
              button: "bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] p-6 w-full border border-white/10 rounded-sm hover:bg-white/20 transition-all",
              allowedContent: "hidden",
            }}
          />
        )}
      </div>
      <button
        onClick={() => onSubmit(transactionId, uploadedUrl)}
        disabled={isSubmitting || !uploadedUrl || !transactionId.trim()}
        className="w-full bg-gold text-charcoal font-bold py-6 text-[11px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Registration for Review"}
      </button>
    </div>
  );
}
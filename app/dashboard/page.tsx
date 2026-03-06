"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { registerUser, getRegistrationStatus, submitPaymentProof } from "./actions";
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

  const contentRef = useRef<HTMLDivElement>(null);

  // FIXED: Vercel-compatible syntax for the latest react-to-print
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `ICAIAC_Invitation_${session?.user?.name?.replace(/\s+/g, '_') || 'Attendee'}`,
  });

  useEffect(() => {
    async function checkStatus() {
      if (session?.user?.id) {
        try {
          const data = await getRegistrationStatus(session.user.id);
          setRegistration(data);
        } catch (err) {
          setError("Failed to load registration status");
        }
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
        <div className="text-center">
          <div className="text-xl font-bold tracking-[0.3em] uppercase animate-pulse text-white/50">Accessing Portal</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header with restored design */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3">Attendee Portal</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
              Signed in as <span className="text-white">{session?.user?.name || session?.user?.email}</span>
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-[10px] font-bold opacity-40 hover:opacity-100 hover:text-gold uppercase tracking-[0.3em] transition-all pb-1"
          >
            Log Out
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-5 rounded-sm mb-12 text-xs tracking-wider">
            {error}
          </div>
        )}

        {/* STEP 1: RESTORED DESIGN */}
        {!registration && (
          <div className="bg-white/5 p-8 md:p-16 rounded-sm border border-white/10 backdrop-blur-sm">
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-2">Step 1: Participant Profile</h2>
              <div className="h-1 w-20 bg-gold"></div>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setError("");
                try {
                  const formData = new FormData(e.currentTarget);
                  formData.append("category", "Non-Author");
                  const res = await registerUser(formData, session?.user?.id as string);
                  if (res.success) {
                    setRegistration(await getRegistrationStatus(session?.user?.id as string));
                  } else {
                    alert(res.error || "Registration failed"); 
                  }
                } catch (err) { alert("An error occurred."); } finally { setIsSubmitting(false); }
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

        {/* STEP 2: RESTORED DESIGN */}
        {registration && !registration.payment && (
          <div className="bg-white/5 p-8 md:p-16 rounded-sm border border-white/10 backdrop-blur-sm">
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-2">Step 2: Bank Transfer (ICICI)</h2>
              <div className="h-1 w-20 bg-gold"></div>
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
                <p className="text-4xl font-serif font-bold">{registration.region === 'INR' ? '₹4,000' : '$80'}</p>
                <p className="text-[9px] uppercase tracking-widest text-gold/60 mt-2">Verified Transaction Required</p>
              </div>
            </div>

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
                    onClientUploadComplete={(res) => { if (res && res[0]) setUploadedUrl(res[0].url); }}
                    onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
                    appearance={{
                      button: "bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] p-6 w-full border border-white/10 rounded-sm hover:bg-white/20 transition-all",
                      allowedContent: "hidden"
                    }}
                  />
                )}
              </div>

              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    const res = await submitPaymentProof(registration.id, transactionId, uploadedUrl);
                    if (res.success) setRegistration(await getRegistrationStatus(session?.user?.id as string));
                    else alert(res.error || "Submission failed."); 
                  } catch (err) { alert("An error occurred."); } finally { setIsSubmitting(false); }
                }}
                disabled={isSubmitting || !uploadedUrl || !transactionId.trim()}
                className="w-full bg-gold text-charcoal font-bold py-6 text-[11px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Verifying Transaction..." : "Submit Registration for Review"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESTORED DESIGN */}
        {registration?.payment?.status === "VERIFIED" ? (
          <div className="bg-white/5 p-12 md:p-24 rounded-sm border border-gold/30 text-center backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <div className="w-24 h-24 border-r-2 border-t-2 border-gold/20"></div>
            </div>
            <div className="text-7xl mb-8">✓</div>
            <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight text-gold">Registration Verified</h2>
            <p className="text-white/50 mb-12 max-w-md mx-auto text-sm leading-relaxed tracking-wide">
              Your credentials and payment have been officially confirmed. You are now cleared to attend ICAIAC 2026.
            </p>
            <button 
              onClick={() => handlePrint()} 
              className="bg-white text-charcoal px-12 py-6 font-bold uppercase text-[11px] tracking-[0.4em] hover:bg-gold transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              Download Official Invitation
            </button>
            <div className="hidden">
              <InvitationLetter ref={contentRef} user={session?.user} registration={registration} />
            </div>
          </div>
        ) : (
          registration?.payment && (
            <div className="bg-white/5 p-12 md:p-20 rounded-sm border border-white/10 text-center">
              <div className="text-5xl mb-8 animate-pulse">⏳</div>
              <h2 className="text-2xl font-serif font-bold mb-4 tracking-tight">Review in Progress</h2>
              <p className="text-white/40 text-sm tracking-widest uppercase mb-8">
                Transaction Reference: <span className="text-gold">{registration.payment.transactionId}</span>
              </p>
              <div className="max-w-xs mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-8">IIIT Manipur Registration Cell</p>
            </div>
          )
        )}
      </div>
      
      {/* Background styling for depth */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
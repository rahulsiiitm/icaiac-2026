"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { registerUser, getRegistrationStatus, submitPaymentProof } from "./actions";
import { UploadButton } from "@uploadthing/react";
import { useReactToPrint } from "react-to-print";
import { InvitationLetter } from "../components/InvitationLetter";

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

  // FIXED: Standard useReactToPrint syntax for Next.js App Router
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
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
          <h1 className="text-2xl font-bold tracking-wider">Admin Access</h1>
          <Link href="/admin" className="inline-block bg-gold text-charcoal px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl">
            Go to Management Console
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-[10px] text-white/30 uppercase tracking-widest mx-auto mt-4 hover:text-white/60 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">
        <div className="text-xl font-bold tracking-wider animate-pulse">Accessing Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-wider mb-2">Attendee Portal</h1>
            <p className="text-sm text-white/50">Logged in as {session?.user?.name || session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[10px] font-bold opacity-50 hover:opacity-100 hover:text-gold uppercase tracking-widest transition-all">
            Sign Out
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded mb-8">{error}</div>}

        {/* STEP 1: PARTICIPANT PROFILE */}
        {!registration && (
          <div className="bg-white/5 p-12 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-8 tracking-wider">Step 1: Participant Profile</h2>
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
                    const status = await getRegistrationStatus(session?.user?.id as string);
                    setRegistration(status);
                  } else {
                    alert(res.error || "Registration failed"); 
                  }
                } catch (err) {
                  alert("A network error occurred. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-3 text-white/60">Region</label>
                  <select name="region" required className="w-full bg-white/10 border border-white/20 p-4 text-sm focus:border-gold focus:outline-none">
                    <option value="INR">India / SAARC (INR)</option>
                    <option value="USD">International (USD)</option>
                  </select>
                </div>
              </div>
              <input type="text" name="institution" placeholder="Institution Name" required className="w-full bg-white/10 border border-white/20 p-4 text-sm focus:border-gold focus:outline-none" />
              <input type="text" name="designation" placeholder="Designation (e.g., Student)" required className="w-full bg-white/10 border border-white/20 p-4 text-sm focus:border-gold focus:outline-none" />
              <input type="tel" name="phone" placeholder="Phone Number" required className="w-full bg-white/10 border border-white/20 p-4 text-sm focus:border-gold focus:outline-none" />
              <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-charcoal font-bold py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl disabled:opacity-30">
                {isSubmitting ? "Processing..." : "Continue to Payment"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT SUBMISSION */}
        {registration && !registration.payment && (
          <div className="bg-white/5 p-12 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-8 tracking-wider">Step 2: Bank Transfer (ICICI)</h2>
            <div className="mb-8 p-6 bg-gold/10 border border-gold/30 rounded">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gold">Fee Amount</h3>
              <p className="text-3xl font-bold">{registration.region === 'INR' ? '₹4,000' : '$80'}</p>
            </div>
            <div className="space-y-6">
              <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="UTR / Transaction ID" className="w-full bg-white/10 border border-white/20 p-4 text-sm focus:border-gold focus:outline-none" />
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-3 text-white/60">Upload Receipt Image/PDF</label>
                {uploadedUrl ? (
                  <div className="bg-green-500/20 border border-green-500 p-4 rounded flex items-center justify-between">
                    <span className="text-sm text-green-300">✓ File Uploaded Successfully</span>
                    <button onClick={() => setUploadedUrl("")} className="text-xs text-white/50 hover:text-white underline">Remove</button>
                  </div>
                ) : (
                  /* FIXED: Corrected UploadButton component to avoid Vercel build errors */
                  <UploadButton
                    endpoint="receiptUploader"
                    onClientUploadComplete={(res) => {
                        if (res && res[0]) setUploadedUrl(res[0].url);
                    }}
                    onUploadError={(error) => alert(`Upload failed: ${error.message}`)}
                    appearance={{
                        button: "bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest p-4 w-full border border-white/10 rounded-sm hover:bg-white/20 transition-all",
                        allowedContent: "text-white/30 text-[9px] mt-2"
                    }}
                  />
                )}
              </div>
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  setError("");
                  try {
                    const res = await submitPaymentProof(registration.id, transactionId, uploadedUrl);
                    if (res.success) {
                      const status = await getRegistrationStatus(session?.user?.id as string);
                      setRegistration(status);
                    } else {
                      alert(res.error || "Submission failed."); 
                    }
                  } catch (err) {
                    alert("A network error occurred. Please check your internet.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting || !uploadedUrl || !transactionId.trim()}
                className="w-full bg-gold text-charcoal font-bold py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Confirm Registration"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMED VIEW */}
        {registration?.payment?.status === "VERIFIED" ? (
          <div className="bg-white/5 p-12 rounded-lg border border-gold/50 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-3xl font-bold mb-4 tracking-wider text-gold">Confirmed</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Registration verified. You can now download your official invitation letter.</p>
            <button onClick={() => handlePrint()} className="bg-white text-charcoal px-12 py-5 font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-gold transition-all shadow-2xl">
              Download Letter (PDF)
            </button>
            <div className="hidden">
              <InvitationLetter ref={contentRef} user={session?.user} registration={registration} />
            </div>
          </div>
        ) : (
          registration?.payment && (
            <div className="bg-yellow-500/10 p-12 rounded-lg border border-yellow-500/50 text-center">
              <div className="text-5xl mb-6">⏳</div>
              <h2 className="text-2xl font-bold mb-4 tracking-wider text-yellow-400">Verification Pending</h2>
              <p className="text-white/70 mb-2">UTR: <span className="font-mono">{registration.payment.transactionId}</span></p>
              <p className="text-white/40 text-xs">IIIT Manipur staff will verify your payment within 2-3 business days.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
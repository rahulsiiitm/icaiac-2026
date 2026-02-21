"use client";

import { useSession, signOut } from "next-auth/react";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface User {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { registerUser, getRegistrationStatus, submitPaymentProof } from "./actions";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { useReactToPrint } from "react-to-print";
import { InvitationLetter } from "../components/InvitationLetter";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `ICAIAC_Invitation_${session?.user?.name?.replace(/\s+/g, '_')}`,
  });

  useEffect(() => {
    async function checkStatus() {
      if (session?.user?.id) {
        const data = await getRegistrationStatus(session.user.id);
        setRegistration(data);
      }
      setLoading(false);
    }
    if (status === "authenticated") checkStatus();
  }, [session, status]);
    
  if (status === "unauthenticated") redirect("/sign-in");

  if (session?.user?.role === "ADMIN") {
    return (
      <main className="min-h-screen bg-charcoal text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 border border-gold/20 p-10 rounded-sm">
          <h2 className="font-serif text-3xl mb-4">Admin Access</h2>
          <Link href="/admin" className="block w-full bg-gold text-charcoal font-bold py-4 text-xs uppercase tracking-widest hover:bg-white transition-all mb-4">
            Go to Management Console
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[10px] text-white/30 uppercase tracking-widest">Sign Out</button>
        </div>
      </main>
    );
  }

  if (status === "loading" || loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-charcoal text-white font-serif text-xl text-gold animate-pulse">Accessing Portal...</div>;
  }

  return (
    <main className="min-h-screen bg-charcoal text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gold/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <div>
            <h1 className="font-serif text-4xl italic">Attendee <span className="text-gold not-italic font-bold">Portal</span></h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">Logged in as {session?.user?.name}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[10px] font-bold opacity-50 hover:opacity-100 hover:text-gold uppercase tracking-widest transition-all">Sign Out</button>
        </header>

        {/* STEP 1: REGISTRATION (Category hidden as it's default Non-Author) */}
        {!registration && (
          <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-sm shadow-2xl">
            <h2 className="font-serif text-2xl mb-10 text-gold border-b border-white/5 pb-4">Step 1: Participant Profile</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              const formData = new FormData(e.currentTarget);
              formData.append("category", "Non-Author"); // Auto-assign category
              const res = await registerUser(formData, session?.user?.id as string);
              if (res.success) setRegistration(await getRegistrationStatus(session?.user?.id as string));
              setIsSubmitting(false);
            }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Region</label>
                  <select name="region" required className="bg-charcoal/50 border border-white/10 p-4 text-sm outline-none focus:border-gold">
                    <option value="INR">India / SAARC (INR)</option>
                    <option value="USD">International (USD)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Institution / Org</label>
                  <input name="institution" type="text" required className="bg-charcoal/50 border border-white/10 p-4 text-sm focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Designation</label>
                  <input name="designation" type="text" required className="bg-charcoal/50 border border-white/10 p-4 text-sm focus:border-gold" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Phone Number</label>
                  <input name="phoneNumber" type="tel" required className="bg-charcoal/50 border border-white/10 p-4 text-sm focus:border-gold" />
                </div>
              </div>
              <button disabled={isSubmitting} className="w-full bg-gold text-charcoal font-bold py-5 text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl">
                {isSubmitting ? "Processing..." : "Continue to Payment"}
              </button>
            </form>
          </section>
        )}

        {/* STEP 2: PAYMENT SUBMISSION */}
        {registration && !registration.payment && (
          <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-sm shadow-2xl">
            <h2 className="font-serif text-2xl mb-8 text-gold">Step 2: Bank Transfer (ICICI)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-8 bg-white/5 border border-white/5 rounded-sm space-y-4 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">Account Details</p>
                <p className="font-bold text-lg">IIIT Manipur Conference</p>
                <p className="opacity-80">A/C: <span className="text-white font-mono">XXXXXXXXXXXX</span></p>
                <p className="opacity-80">IFSC: <span className="text-white font-mono">ICIC000XXXX</span></p>
                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] uppercase text-gold font-bold">Fee Amount</p>
                    <p className="text-2xl font-serif">{registration.region === 'INR' ? '₹4,000' : '$80'}</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">UTR / Transaction ID</label>
                  <input type="text" className="w-full bg-charcoal/50 border border-white/10 p-4 text-sm focus:border-gold outline-none" onChange={(e) => setTransactionId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold">Upload Receipt</label>
                  {uploadedUrl ? (
                    <div className="text-xs text-green-400 p-4 bg-green-400/5 border border-green-400/20 rounded-sm">✓ File Uploaded</div>
                  ) : (
                    <UploadButton<OurFileRouter, "receiptUploader">
                      endpoint="receiptUploader"
                      onClientUploadComplete={(res) => setUploadedUrl(res[0].url)}
                      onUploadError={(error) => alert(error.message)}
                      appearance={{ button: "bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm p-4 w-full" }}
                    />
                  )}
                </div>
                <button 
                  disabled={!uploadedUrl || !transactionId || isSubmitting} 
                  onClick={async () => {
                    setIsSubmitting(true);
                    const res = await submitPaymentProof(registration.id, transactionId, uploadedUrl);
                    if (res.success) setRegistration(await getRegistrationStatus(session?.user?.id as string));
                    setIsSubmitting(false);
                  }}
                  className="w-full bg-gold text-charcoal font-bold py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl disabled:opacity-30"
                >
                  Confirm Registration
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: VERIFIED / CONFIRMED */}
        {registration?.payment?.status === "VERIFIED" ? (
          <div className="bg-white/[0.02] border border-gold/20 p-20 text-center rounded-sm backdrop-blur-md">
            <div className="w-24 h-24 bg-gold text-charcoal flex items-center justify-center rounded-full mx-auto mb-10 shadow-xl">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="font-serif text-5xl mb-6">Confirmed</h2>
            <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed mb-12">Registration verified for <strong>ICAIAC 2026</strong>. Download your official invitation letter below.</p>
            <button onClick={() => handlePrint()} className="bg-white text-charcoal px-12 py-5 font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-gold transition-all shadow-2xl">
              Download Letter (PDF)
            </button>
            <div className="hidden"><InvitationLetter ref={contentRef} user={session?.user} registration={registration} /></div>
          </div>
        ) : (
          registration?.payment && (
            <div className="bg-white/5 border border-white/10 p-16 text-center rounded-sm">
              <div className="w-16 h-16 bg-gold/10 flex items-center justify-center rounded-full mx-auto mb-8 text-gold text-2xl font-serif">!</div>
              <h2 className="font-serif text-3xl mb-4">Verification Pending</h2>
              <p className="text-white/40 text-sm">UTR: <span className="text-white font-mono">{registration.payment.transactionId}</span></p>
              <p className="text-white/20 text-[10px] uppercase mt-8 tracking-widest">IIIT Manipur staff will verify your payment shortly.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
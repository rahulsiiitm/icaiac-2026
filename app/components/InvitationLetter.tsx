"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

interface Props {
  user: any;
  registration: any;
}

export const InvitationLetter = forwardRef<HTMLDivElement, Props>(({ user, registration }, ref) => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div ref={ref} className="p-16 bg-white text-charcoal font-sans min-h-[1123px] w-[794px] mx-auto relative border-[12px] border-charcoal/5">
      {/* Header with Logo */}
      <div className="flex justify-between items-start border-b-2 border-gold pb-8 mb-12">
        <div className="relative w-20 h-20">
          <Image src="/images/logo.png" alt="ICAIAC Logo" fill className="object-contain" />
        </div>
        <div className="text-right">
          <h1 className="font-serif text-3xl font-bold text-charcoal">ICAIAC 2026</h1>
          <p className="text-[10px] uppercase tracking-widest text-gold font-bold">IIIT Manipur, India</p>
          <p className="text-[10px] text-charcoal/50 mt-1">August 2-5, 2026</p>
        </div>
      </div>

      {/* Date & Ref */}
      <div className="flex justify-between text-sm mb-12 text-charcoal/70">
        <p>Date: {today}</p>
        <p>Reg ID: ICAIAC26-{registration.id.slice(-6).toUpperCase()}</p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-base leading-relaxed">
        <h2 className="text-xl font-bold mb-8">Official Letter of Invitation</h2>
        
        <p>To,</p>
        <p className="font-bold">{user.name}</p>
        <p className="text-sm text-charcoal/70">{registration.institution}</p>

        <p className="pt-4">Dear {user.name},</p>

        <p>
          On behalf of the Organizing Committee, we are pleased to invite you to the 
          <strong> 1st International Conference on Artificial Intelligence and Advanced Computing (ICAIAC 2026)</strong>, 
          hosted by the <strong>Indian Institute of Information Technology (IIIT) Manipur</strong>, Imphal, India.
        </p>

        <p>
          Your registration as a <strong>{registration.category}</strong> has been successfully 
          verified under the transaction ID: <strong>{registration.payment?.transactionId}</strong>.
        </p>

        <p>
          We look forward to your presence and contribution to this global forum of 
          researchers and industry experts.
        </p>
      </div>

      {/* Signature Section */}
      <div className="mt-24">
        <div className="w-48 h-px bg-charcoal/20 mb-4" />
        <p className="font-bold">Organizing Secretary</p>
        <p className="text-sm text-charcoal/60 italic">ICAIAC 2026, IIIT Manipur</p>
      </div>

      {/* Footer Watermark */}
      <div className="absolute bottom-12 left-12 right-12 text-center border-t border-charcoal/10 pt-6">
        <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal/30">
          Organized by Department of Computer Science & Engineering, IIIT Manipur
        </p>
      </div>
    </div>
  );
});

InvitationLetter.displayName = "InvitationLetter";
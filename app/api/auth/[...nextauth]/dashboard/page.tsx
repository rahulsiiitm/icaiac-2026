"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const { data: session, status } = useSession();

  // If the user is not logged in, send them back to sign-in
  if (status === "unauthenticated") {
    redirect("/sign-in");
  }

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-charcoal text-white">
        <div className="animate-pulse font-serif text-xl text-gold">Loading Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-3xl">Portal <span className="text-gold">Dashboard</span></h1>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-gold transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-md">
          <div className="flex items-center gap-6 mb-8">
            {session?.user?.image && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold">
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-2xl">Welcome, {session?.user?.name}</h2>
              <p className="font-sans text-white/50 text-sm">{session?.user?.email}</p>
            </div>
          </div>
          
          <div className="p-6 bg-gold/10 border border-gold/20 rounded-sm">
            <p className="text-gold text-sm font-medium">
              You are successfully logged in! Next, we will set up your registration form here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
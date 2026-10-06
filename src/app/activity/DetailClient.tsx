'use client';

import NwwOneeAIChat from "@/components/NwwOneeAIChat";
import LastCreators from "@/components/LastCreators";
import Support from "@/components/Support";
import LastCommits from "@/components/LastCommits";

export default function DetailClient() {
  return (
    <main className="flex-grow pt-36 pb-16 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col">
        <LastCreators />
        <Support />
        <LastCommits />
      </div>
      <NwwOneeAIChat />
    </main>
  );
}

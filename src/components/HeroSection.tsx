import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative py-20 sm:py-32 max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] max-w-5xl opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500/50"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 space-y-8">
                <h1 className="text-5xl sm:text-7xl font-black text-fill-color tracking-tight leading-tight">
                    Find the Best <br />
                    <span className="text-blue-500">Content Creators</span>
                </h1>
                <p className="text-xl text-fill-color/70 max-w-2xl mx-auto">
                    Discover top creators across Tech, AI, Web3, Design, and more. Filter by niche and language to find exactly who you're looking for.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                    <Link href="/directory" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg shadow-blue-500/25">
                        Explore Directory
                    </Link>
                </div>
            </div>
        </section>
    );
}

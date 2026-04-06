import HeroCanvas from '@/components/HeroCanvas';
import { ArrowRight, Wrench, ShieldCheck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10">
        <HeroCanvas />
        
        <div className="relative z-10 max-w-5xl mt-20 pointer-events-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></div>
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">Serving the Inland Empire • Licensed #1050063 • Family Owned</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-white mb-6 uppercase">
            The Plumbing Team <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">You Call When It</span> <br/>
            <span className="text-[#FFD700]">Has To Be Done Right</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl font-light tracking-tight mb-10">
            No shortcuts. No guessing. Real plumbers. Real work. Done right.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group relative px-8 py-4 bg-[#FFD700] text-black font-bold uppercase tracking-wider text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Get Emergency Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/5 transition-colors">
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* ASYMMETRICAL SERVICE SECTION */}
      <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white mb-4">
              Not a call center.<br/>
              <span className="text-white/40">Real plumbers.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl">
              We don&apos;t guess. We fix it right. Our industrial-grade approach ensures your plumbing infrastructure outlasts the competition.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Dominant Main Service Block (Left-Heavy) */}
            <div className="lg:w-[45%] bg-[#1A1A1A] p-10 md:p-16 border-t-4 border-[#FFD700] relative overflow-hidden group lg:-mt-12 z-10 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wrench className="w-32 h-32" />
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-tight mb-6">Commercial & Industrial Repiping</h3>
              <p className="text-white/60 mb-12 text-lg leading-relaxed">
                Full-scale infrastructure replacement for high-demand facilities. We strip out the old, failing systems and install heavy-duty, code-compliant piping that handles maximum pressure without breaking a sweat.
              </p>
              <button className="text-[#FFD700] font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all">
                Explore Service <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary Stacked Blocks (Right-Heavy Staggered) */}
            <div className="lg:w-[55%] flex flex-col gap-8">
              <div className="bg-[#111111] p-8 md:p-10 border border-white/5 hover:border-white/20 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center ml-0 lg:ml-12">
                <div className="p-4 bg-black rounded-sm">
                  <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-tight mb-2">Sewer Line Trenchless Repair</h4>
                  <p className="text-white/50 text-sm">Non-invasive, epoxy-lined structural repair. We fix the pipe from the inside out, saving your concrete and your budget.</p>
                </div>
              </div>

              <div className="bg-[#111111] p-8 md:p-10 border border-white/5 hover:border-white/20 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center ml-0 lg:ml-24">
                <div className="p-4 bg-black rounded-sm">
                  <Clock className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-tight mb-2">24/7 Emergency Response</h4>
                  <p className="text-white/50 text-sm">When valves fail and pressure drops, we deploy immediately. No answering services, just direct access to master plumbers.</p>
                </div>
              </div>

              <div className="bg-[#111111] p-8 md:p-10 border border-white/5 hover:border-white/20 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center ml-0 lg:ml-12">
                <div className="p-4 bg-black rounded-sm">
                  <Wrench className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-tight mb-2">Hydro-Jetting & Descaling</h4>
                  <p className="text-white/50 text-sm">High-velocity water clearing that obliterates roots, grease, and scale buildup. Restores pipes to factory flow capacity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FOOTER CTA */}
      <section className="relative py-24 bg-[#FFD700] text-black px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Stop Guessing.<br/>Start Fixing.</h2>
            <p className="text-xl font-medium opacity-80">Dispatch a master plumber to your location today.</p>
          </div>
          <button className="px-10 py-5 bg-black text-white font-bold uppercase tracking-widest text-lg hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
            Call (555) 123-4567
          </button>
        </div>
      </section>
    </main>
  );
}

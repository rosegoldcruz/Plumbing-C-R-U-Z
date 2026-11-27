import HeroCanvas from '@/components/HeroCanvas';
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  CalendarCheck,
  LineChart,
  Crown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const problemStats = [
  {
    icon: AlertTriangle,
    value: '20.4%',
    label: 'of new private-sector businesses close within their first year',
    source: 'U.S. Bureau of Labor Statistics, Business Employment Dynamics',
  },
  {
    icon: DollarSign,
    value: '82%',
    label: 'of small-business failures trace back to cash-flow problems — not bad work',
    source: 'U.S. Bank study, cited by CB Insights post-mortem analysis',
  },
  {
    icon: TrendingUp,
    value: '49.4%',
    label: 'are gone within five years. About two-thirds never see year ten',
    source: 'U.S. Bureau of Labor Statistics, Business Employment Dynamics',
  },
  {
    icon: Users,
    value: '77%',
    label: 'of small businesses rely on personal savings for startup capital',
    source: 'SBA / Census Bureau small-business data',
  },
];

const opportunityStats = [
  {
    icon: DollarSign,
    value: '$600B+',
    label:
      'U.S. home services market in 2024 — cleaning, HVAC, plumbing, roofing, electrical, landscaping and beyond — growing 7–9% a year',
    source: 'Home services industry analysis, 2025–2026',
  },
  {
    icon: Star,
    value: '90%+',
    label:
      'of homeowners read reviews before choosing a contractor. Businesses rated 4+ stars earn roughly 32% more revenue than 3-star competitors',
    source: 'Home services consumer research, 2025–2026',
  },
  {
    icon: LineChart,
    value: '29.1%',
    label:
      '10-year survival in the worst-tracked sector vs. 50.5% in the best. Systems — not luck — decide which side of the line you fall on',
    source: 'BLS Business Employment Dynamics, sector survival tables',
  },
  {
    icon: CalendarCheck,
    value: '7.4 hrs',
    label:
      'the average owner loses every week just to scheduling — before marketing, pricing, or hiring get a minute',
    source: 'Small-business scheduling benchmarks, 2026',
  },
];

const offerPillars = [
  {
    title: 'Pricing & Cash-Flow Architecture',
    body: 'The #1 killer is cash, not craft. We rebuild your pricing, deposits, and collections so the business funds its own growth instead of feeding on your savings.',
  },
  {
    title: 'Reputation Engine',
    body: 'Over 90% of homeowners check reviews first, and a 4+ star rating is worth about 32% more revenue. We install a review system that compounds while you sleep.',
  },
  {
    title: 'Recurring Revenue',
    body: 'One-off jobs are a treadmill. Membership plans and maintenance agreements turn volatile call volume into predictable monthly income.',
  },
  {
    title: 'Hiring & Delegation',
    body: 'You cannot build an empire as its best technician. We build your org chart, hiring funnel, and training path so the trucks run without you in one.',
  },
  {
    title: 'KPI Dashboard',
    body: 'BLS data shows survival rates swing from 29% to 50% by sector and habits. You get a simple weekly scoreboard: leads, close rate, average ticket, recurring revenue.',
  },
  {
    title: 'Owner Exit Path',
    body: 'A business that depends on you daily has no market value. We structure it to run — and eventually sell — without you.',
  },
];

const roadmap = [
  {
    phase: 'Phase 01',
    title: 'Diagnose',
    body: 'Financial X-ray: where cash leaks, which jobs actually profit, and what your time is really going to.',
  },
  {
    phase: 'Phase 02',
    title: 'Systemize',
    body: 'Pricing, review engine, booking flow, and SOPs installed. The business starts producing predictable output.',
  },
  {
    phase: 'Phase 03',
    title: 'Scale',
    body: 'Recurring revenue layer, paid acquisition with tracked cost-per-lead, and your first real hires.',
  },
  {
    phase: 'Phase 04',
    title: 'Empire',
    body: 'Multiple crews or locations, manager layer in place, KPI dashboard driving decisions — and you working on it, not in it.',
  },
];

const faqs = [
  {
    q: 'Who is this for?',
    a: 'Owners of service-based businesses — plumbing, HVAC, electrical, roofing, cleaning, landscaping, remodeling, pest control — doing roughly $300K–$5M a year who are stuck doing everything themselves. IBISWorld data shows the vast majority of trade firms sit exactly in that range, run by the owner.',
  },
  {
    q: 'Is this another course?',
    a: 'No. It is hands-on coaching: weekly working sessions, your real numbers on the table, and systems built into your business — not a folder of PDFs.',
  },
  {
    q: 'How fast is results?',
    a: 'Most owners see pricing and cash-flow improvements inside the first 30 days. Reputation and recurring-revenue systems compound over the first two quarters.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on your current revenue and which phase you start in. Book the call, and you will get a straight answer — plus a diagnosis of your business whether or not we work together.',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* HERO */}
      <section className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10">
        <HeroCanvas />

        <div className="relative z-10 max-w-5xl mt-20 pointer-events-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
              Coaching for Service Business Owners • Limited Spots Per Quarter
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-white mb-6 uppercase">
            Stop Running a Job. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              Build an
            </span>{' '}
            <span className="text-[#FFD700]">Empire.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-2xl font-light tracking-tight mb-10">
            The only coaching program that takes proven operators — plumbers,
            electricians, cleaners, roofers — and rebuilds the business around
            them so it scales without eating your life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#book"
              className="group relative px-8 py-4 bg-[#FFD700] text-black font-bold uppercase tracking-wider text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Your Empire Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </a>
            <a
              href="#data"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/5 transition-colors"
            >
              See The Data
            </a>
          </div>
        </div>
      </section>

      {/* THE PROBLEM — DATA WALL */}
      <section id="data" className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white mb-4">
              The odds are real.<br />
              <span className="text-white/40">So is the fix.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl">
              These are not scare tactics. They are federal survival data on
              businesses just like yours. The pattern is consistent: owners do
              not fail from bad work — they fail from bad systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemStats.map((stat) => (
              <div
                key={stat.value + stat.label}
                className="bg-[#1A1A1A] p-10 border-l-4 border-red-500/80 hover:border-red-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4">
                      {stat.value}
                    </div>
                    <p className="text-lg text-white/70 mb-4">{stat.label}</p>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                      Source: {stat.source}
                    </p>
                  </div>
                  <stat.icon className="w-12 h-12 text-red-500/60 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE OPPORTUNITY */}
      <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-black z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white mb-4">
              A $600B market.<br />
              <span className="text-[#FFD700]">Owned by operators.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl">
              Home services is one of the largest and most fragmented markets
              in America — the majority of firms are small, owner-run shops.
              The owners who systemize first take the territory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunityStats.map((stat) => (
              <div
                key={stat.value + stat.label}
                className="bg-[#141414] p-10 border-l-4 border-[#FFD700] hover:border-[#FFD700]/70 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-5xl md:text-6xl font-bold tracking-tighter text-[#FFD700] mb-4">
                      {stat.value}
                    </div>
                    <p className="text-lg text-white/70 mb-4">{stat.label}</p>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                      Source: {stat.source}
                    </p>
                  </div>
                  <stat.icon className="w-12 h-12 text-[#FFD700]/50 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE OFFER */}
      <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white mb-4">
              The Empire Builder
              <br />
              <span className="text-white/40">Coaching Program.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl">
              Six systems, installed in your business, one at a time — each one
              attacking a documented failure point in the data above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerPillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="bg-[#1A1A1A] p-8 border border-white/10 hover:border-[#FFD700]/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-10 h-10 flex items-center justify-center bg-[#FFD700] text-black font-bold text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-white/60 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-black z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white mb-4">
              From truck to empire
              <br />
              <span className="text-white/40">in four moves.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmap.map((step) => (
              <div key={step.phase} className="relative bg-[#141414] p-8 border-t-4 border-white/10 hover:border-[#FFD700] transition-colors">
                <p className="text-xs font-mono tracking-widest text-[#FFD700] uppercase mb-3">{step.phase}</p>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#FFD700] z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-12">
          <Crown className="w-24 h-24 text-black shrink-0 hidden lg:block" />
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-black mb-6">
              Half of your peers
              <br />
              will not make year five.
            </h2>
            <p className="text-lg text-black/70 max-w-2xl mb-8">
              BLS data says roughly 49.4% of new businesses are gone within
              five years and 82% of failures trace to cash flow. The ones who
              survive are not luckier — they run better systems. Book a free
              45-minute Empire Call and leave with your diagnosis either way.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-2xl">
              {[
                'A cash-flow X-ray of your business',
                'Your three biggest profit leaks, named',
                'A recurring-revenue plan for your trade',
                'A straight answer on fit — no pitch theater',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-black font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:coach@plumbingcruz.com?subject=Empire%20Call%20Application"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-black text-[#FFD700] font-bold uppercase tracking-wider text-sm transition-transform hover:scale-105 active:scale-95"
            >
              Apply For Your Empire Call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative w-full py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] z-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white mb-12">
            Straight answers.
          </h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none text-xl font-bold uppercase tracking-tight text-white hover:text-[#FFD700] transition-colors">
                  {faq.q}
                  <span className="text-[#FFD700] text-3xl font-light group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-white/60 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section className="relative w-full py-16 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10 z-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
            Sources — every number on this page is real
          </h3>
          <ul className="text-sm text-white/40 space-y-2 list-disc list-inside">
            <li>U.S. Bureau of Labor Statistics — Business Employment Dynamics: establishment survival by year and sector.</li>
            <li>U.S. Bank study on small-business failure, cited in CB Insights post-mortem analysis: cash flow linked to 82% of failures.</li>
            <li>IBISWorld 2024 industry reports: most home-service trade firms operate at $300K–$5M annual revenue, owner-run.</li>
            <li>Home services industry research (2025–2026): $600B+ U.S. market, 7–9% annual growth; 90%+ of homeowners read reviews; 4+ star ratings earn ~32% more revenue than 3-star.</li>
            <li>SBA Office of Advocacy / U.S. Census Bureau: small-business counts and startup-capital data.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

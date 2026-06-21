import { Link } from "react-router-dom";
import { FiTarget, FiEye, FiZap, FiUsers, FiBookOpen, FiTrendingUp } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { MdOutlineRocketLaunch } from "react-icons/md";

/* ── Data ─────────────────────────────────────────────── */
const steps = [
  {
    icon: <FiBookOpen className="w-6 h-6" />,
    title: "Post Your Projects",
    desc: "Share details about your idea, what skills you need, and set an application deadline.",
    color: "from-blue-600 to-blue-400",
    glow: "shadow-blue-900/40",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "Discover Opportunities",
    desc: "Browse campus posts and find projects that match your skills and interests.",
    color: "from-violet-600 to-violet-400",
    glow: "shadow-violet-900/40",
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: "Apply & Collaborate",
    desc: "Apply with one click. Project owners can see applicants and review IPU rank profiles.",
    color: "from-cyan-600 to-cyan-400",
    glow: "shadow-cyan-900/40",
  },
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    title: "Grow Your Network",
    desc: "Build real connections with GGSIPU students across all departments and batches.",
    color: "from-emerald-600 to-emerald-400",
    glow: "shadow-emerald-900/40",
  },
];

const whyCards = [
  {
    icon: <HiOutlineAcademicCap className="w-6 h-6 text-blue-400" />,
    title: "Built for GGSIPU",
    desc: "Signup requires an @ipu.ac.in email — so every profile is a verified campus student.",
  },
  {
    icon: <MdOutlineRocketLaunch className="w-6 h-6 text-violet-400" />,
    title: "Find Teammates Fast",
    desc: "No endless searching. Post your project, set a deadline, and receive applications directly.",
  },
  {
    icon: <FiBookOpen className="w-6 h-6 text-cyan-400" />,
    title: "Build Your Portfolio",
    desc: "Real project collaborations give you experience and credibility beyond classroom work.",
  },
];

/* ── Component ────────────────────────────────────────── */
const AboutPage = () => {
  return (
    <div className="min-h-screen animate-fade-in">

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2d4a6e 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Exclusively for GGSIPU Students
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Where Campus Ideas
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Find Their Team
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Campus Collab is a project collaboration platform exclusively for GGSIPU students.
            Post your ideas, discover opportunities, and build something meaningful — together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold
                hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-blue-900/40 active:scale-95"
            >
              Join Now — It's Free
            </Link>
            <Link
              to="/home"
              className="px-8 py-3 rounded-xl border border-[#2d4a6e] text-slate-300 font-semibold
                hover:bg-[#1e2d3d] hover:text-white transition-all duration-200"
            >
              Browse Posts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Four simple steps from idea to collaboration.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col gap-4 p-5 rounded-2xl bg-[#0f1923] border border-[#1e2d3d] card-hover animate-slide-up"
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-xs font-bold text-slate-700">0{i + 1}</span>

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg ${step.glow}`}>
                {step.icon}
              </div>
              <h3 className="font-bold text-white text-base">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission + Vision ───────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0f1923] border border-[#1e2d3d] p-8 card-hover">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <FiTarget className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                To provide GGSIPU students with a focused, distraction-free space to discover
                collaborators for real projects — whether it's tech, design, research, or entrepreneurship.
                We believe the best campus experiences come from building things together.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0f1923] border border-[#1e2d3d] p-8 card-hover">
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <FiEye className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                A campus where no idea dies because the right teammate wasn't found. We envision a vibrant
                student community where collaboration is the norm — turning individual strengths into
                collective achievements that outlast the semester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Campus Collab ──────────────────────────── */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why Campus Collab?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Built specifically for the GGSIPU community — not a generic job board.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 stagger">
          {whyCards.map((card) => (
            <div key={card.title} className="flex flex-col gap-3 p-6 rounded-2xl bg-[#0f1923] border border-[#1e2d3d] card-hover animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="font-bold text-white">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2847] via-[#0f1923] to-[#0d1117] border border-[#2d4a6e] p-12">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2d4a6e 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to build something?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              Join hundreds of GGSIPU students already posting and discovering campus collaborations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold
                  hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-blue-900/40 active:scale-95"
              >
                Create Your Account
              </Link>
              <Link
                to="/home"
                className="px-8 py-3 rounded-xl border border-[#2d4a6e] text-slate-300 font-semibold
                  hover:bg-[#1e2d3d] hover:text-white transition-all duration-200"
              >
                Browse as Guest
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
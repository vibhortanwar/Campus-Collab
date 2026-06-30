import { Link } from "react-router-dom";
import { FiTarget, FiEye, FiZap, FiUsers, FiBookOpen, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { MdOutlineRocketLaunch } from "react-icons/md";

/* ── Component ────────────────────────────────────────── */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      
      {/* ── Hero Section (2-Column Asymmetric) ── */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authentic Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#161f2c] border border-slate-700 text-xs font-semibold tracking-wide uppercase text-blue-400">
              🏫 Guru Gobind Singh Indraprastha University
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
              Where GGSIPU students connect to build real projects.
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-xl">
              Campus Collab is a student-driven platform designed exclusively for the IPU community. Skip the social clutter and find teammates for hackathons, research, startup ideas, and major/minor projects.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition duration-200 active:scale-95 text-center w-full sm:w-auto"
              >
                Join the Platform
              </Link>
              <Link
                to="/home"
                className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-[#161f2c] transition duration-200 text-center w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Browse Projects <FiArrowRight />
              </Link>
            </div>
          </div>
          
          {/* Right Column: Simulated Live Platform Post (No AI glows, pure crisp UI) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f1923] border border-[#1e2d3d] rounded-xl p-6 shadow-2xl relative select-none">
              <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Open for applications
              </div>
              
              {/* Post Owner info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                  AV
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aman Verma</h4>
                  <p className="text-xs text-slate-500">USICT · B.Tech CSE (Batch 2026)</p>
                </div>
              </div>
              
              {/* Project description */}
              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                Smart Campus Map & Navigation Mobile App
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                We are building a React Native application to help freshers locate labs, blocks, and hostels inside the Dwarka campus. Need a student who knows Mapbox/OpenStreetMap integrations.
              </p>
              
              {/* Skills looking for */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Looking for:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded">React Native</span>
                  <span className="text-xs px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded">UI/UX Design</span>
                  <span className="text-xs px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded">GIS Mapping</span>
                </div>
              </div>
              
              {/* Applications count & deadline bar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1e2d3d] text-xs text-slate-400">
                <span className="font-semibold text-blue-400">⚡ 5 applications received</span>
                <span>Deadline: July 15, 2026</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── Platform Statistics Bar ── */}
      <section className="max-w-6xl mx-auto mb-20 border-y border-[#1e2d3d] py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Verified IPU Emails</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">USICT & BCIIT</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Multi-College Support</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">Hackathons</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Direct Teammate Search</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">No Ads</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">100% Academic Focus</p>
          </div>
        </div>
      </section>

      {/* ── Handcrafted How It Works Section (Horizontal Pipeline) ── */}
      <section className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Simple, straightforward steps.</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">How Campus Collab helps you from ideation to launching.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-[#0f1923] border border-[#1e2d3d] p-6 rounded-lg relative">
            <span className="text-4xl font-extrabold text-slate-800 absolute top-4 right-4">01</span>
            <div className="w-10 h-10 rounded-md bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <HiOutlineAcademicCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Verify College Email</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Login or sign up with your official IPU student email. Only verified campus members can post or apply.
            </p>
          </div>

          <div className="bg-[#0f1923] border border-[#1e2d3d] p-6 rounded-lg relative">
            <span className="text-4xl font-extrabold text-slate-800 absolute top-4 right-4">02</span>
            <div className="w-10 h-10 rounded-md bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FiBookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Post Your Idea</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Define your project scope, state required skills (e.g. Flutter, Figma), and set an application deadline.
            </p>
          </div>

          <div className="bg-[#0f1923] border border-[#1e2d3d] p-6 rounded-lg relative">
            <span className="text-4xl font-extrabold text-slate-800 absolute top-4 right-4">03</span>
            <div className="w-10 h-10 rounded-md bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FiZap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Receive Applications</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Review applicant profile pages, check their departments, batch years, and read their expressions of interest.
            </p>
          </div>

          <div className="bg-[#0f1923] border border-[#1e2d3d] p-6 rounded-lg relative">
            <span className="text-4xl font-extrabold text-slate-800 absolute top-4 right-4">04</span>
            <div className="w-10 h-10 rounded-md bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FiUsers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Build Together</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Select your teammates, exchange contact details, and start building. Real portfolio items built on campus.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision (Clean minimalist panel side-by-side) ── */}
      <section className="max-w-5xl mx-auto mb-20 grid md:grid-cols-2 gap-8">
        <div className="bg-[#0f1923] border border-[#1e2d3d] p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-slate-850 flex items-center justify-center text-slate-400">
              <FiTarget className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Provide GGSIPU students with a direct, distraction-free environment to locate developers, designers, writers, and co-founders. We eliminate the noise of typical social networks so you can focus entirely on collaborative development.
          </p>
        </div>

        <div className="bg-[#0f1923] border border-[#1e2d3d] p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-slate-850 flex items-center justify-center text-slate-400">
              <FiEye className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Vision</h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Foster a strong culture of peer-to-peer building across all GGSIPU affiliated colleges. We want to ensure that no promising college project or hackathon idea falls flat simply due to a lack of local, capable team members.
          </p>
        </div>
      </section>

      {/* ── Clean CTA Section (No glows, premium borders) ── */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[#0f1923] border border-[#1e2d3d] rounded-xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to start?</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Create an account with your official student email or continue as a guest to see what project listings are active today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-colors active:scale-95"
            >
              Sign Up (IPU Email)
            </Link>
            <Link
              to="/home"
              className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg font-semibold transition-colors"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
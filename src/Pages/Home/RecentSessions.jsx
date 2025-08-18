import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  Play,
  Star,
  BookmarkPlus,
  MapPin,
} from "lucide-react";

/**
 * RecentSessions Component
 * -----------------------------------------
 * Props
 *  - sessions: Array<{
 *      id: string;
 *      title: string;
 *      subject: string;          // e.g. "Data Structures"
 *      level: "beginner" | "intermediate" | "advanced";
 *      startedAt: string;        // ISO date string
 *      durationMins: number;
 *      attendees: number;
 *      rating?: number;          // 0 - 5
 *      thumbnail?: string;       // image URL
 *      instructor: { name: string; avatar?: string };
 *      location?: string;        // e.g. "Online" / "Room 204"
 *    }>
 *  - isLoading?: boolean
 *  - error?: string | null
 *  - onJoin?: (sessionId: string) => void
 *  - onSave?: (sessionId: string) => void
 *
 * Notes
 *  - No hardcoded colors: uses DaisyUI tokens (bg-base-*, text-base-*, btn-primary, etc.)
 *  - Fully responsive: mobile → desktop grids
 *  - Smooth on-scroll animations via Framer Motion
 *  - Accessible and keyboard friendly
 */

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.45, ease: "easeOut" },
  }),
};

const levelBadge = (level) => {
  const map = {
    beginner: "badge-success",
    intermediate: "badge-warning",
    advanced: "badge-error",
  };
  return map[level] || "badge-ghost";
};

const formatDuration = (mins) => {
  if (!mins && mins !== 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const SkeletonCard = () => (
  <div className="card bg-base-100 shadow-md animate-pulse">
    <div className="h-40 w-full bg-base-200" />
    <div className="card-body gap-3">
      <div className="h-4 w-2/3 bg-base-200 rounded" />
      <div className="h-3 w-1/3 bg-base-200 rounded" />
      <div className="h-3 w-1/2 bg-base-200 rounded" />
      <div className="mt-2 h-9 w-full bg-base-200 rounded" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="w-full flex flex-col items-center justify-center text-center p-10">
    <BookOpen className="w-10 h-10 opacity-70" />
    <h3 className="mt-3 text-lg font-semibold">কোন সদ্য সেশন পাওয়া যায়নি</h3>
    <p className="opacity-70">নতুন সেশন তৈরি হলে এখানে দেখতে পাবেন।</p>
  </div>
);

const RecentSessions = ({ sessions = [], isLoading = false, error = null, onJoin, onSave }) => {
  return (
    <section id="recent-sessions" className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Recent Sessions
            </h2>
            <p className="opacity-70">আপনার স্টাডি-কোর্স প্ল্যাটফর্মে সদ্য যুক্ত হওয়া সেশনগুলো</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="#recent-sessions" className="btn btn-ghost btn-sm">Jump to Top</a>
            <a href="#" className="btn btn-primary btn-sm">View All</a>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : sessions.length === 0
            ? <div className="col-span-full"><EmptyState /></div>
            : sessions.map((s, i) => (
                <motion.article
                  key={s.id}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow focus-within:shadow-lg"
                >
                  {/* Media */}
                  <figure className="relative">
                    {s.thumbnail ? (
                      <img
                        src={s.thumbnail}
                        alt={s.title}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-40 w-full bg-base-200 flex items-center justify-center">
                        <Play className="w-8 h-8 opacity-60" />
                      </div>
                    )}
                    <div className="absolute left-3 bottom-3 flex gap-2">
                      <div className={`badge ${levelBadge(s.level)}`}>{s.level}</div>
                      {s.location && (
                        <div className="badge badge-outline gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {s.location}
                        </div>
                      )}
                    </div>
                  </figure>

                  {/* Body */}
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="card-title text-base md:text-lg leading-snug line-clamp-2">
                          {s.title}
                        </h3>
                        <p className="text-sm opacity-70 flex items-center gap-2 mt-1">
                          <BookOpen className="w-4 h-4" /> {s.subject}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Save session"
                        className="btn btn-ghost btn-sm"
                        onClick={() => onSave?.(s.id)}
                      >
                        <BookmarkPlus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(s.startedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(s.durationMins)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{s.attendees ?? 0} joined</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        <span>{typeof s.rating === "number" ? s.rating.toFixed(1) : "New"}</span>
                      </div>
                    </div>

                    <div className="divider my-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            {s.instructor?.avatar ? (
                              <img src={s.instructor.avatar} alt={s.instructor.name} />
                            ) : (
                              <div className="w-full h-full bg-base-200" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm opacity-80">{s.instructor?.name || "Unknown"}</span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onJoin?.(s.id)}
                      >
                        Join Session
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
};

export default RecentSessions;




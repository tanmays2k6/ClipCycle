"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Krishnan",
    handle: "@ananya.creates",
    platform: "Instagram",
    avatar: "AK",
    gradient: "from-violet-400 to-violet-600",
    quote:
      "I used to lose at least 3 content ideas a week. Now everything goes into ClipCycle and the AI actually suggests which ones would work best for Reels vs. Carousels. Game changer.",
    rating: 5,
  },
  {
    name: "Prateek Rajput",
    handle: "@prateekr",
    platform: "YouTube",
    avatar: "PR",
    gradient: "from-red-400 to-red-600",
    quote:
      "The AI content generation is insane. I dropped in a rough idea about \"productivity tools for students\" and got a full YouTube script outline in seconds. This saves me hours every week.",
    rating: 5,
  },
  {
    name: "Sneha Mehta",
    handle: "@sneha.writes",
    platform: "LinkedIn",
    avatar: "SM",
    gradient: "from-blue-400 to-blue-600",
    quote:
      "As someone who posts daily on LinkedIn, having all my ideas organized by topic and auto-tagged by relevance is a lifesaver. My content consistency went from 3x to 7x per week.",
    rating: 5,
  },
  {
    name: "Vikram Kapoor",
    handle: "@vikramk",
    platform: "Twitter / X",
    avatar: "VK",
    gradient: "from-cyan-400 to-cyan-600",
    quote:
      "I screenshot tweets for inspiration constantly. ClipCycle captures them, understands the angle, and helps me write my own version. It's like having a creative assistant in my pocket.",
    rating: 5,
  },
  {
    name: "Nisha Rajan",
    handle: "@nisha.studies",
    platform: "Instagram",
    avatar: "NR",
    gradient: "from-pink-400 to-pink-600",
    quote:
      "Being a studygrammer, I get ideas during lectures all the time. A quick voice note into ClipCycle and it's captured, tagged, and ready to turn into a carousel when I have time.",
    rating: 5,
  },
  {
    name: "Rohan Desai",
    handle: "@rohan.dev",
    platform: "YouTube",
    avatar: "RD",
    gradient: "from-emerald-400 to-emerald-600",
    quote:
      "I was using Notion, Google Keep, and Apple Notes to save ideas. Now it's just ClipCycle. The semantic search alone is worth it — I search by vibe and it finds exactly what I need.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden" id="testimonials">
      {/* Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
            Testimonials
          </span>
          <h2 className="mt-4 text-section max-w-2xl mx-auto">
            Loved by <span className="text-text-secondary">student creators</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
            Hear from creators who stopped losing ideas and started creating
            more consistently.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-8 rounded-3xl glass border border-border hover:border-border-hover transition-all duration-500 hover:shadow-lg flex flex-col h-full"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-text-secondary leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border/50">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-semibold text-white shrink-0`}
                >
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-text-primary truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-tertiary truncate">
                    {t.handle} · {t.platform}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

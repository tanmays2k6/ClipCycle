"use client";

import { motion } from "framer-motion";
import { Star, GraduationCap, Building2, Code2 } from "lucide-react";
import { cn } from "@/utils/cn";

const testimonials = [
  {
    name: "Ananya Krishnan",
    handle: "@ananya.creates",
    platform: "Instagram",
    avatar: "AK",
    color: "bg-purple-100 text-purple-700",
    quote:
      "I used to lose at least 3 content ideas a week. Now everything goes into ClipCycle and the AI actually suggests which ones would work best for Reels vs. Carousels. Game changer.",
    rating: 5,
  },
  {
    name: "Prateek Rajput",
    handle: "@prateekr",
    platform: "YouTube",
    avatar: "PR",
    color: "bg-blue-100 text-blue-700",
    quote:
      "The AI content generation is insane. I dropped in a rough idea about 'productivity tools for students' and got a full YouTube script outline in seconds. This saves me hours every week.",
    rating: 5,
  },
  {
    name: "Sneha Mehta",
    handle: "@sneha.writes",
    platform: "LinkedIn",
    avatar: "SM",
    color: "bg-green-100 text-green-700",
    quote:
      "As someone who posts daily on LinkedIn, having all my ideas organized by topic and auto-tagged by relevance is a lifesaver. My content consistency went from 3x to 7x per week.",
    rating: 5,
  },
  {
    name: "Vikram Kapoor",
    handle: "@vikramk",
    platform: "Twitter / X",
    avatar: "VK",
    color: "bg-orange-100 text-orange-700",
    quote:
      "I screenshot tweets for inspiration constantly. ClipCycle captures them, understands the angle, and helps me write my own version. It's like having a creative assistant in my pocket.",
    rating: 5,
  },
  {
    name: "Nisha Rajan",
    handle: "@nisha.studies",
    platform: "Instagram",
    avatar: "NR",
    color: "bg-pink-100 text-pink-700",
    quote:
      "Being a studygrammer, I get ideas during lectures all the time. A quick voice note into ClipCycle and it's captured, tagged, and ready to turn into a carousel when I have time.",
    rating: 5,
  },
  {
    name: "Rohan Desai",
    handle: "@rohan.dev",
    platform: "YouTube",
    avatar: "RD",
    color: "bg-teal-100 text-teal-700",
    quote:
      "I was using Notion, Google Keep, and Apple Notes to save ideas. Now it's just ClipCycle. The semantic search alone is worth it — I search by vibe and it finds exactly what I need.",
    rating: 5,
  },
];

const communities = [
  { name: "Stanford University", icon: GraduationCap },
  { name: "Y Combinator Startup School", icon: Building2 },
  { name: "Major League Hacking", icon: Code2 },
  { name: "MIT CS", icon: GraduationCap },
  { name: "Creator Economy", icon: Building2 },
];

export function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-50 dark:bg-secondary border-b border-border/50" id="testimonials">
      <div className="container-premium relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
          >
            Social Proof
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2"
          >
            Loved by student creators.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body mt-6"
          >
            Join thousands of creators who are already using ClipCycle to organize their content ideas.
          </motion.p>
        </div>

        {/* Communities Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 items-center mb-20 py-8 border-y border-border/50 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {communities.map((community, index) => (
            <div key={index} className="flex items-center gap-2">
              <community.icon className="w-5 h-5 text-foreground" />
              <span className="font-semibold text-foreground text-sm tracking-tight">{community.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max max-w-[1400px] mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card-base hover-lift flex flex-col h-full bg-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-body flex-1 text-foreground leading-relaxed font-medium">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border">
                <div
                  className={cn("w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold shrink-0", testimonial.color)}
                >
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-body text-[16px] font-bold truncate text-foreground leading-tight">
                      {testimonial.name}
                    </p>
                    {/* Verified Badge */}
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-caption truncate mt-0">
                    {testimonial.handle} · {testimonial.platform}
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

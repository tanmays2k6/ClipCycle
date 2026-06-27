const fs = require('fs');
const path = require('path');

function fixFile(filePath, replacements) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
      content = content.replace(search, replace);
    }
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed ${filePath}`);
    }
  } catch (e) {
    console.error(`Error fixing ${filePath}:`, e);
  }
}

fixFile('src/components/landing/pricing.tsx', [
  [/doesn't/g, "doesn&apos;t"],
  [/ClipCycle's/g, "ClipCycle&apos;s"],
  [/You're/g, "You&apos;re"],
  [/you're/g, "you&apos;re"],
  [/Let's/g, "Let&apos;s"]
]);

fixFile('src/components/landing/problem.tsx', [
  [/LinkIcon, /g, ""],
  [/you're/g, "you&apos;re"],
  [/doesn't/g, "doesn&apos;t"],
  [/\(screenshot, i\)/g, "(screenshot)"]
]);

fixFile('src/components/layout/sidebar.tsx', [
  [/, AnimatePresence /g, " "],
  [/const userEmail = /g, "const _userEmail = "]
]);

fixFile('src/components/layout/topbar.tsx', [
  [/import { cn } from "@\/utils\/cn";\n/g, ""]
]);

fixFile('src/components/shared/tabs.tsx', [
  [/useState, /g, ""],
  [/, useState/g, ""]
]);

fixFile('src/components/ui/logo.tsx', [
  [/const { showText } = props;/g, ""]
]);

fixFile('src/features/calendar/components/schedule-modal.tsx', [
  [/Calendar as CalendarIcon, /g, "Calendar, "],
  [/CalendarIcon/g, "Calendar"],
  [/value: any/g, "value: string"]
]);

fixFile('src/features/ideas/components/idea-detail-view.tsx', [
  [/Archive, /g, ""],
  [/statusToChange/g, "_statusToChange"],
  [/tag/g, "_tag"]
]);

fixFile('src/app/dashboard/client.tsx', [
  [/useState, /g, ""],
  [/, useState/g, ""],
  [/activeIdea: any/g, "activeIdea: unknown"]
]);

fixFile('src/app/dashboard/ideas/client.tsx', [
  [/const \[ideas, setIdeas\]/g, "const [ideas, _setIdeas]"],
  [/const \[isSearchFocused, setIsSearchFocused\]/g, "const [_isSearchFocused, setIsSearchFocused]"]
]);

fixFile('src/app/dashboard/ideas/[id]/loading.tsx', [
  [/import { motion } from "framer-motion";\n/g, ""]
]);

fixFile('src/app/dashboard/ideas/new/page.tsx', [
  [/import { motion } from "framer-motion";\n/g, ""]
]);

fixFile('src/app/auth/login/page.tsx', [
  [/, useEffect /g, " "]
]);

console.log("Done");

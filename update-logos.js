/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const updates = [
  {
    file: 'src/components/layout/sidebar.tsx',
    replacements: [
      { from: '<Logo size="sm" variant={collapsed ? "icon" : "full"} animated />', to: '<Logo size={32} animated />' }
    ]
  },
  {
    file: 'src/components/layout/topbar.tsx',
    replacements: [
      { from: '<Logo size="sm" variant="icon" animated />', to: '<Logo size={40} animated />' }
    ]
  },
  {
    file: 'src/components/landing/footer.tsx',
    replacements: [
      { from: '<Logo size="sm" variant="icon" />', to: '<Logo size={36} />' }
    ]
  },
  {
    file: 'src/components/landing/problem.tsx',
    replacements: [
      { from: '<Logo size="sm" variant="icon" animated />', to: '<Logo size={40} animated />' },
      { from: '<Logo size="md" variant="icon" animated />', to: '<Logo size={48} animated />' }
    ]
  },
  {
    file: 'src/components/landing/navbar.tsx',
    replacements: [
      { from: '<Logo size="sm" variant="icon" animated />', to: '<Logo size={40} animated />' }
    ]
  },
  {
    file: 'src/components/landing/hero.tsx',
    replacements: [
      { from: '<Logo size="md" variant="icon" animated />', to: '<Logo size={64} animated />' }
    ]
  },
  {
    file: 'src/app/not-found.tsx',
    replacements: [
      { from: '<Logo size="xl" variant="icon" animated />', to: '<Logo size={80} animated />' }
    ]
  },
  {
    file: 'src/app/loading.tsx',
    replacements: [
      { from: '<Logo size="lg" variant="icon" />', to: '<Logo size={64} />' }
    ]
  },
  {
    file: 'src/app/dashboard/client.tsx',
    replacements: [
      { from: '<Logo size="sm" variant="icon" />', to: '<Logo size={64} />' }
    ]
  },
  {
    file: 'src/app/dashboard/ideas/client.tsx',
    replacements: [
      { from: '<Logo size="md" variant="icon" />', to: '<Logo size={64} />' }
    ]
  },
  {
    file: 'src/app/auth/layout.tsx',
    replacements: [
      { from: '<Logo size="md" variant="icon" animated />', to: '<Logo size={80} animated />' }
    ]
  }
];

updates.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    replacements.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.replace(from, to);
        changed = true;
      }
    });
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No matches found in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

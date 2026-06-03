const fs = require('fs');
const pages = ['pos', 'inventory', 'reports', 'history', 'purchasing', 'settings'];
const htmlTemplate = (page) => `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>SweetPOS &amp; Sip - ${page.toUpperCase()}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../shared/shared.css">
  <link rel="stylesheet" href="${page}.css">
  <script src="https://unpkg.com/dexie/dist/dexie.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  ${page === 'reports' ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css"><script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>' : ''}
</head>
<body>
  <div id="app"></div>
  <script src="../shared/db.js"></script>
  <script src="../shared/state.js"></script>
  <script src="../shared/nav.js"></script>
  <script src="${page}.js"></script>
</body>
</html>`;

pages.forEach(page => {
  if (!fs.existsSync(page)) fs.mkdirSync(page);
  fs.writeFileSync(`${page}/${page}.html`, htmlTemplate(page));
  fs.writeFileSync(`${page}/${page}.css`, '/* Styles for ' + page + ' */\n');
  fs.writeFileSync(`${page}/${page}.js`, `// Script for ${page}\n\nasync function init() {\n  await initDatabase();\n  await loadDatabase();\n  loadSession();\n  loadAppState();\n  initDarkTheme();\n  \n  if (!state.user) {\n    window.location.href = '../index.html';\n    return;\n  }\n  \n  renderMainLayout('${page}');\n  renderPage();\n}\n\nfunction renderPage() {\n  const container = document.getElementById('main-content-wrapper');\n  if (container) {\n    container.innerHTML = '<h1>${page}</h1>';\n  }\n}\n\nwindow.addEventListener('DOMContentLoaded', init);\n`);
});
console.log('Scaffolding complete.');

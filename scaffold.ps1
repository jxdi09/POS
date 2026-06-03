$pages = @("pos", "inventory", "reports", "history", "purchasing", "settings")

foreach ($page in $pages) {
    if (!(Test-Path -Path $page)) {
        New-Item -ItemType Directory -Path $page
    }

    $htmlContent = @"
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>SweetPOS &amp; Sip - $($page.ToUpper())</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../shared/shared.css">
  <link rel="stylesheet" href="${page}.css">
  <script src="https://unpkg.com/dexie/dist/dexie.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
"@

    if ($page -eq "reports") {
        $htmlContent += @"
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
  <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
"@
    }

    $htmlContent += @"
</head>
<body>
  <div id="app"></div>
  <script src="../shared/db.js"></script>
  <script src="../shared/state.js"></script>
  <script src="../shared/nav.js"></script>
  <script src="${page}.js"></script>
</body>
</html>
"@

    $jsContent = @"
// Script for $page

async function init() {
  await initDatabase();
  await loadDatabase();
  loadSession();
  loadAppState();
  initDarkTheme();
  
  if (!state.user) {
    window.location.href = '../index.html';
    return;
  }
  
  renderMainLayout('$page');
  renderPage();
}

function renderPage() {
  const container = document.getElementById('main-content-wrapper');
  if (container) {
    container.innerHTML = '<h1>$page</h1>';
  }
}

window.addEventListener('DOMContentLoaded', init);
"@

    Set-Content -Path "$page/${page}.html" -Value $htmlContent
    Set-Content -Path "$page/${page}.css" -Value "/* Styles for $page */"
    Set-Content -Path "$page/${page}.js" -Value $jsContent
}
Write-Output "Scaffolding complete."

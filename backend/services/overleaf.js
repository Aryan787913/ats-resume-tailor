const fetch = require('node-fetch');

function getCookieHeader() {
  const SESSION_COOKIE = decodeURIComponent(process.env.OVERLEAF_SESSION_COOKIE);
  const GCLB_TOKEN = process.env.OVERLEAF_GCLB_TOKEN;
  return `overleaf_session2=${SESSION_COOKIE}; GCLB=${GCLB_TOKEN}`;
}

// Step 4: Fetch CSRF token
async function fetchCsrfToken() {
  const cookieHeader = getCookieHeader();
  const response = await fetch('https://www.overleaf.com/project', {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Cookie': cookieHeader,
    },
  });

  const html = await response.text();
  const match = html.match(/name="ol-csrfToken" content="([^"]+)"/)
    || html.match(/content="([^"]+)" name="ol-csrfToken"/);

  if (!match) {
    throw new Error('Overleaf session expired. Please refresh your session cookie.');
  }

  return match[1];
}

// Step 5: Create project with LaTeX
async function createOverleafProject(latexCode) {
  const csrfToken = await fetchCsrfToken();
  const cookieHeader = getCookieHeader();

  const params = new URLSearchParams();
  params.append('_csrf', csrfToken);
  params.append('snip', latexCode);
  params.append('engine', 'pdflatex');

  const response = await fetch('https://www.overleaf.com/docs', {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Referer': 'https://www.overleaf.com/project',
      'Origin': 'https://www.overleaf.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Cookie': cookieHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
    redirect: 'manual', // Do NOT follow redirects
  });

  const locationHeader = response.headers.get('location') || '';
  const projectIdMatch = locationHeader.match(/\/project\/([a-f0-9]{24})/);

  if (!projectIdMatch) {
    throw new Error(`Overleaf did not return a project ID. Location: ${locationHeader}`);
  }

  const projectId = projectIdMatch[1];
  return { projectId, csrfToken };
}

// Step 6: Compile the project
async function compileProject(projectId, csrfToken) {
  const cookieHeader = getCookieHeader();
  const projectUrl = `https://www.overleaf.com/project/${projectId}`;

  const params = new URLSearchParams();
  params.append('check', 'silent');
  params.append('draft', 'true');
  params.append('stopOnFirstError', 'false');

  const response = await fetch(`https://www.overleaf.com/project/${projectId}/compile`, {
    method: 'POST',
    headers: {
      'Cookie': cookieHeader,
      'X-Csrf-Token': csrfToken,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  const outputFiles = data.outputFiles || [];
  const pdfFile = outputFiles.find(f => f.path === 'output.pdf');

  if (!pdfFile) {
    const err = new Error(`PDF compilation failed. Open the project in Overleaf to see the log.`);
    err.projectUrl = projectUrl;
    throw err;
  }

  const pdfUrl = 'https://www.overleaf.com' + pdfFile.url;
  return { pdfUrl, projectUrl };
}

// Step 7: Download the PDF and return base64
async function downloadPdf(pdfUrl) {
  const cookieHeader = getCookieHeader();

  const response = await fetch(pdfUrl, {
    method: 'GET',
    headers: {
      'Cookie': cookieHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.buffer();
  return buffer.toString('base64');
}

module.exports = { createOverleafProject, compileProject, downloadPdf };

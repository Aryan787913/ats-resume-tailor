const fetch = require('node-fetch');

function getCookieHeader() {
  const SESSION_COOKIE = decodeURIComponent(process.env.OVERLEAF_SESSION_COOKIE);
  const GCLB_TOKEN = process.env.OVERLEAF_GCLB_TOKEN;
  let cookie = `overleaf_session2=${SESSION_COOKIE}`;
  if (GCLB_TOKEN) cookie += `; GCLB=${GCLB_TOKEN}`;
  return cookie;
}

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
    redirect: 'manual',
  });
  const locationHeader = response.headers.get('location') || '';
  const projectIdMatch = locationHeader.match(/\/project\/([a-f0-9]{24})/);
  if (!projectIdMatch) {
    throw new Error(`Overleaf did not return a project ID. Location: ${locationHeader}`);
  }
  const projectId = projectIdMatch[1];
  return { projectId, csrfToken };
}

async function compileProject(projectId, csrfToken) {
  const cookieHeader = getCookieHeader();
  const projectUrl = `https://www.overleaf.com/project/${projectId}`;
  const params = new URLSearchParams();
  params.append('check', 'silent');
  params.append('draft', 'false');
  params.append('stopOnFirstError', 'false');

  await new Promise(resolve => setTimeout(resolve, 5000));

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
  console.log('COMPILE STATUS:', data.status);
  console.log('OUTPUT FILES:', JSON.stringify(data.outputFiles));
  console.log('COMPILE DATA:', JSON.stringify(data).substring(0, 500));

  const outputFiles = data.outputFiles || [];
  const pdfFile = outputFiles.find(f => f.path === 'output.pdf');

  if (!pdfFile) {
    const err = new Error(`PDF compilation failed. Status: ${data.status}. Open the project in Overleaf to see the log.`);
    err.projectUrl = projectUrl;
    throw err;
  }

  const pdfUrl = 'https://www.overleaf.com' + pdfFile.url;
  return { pdfUrl, projectUrl };
}

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

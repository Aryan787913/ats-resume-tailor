async function compileProject(projectId, csrfToken) {
  const cookieHeader = getCookieHeader();
  const projectUrl = `https://www.overleaf.com/project/${projectId}`;

  const params = new URLSearchParams();
  params.append('check', 'silent');
  params.append('draft', 'false');
  params.append('stopOnFirstError', 'false');

  // Wait before compiling
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
  
  // LOG everything so we can debug
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

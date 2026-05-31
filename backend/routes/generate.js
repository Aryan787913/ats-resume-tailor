const express = require('express');
const router = express.Router();
const { rewriteResume, convertToLatex } = require('../services/claude');
const { createOverleafProject, compileProject, downloadPdf } = require('../services/overleaf');

router.post('/', async (req, res) => {
  const { jobDescription, currentResume } = req.body;

  if (!jobDescription || !currentResume) {
    return res.status(400).json({ status: 'error', message: 'Both jobDescription and currentResume are required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ status: 'error', message: 'Groq API key not configured.' });
  }
  if (!process.env.OVERLEAF_SESSION_COOKIE) {
    return res.status(500).json({ status: 'error', message: 'Overleaf session cookie not configured.' });
  }

  try {
    console.log('[Step 1] Rewriting resume with Claude...');
    const markdownResume = await rewriteResume(jobDescription, currentResume);

    console.log('[Step 2] Converting to LaTeX...');
    const latexCode = await convertToLatex(markdownResume);

    console.log('[Step 3-5] Creating Overleaf project...');
    const { projectId, csrfToken } = await createOverleafProject(latexCode);

    console.log('[Step 6] Compiling PDF...');
    const { pdfUrl, projectUrl } = await compileProject(projectId, csrfToken);

    console.log('[Step 7] Downloading PDF...');
    const pdfBase64 = await downloadPdf(projectId);

    return res.json({
      status: 'success',
      projectUrl,
      pdfUrl,
      pdfBase64,
    });

  } catch (err) {
    console.error('[generate] Error:', err.message);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'An unexpected error occurred.',
      projectUrl: err.projectUrl || null,
    });
  }
});

module.exports = router;

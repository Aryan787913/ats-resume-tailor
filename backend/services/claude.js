const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

const REWRITER_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Generate a completely new ATS-optimized resume using the Job Description and Current Resume provided.

Output ONLY the resume in this exact format, nothing else:

FULL NAME
Address: [address]
Phone: [phone] | Email: [email] | LinkedIn: [linkedin] | GitHub: [github]

PROFESSIONAL SUMMARY
[2-3 sentence summary]

EDUCATION
[Degree] - [Institution] - [Location] - [Dates]

WORK EXPERIENCE
[Company] | [Title] | [Location] | [Dates]
- [bullet point]
- [bullet point]
- [bullet point]

SKILLS
[Category]: [skills]
[Category]: [skills]

PROJECTS
[Project Name]
- [bullet point]

ACHIEVEMENTS
- [achievement]`;

const LATEX_PROMPT = `Convert the resume text below into LaTeX. Output ONLY raw LaTeX code, no markdown, no backticks, no explanations.

CRITICAL RULES:
1. Every special character MUST be escaped: & becomes \&, % becomes \%, $ becomes \$, # becomes \#, _ becomes \_, { becomes \{, } becomes \}
2. Do NOT use any math mode or dollar signs anywhere in the content
3. Do NOT use any packages not listed in the template
4. Do NOT add \usepackage{amsmath} or any extra packages
5. Keep all text simple ASCII only - no special unicode characters
6. Output ONLY the LaTeX starting with \documentclass
7. NEVER use $ signs in content text - they break LaTeX

Use this exact template:

\documentclass[letterpaper,11pt]{article}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage[T1]{fontenc}
\usepackage{fontawesome5}
\definecolor{light-grey}{gray}{0.83}
\definecolor{dark-grey}{gray}{0.3}
\definecolor{text-grey}{gray}{.08}
\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}
\setlength{\footskip}{4.08pt}
\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\titleformat{\section}{\bfseries\vspace{2pt}\raggedright\large}{}{0em}{}[\color{light-grey}{\titlerule[2pt]}\vspace{-4pt}]
\newcommand{\resumeItem}[1]{\item\small{#1}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-1pt}\item
    \begin{tabular*}{\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & {\color{dark-grey}\small #2}\\
      \textit{\small#3} & {\color{dark-grey}\small #4}\\
    \end{tabular*}\vspace{-4pt}
}
\newcommand{\resumeProjectHeading}[2]{
  \item
  \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
    \small#1 & {\color{dark-grey}\small #2}\\
  \end{tabular*}\vspace{-4pt}
}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0in,label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.15in]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-4pt}}
\color{text-grey}
\begin{document}

\begin{center}
  \textbf{\Huge CANDIDATE NAME} \\[4pt]
  \small
  \faPhone\ 1234567890 \quad
  \faEnvelope\ email@email.com \quad
  \faLinkedin\ linkedin.com/in/profile \quad
  \faGithub\ github.com/profile \quad
  \faMapMarker\ City, Country
\end{center}

\section{Summary}
One line professional summary here.

\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading{University Name}{2020 -- 2024}{Bachelor of Science in Computer Science}{City, Country}
\resumeSubHeadingListEnd

\section{Experience}
\resumeSubHeadingListStart
  \resumeSubheading{Company Name}{Jan 2023 -- Present}{Job Title}{City, Country}
  \resumeItemListStart
    \resumeItem{Achievement bullet one with metrics}
    \resumeItem{Achievement bullet two with metrics}
    \resumeItem{Achievement bullet three with metrics}
  \resumeItemListEnd
\resumeSubHeadingListEnd

\section{Projects}
\resumeSubHeadingListStart
  \resumeProjectHeading{\textbf{Project Name}}{2023}
  \resumeItemListStart
    \resumeItem{Project description with technologies used}
  \resumeItemListEnd
\resumeSubHeadingListEnd

\section{Skills}
\begin{itemize}[leftmargin=0in,label={}]
  \small{\item{
    \textbf{Category One}: skill1, skill2, skill3 \\
    \textbf{Category Two}: skill1, skill2, skill3
  }}
\end{itemize}

\section{Achievements}
\begin{itemize}[leftmargin=0in,label={}]
  \small{\item{
    \textbf{Achievement}: description here
  }}
\end{itemize}

\end{document}`;

async function rewriteResume(jobDescription, currentResume) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: REWRITER_PROMPT },
      { role: 'user', content: `Job Description:\n${jobDescription}\n\nCurrent Resume:\n${currentResume}` }
    ],
  });
  return completion.choices[0].message.content;
}

async function convertToLatex(markdownResume) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 4000,
    temperature: 0.1,
    messages: [
      { role: 'system', content: LATEX_PROMPT },
      { role: 'user', content: `Convert this resume to LaTeX. CRITICAL: Do NOT use any dollar signs or math mode anywhere. Escape all special characters. Output ONLY raw LaTeX code starting with \\documentclass:\n\n${markdownResume}` }
    ],
  });
  let latexCode = completion.choices[0].message.content;
  latexCode = latexCode.replace(/^```latex\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/m, '').trim();
  // Post-process: remove any accidental amsmath usage
  latexCode = latexCode.replace(/\\usepackage\{amsmath\}/g, '');
  latexCode = latexCode.replace(/\\usepackage\{amssymb\}/g, '');
  return latexCode;
}

module.exports = { rewriteResume, convertToLatex };

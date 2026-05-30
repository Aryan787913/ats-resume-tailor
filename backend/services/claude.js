const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const REWRITER_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Your task is to generate a completely new, ATS-optimized resume using two inputs:
1. Job Description
2. Current Resume

## Core Objective
Transform the provided resume into a highly targeted, keyword-optimized resume that aligns strongly with the given job description.

The output must:
* Maximize ATS keyword matching
* Improve clarity, impact, and structure
* Present experience in a results-driven, achievement-oriented way

## Execution Guidelines

### Step 1: Extract Structured Data
From the current resume, extract only factual information (do NOT reuse phrasing):
* Personal details: Name, Address, Phone, Email, LinkedIn, GitHub
* Education: Degree, Institution, Location, Dates
* Work Experience: Company names, job titles, dates
* Projects (if present)

### Step 2: Keyword & Skill Mapping
From the job description:
* Identify primary keywords (core skills, tools, technologies)
* Identify secondary keywords (soft skills, domain knowledge, methodologies)
* Identify action verbs and impact phrases

### Step 3: Resume Reconstruction
1. No Reuse of Original Language — only reuse raw facts
2. Strong Keyword Integration — weave JD keywords naturally
3. Work Experience Enhancement — each bullet: strong action verb + JD tools/tech + measurable impact
4. Professional Summary — 3-5 lines, role-aligned, impact-focused
5. Skills Section — grouped by category; JD-relevant skills first

## Output Format (Strictly Follow)

**[Full Name]**

**Address:** [Full Address]

**Phone No:** [Phone Number] | **Email:** [Email Address] | **LinkedIn:** [LinkedIn URL] | **GitHub:** [GitHub URL]

---

### **Professional Summary**
[ATS-optimized, role-aligned summary]

---

### **Education**
**[Degree]**
[College Name] | [Location] | [Start Date] - [End Date]

---

### **Work Experience**
**[Company Name] | [Location] | [Job Title]** | [Start Date] - [End Date]
* [Achievement-driven bullet with keywords + impact]
* [Achievement-driven bullet with keywords + impact]
* [Achievement-driven bullet with keywords + impact]

---

### **Skills**
* **[Category]:** [Relevant skills]

---

### **Projects**
**[Project Title]**
* [Description with tools, keywords, and measurable impact]

---

## Critical Constraints
* Do NOT include explanations, notes, or commentary.
* Do NOT output anything outside the defined format.
* Do NOT miss important keywords from the job description.
* Do NOT keyword-stuff unnaturally.`;

const LATEX_PROMPT = `You are an expert LaTeX developer specializing in professional resume formatting. Convert the plain text resume into valid, compile-ready LaTeX code using the template below.

### Rules
1. Do not modify the template structure.
2. Only populate content fields: Name, Contact, Education, Work Experience, Projects, Skills, Achievements.
3. Escape special characters: % $ & _ # { } ~ ^ \\
4. Do not hallucinate — only use info from the resume text.
5. Latest experience first.
6. Output ONLY the final LaTeX code — no explanations, no markdown code fences.

### Strict Requirements
* Summary: 1 line max.
* Each experience: max 3 most-relevant bullets.
* Keep only ONE project.
* Achievements section should highlight big wins and relevant certifications.

### Compilation Rules
* Must compile with pdflatex with zero errors.
* No undefined commands or custom macros.
* Escape all LaTeX special characters.

### Template to fill:

%-------------------------------------------
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage[scale=0.90,lf]{FiraMono}

\\definecolor{light-grey}{gray}{0.83}
\\definecolor{dark-grey}{gray}{0.3}
\\definecolor{text-grey}{gray}{.08}

\\DeclareRobustCommand{\\ebseries}{\\fontseries{eb}\\selectfont}
\\DeclareTextFontCommand{\\texteb}{\\ebseries}

\\usepackage{contour}
\\usepackage[normalem]{ulem}
\\renewcommand{\\ULdepth}{1.8pt}
\\contourlength{0.8pt}
\\newcommand{\\myuline}[1]{%
  \\uline{\\phantom{#1}}%
  \\llap{\\contour{white}{#1}}%
}

\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage[T1]{fontenc}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{0in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
    \\bfseries \\vspace{2pt} \\raggedright \\large
}{}{0em}{}[\\color{light-grey} {\\titlerule[2pt]} \\vspace{-4pt}]

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-1pt}}}}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\
      \\textit{#3} & {\\color{dark-grey} \\small #4}\\\\
    \\end{tabular*}\\vspace{-4pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      #1 & {\\color{dark-grey}} \\\\
    \\end{tabular*}\\vspace{-4pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{0pt}}

\\color{text-grey}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge [FULL NAME]} \\\\ \\vspace{5pt}
    \\small \\faPhone* \\texttt{[PHONE]} \\hspace{1pt} $|$
    \\hspace{1pt} \\faEnvelope \\hspace{2pt} \\texttt{[EMAIL]} \\hspace{1pt} $|$
    \\hspace{1pt} \\faLinkedin \\hspace{2pt} \\texttt{[LINKEDIN]} \\hspace{1pt} $|$
    \\hspace{1pt} \\faGithub \\hspace{2pt} \\texttt{[GITHUB]} \\hspace{1pt} $|$
    \\hspace{1pt} \\faMapMarker* \\hspace{2pt}\\texttt{[LOCATION]}
    \\\\ \\vspace{-3pt}
\\end{center}

\\section{SUMMARY}
[One-line summary]

\\section{EDUCATION}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {[University]}{[Dates]}
      {[Degree, GPA]}{[Location]}
  \\resumeSubHeadingListEnd

\\section{EXPERIENCE}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {[Company]}{[Dates]}
      {[Title]}{[Location]}
      \\resumeItemListStart
        \\resumeItem{[Bullet 1]}
        \\resumeItem{[Bullet 2]}
        \\resumeItem{[Bullet 3]}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

\\section{PROJECTS}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{[Project Title]}} {[Dates]}
          \\resumeItemListStart
            \\resumeItem{[Bullet]}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

\\section{SKILLS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     \\textbf{[Category 1]}{: [skills]}\\vspace{2pt} \\\\
     \\textbf{[Category 2]}{: [skills]}
    }}
 \\end{itemize}

\\section{ACHIEVEMENTS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     \\textbf{[Achievement]}{: [detail]}
    }}
 \\end{itemize}

\\end{document}`;

async function rewriteResume(jobDescription, currentResume) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `${REWRITER_PROMPT}

---

**Job Description:**
${jobDescription}

**Current Resume:**
${currentResume}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function convertToLatex(markdownResume) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `${LATEX_PROMPT}

Resume text to convert:
\`\`\`
${markdownResume}
\`\`\``;

  const result = await model.generateContent(prompt);
  let latexCode = result.response.text();
  latexCode = latexCode.replace(/^```latex\s*/i, '').replace(/\s*```$/m, '').trim();
  return latexCode;
}

module.exports = { rewriteResume, convertToLatex };

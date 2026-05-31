const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.1-8b-instant';

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

## Output Format (Strictly Follow)

**[Full Name]**
**Address:** [Full Address]
**Phone No:** [Phone Number] | **Email:** [Email Address] | **LinkedIn:** [LinkedIn URL] | **GitHub:** [GitHub URL]

---

### **Professional Summary**
[ATS-optimized, role-aligned summary — 3-5 lines]

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
* Do NOT include explanations or commentary.
* Do NOT output anything outside the defined format.
* Do NOT miss important keywords from the job description.`;

const LATEX_PROMPT = `You are an expert LaTeX developer. Convert the resume text into valid compile-ready LaTeX using this exact template. Output ONLY LaTeX code — no explanations, no markdown fences.

Rules:
1. Escape special characters: % $ & _ # { } ~ ^ \\
2. Summary: 1 line max
3. Each experience: max 3 bullets
4. Keep only ONE project
5. Must compile with pdflatex with zero errors

Template:
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\definecolor{light-grey}{gray}{0.83}
\\definecolor{dark-grey}{gray}{0.3}
\\definecolor{text-grey}{gray}{.08}
\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage[T1]{fontenc}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\bfseries \\vspace{2pt} \\raggedright \\large}{}{0em}{}[\\color{light-grey}{\\titlerule[2pt]}\\vspace{-4pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-1pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\
      \\textit{#3} & {\\color{dark-grey}\\small #4}\\\\
    \\end{tabular*}\\vspace{-4pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      #1 & {\\color{dark-grey}} \\\\
    \\end{tabular*}\\vspace{-4pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{0pt}}
\\color{text-grey}
\\begin{document}
\\begin{center}
    \\textbf{\\Huge [FULL NAME]} \\\\ \\vspace{5pt}
    \\small \\faPhone* \\texttt{[PHONE]} $|$
    \\faEnvelope \\hspace{2pt} \\texttt{[EMAIL]} $|$
    \\faLinkedin \\hspace{2pt} \\texttt{[LINKEDIN]} $|$
    \\faGithub \\hspace{2pt} \\texttt{[GITHUB]} $|$
    \\faMapMarker* \\hspace{2pt}\\texttt{[LOCATION]}
\\end{center}
\\section{SUMMARY}
[One-line summary]
\\section{EDUCATION}
  \\resumeSubHeadingListStart
    \\resumeSubheading{[University]}{[Dates]}{[Degree]}{[Location]}
  \\resumeSubHeadingListEnd
\\section{EXPERIENCE}
  \\resumeSubHeadingListStart
    \\resumeSubheading{[Company]}{[Dates]}{[Title]}{[Location]}
      \\resumeItemListStart
        \\resumeItem{[Bullet 1]}
        \\resumeItem{[Bullet 2]}
        \\resumeItem{[Bullet 3]}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd
\\section{PROJECTS}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading{\\textbf{[Project Title]}}{[Dates]}
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
    \\small{\\item{\\textbf{[Achievement]}{: [detail]}}}
 \\end{itemize}
\\end{document}`;

async function rewriteResume(jobDescription, currentResume) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: REWRITER_PROMPT },
      { role: 'user', content: `**Job Description:**\n${jobDescription}\n\n**Current Resume:**\n${currentResume}` }
    ],
  });
  return completion.choices[0].message.content;
}

async function convertToLatex(markdownResume) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 8192,
    messages: [
      { role: 'system', content: LATEX_PROMPT },
      { role: 'user', content: `Convert this resume to LaTeX:\n\`\`\`\n${markdownResume}\n\`\`\`` }
    ],
  });
  let latexCode = completion.choices[0].message.content;
  latexCode = latexCode.replace(/^```latex\s*/i, '').replace(/\s*```$/m, '').trim();
  return latexCode;
}

module.exports = { rewriteResume, convertToLatex };

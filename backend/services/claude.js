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
1. Every special character MUST be escaped: & becomes \\&, % becomes \\%, $ becomes \\$, # becomes \\#, _ becomes \\_, { becomes \\{, } becomes \\}
2. Do NOT use any math mode, dollar signs, or special symbols
3. Do NOT use any packages not listed in the template
4. Keep all text simple ASCII only
5. Output ONLY the LaTeX starting with \\documentclass

Use this exact template:

\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage[T1]{fontenc}
\\usepackage{fontawesome5}
\\definecolor{light-grey}{gray}{0.83}
\\definecolor{dark-grey}{gray}{0.3}
\\definecolor{text-grey}{gray}{.08}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\setlength{\\footskip}{4.08pt}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\bfseries\\vspace{2pt}\\raggedright\\large}{}{0em}{}[\\color{light-grey}{\\titlerule[2pt]}\\vspace{-4pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} &

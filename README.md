# KNM Study

A working React + TypeScript + Vite study website with a compact, text-focused monochrome design. Built from the supplied **KNM_bilingual_complete_study_book.pdf** and supplemented with the July 2025 curriculum changes.

## Start locally

Install Node.js 22 (Node 20.19+ is also suitable), then open a terminal in this folder:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. To test and build:

```sh
npm test
npm run build
npm run preview
```

The `dist/` folder is the standalone static production website. Serve it with an HTTP server; opening `index.html` directly with `file://` does not support JavaScript module loading reliably.

## Deploy to GitHub Pages

1. Create a GitHub repository. Copy **the contents of this folder** into its root, including the hidden `.github` folder. Commit `package-lock.json`, `src`, `public`, the configuration files, and documentation. Do not commit `node_modules`.
2. Push to the `main` branch.
3. In your repository, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. The included **Deploy KNM Study to GitHub Pages** workflow runs the tests and production build, uploads `dist`, and deploys it. If needed, run it manually under **Actions → Deploy KNM Study to GitHub Pages → Run workflow**.
5. Open the URL shown by the deployment, typically `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

`vite.config.ts` uses `base: '/knm-study/'` for `https://rdmcnrmk.github.io/knm-study/`. Asset and study-text links use this repository path. Navigation stays inside the application without requiring server-side routes or a 404 redirect. If your default branch is not `main`, change the branch in `.github/workflows/deploy.yml`.

This delivery is ready for deployment; it has not been pushed to a GitHub repository or published. No hosting account or secret is needed to build it. GitHub Actions obtains its Pages permissions through the supplied workflow. GitHub account/organisation policies can affect Pages availability.

## Included

- Eight KNM topics, mapped to the study book’s chapters.
- 74 bilingual lesson sections: 40 from the book, two July 2025 supplements and 32 researched expansions.
- 80 illustrated vocabulary cards, English meanings, contextual cues and optional Dutch speech using the device’s voice.
- 82 unofficial multiple-choice practice questions: 48 adapted from the book, two generated update questions and 32 explained questions accompanying the expansions. Incorrect options are authored for each prompt.
- Topic quizzes with answer feedback, source pages, review and latest scores.
- A 40-question mock exam: five randomly selected questions from each topic, shuffled, with a 45-minute absolute deadline. Answers, question position and deadline survive a reload. Submission includes unanswered questions in the denominator. Closing a tab does not pause time; an expired attempt is finished on return.
- Local completion tracking, known vocabulary, latest topic-quiz scores, last chapter and one mock-exam attempt. Data can be reset under **My progress → Manage local data**.
- An exam checklist mapping all 78 numbered knowledge targets to lesson sections, with separate self-assessment tracking.
- An interactive schematic guide to all twelve provinces, an official CBS map link and locally saved notes about your own region.
- Search across topic titles and lesson content; Dutch, English and side-by-side lesson modes.
- Responsive layout, keyboard controls, visible focus, skip link, semantic headings and reduced-motion support.
- No account, backend, analytics, cookies, remote fonts or remote image dependencies.

## Content and official verification

Reviewed on **14 November 2026**:

- [DUO exam format](https://www.inburgeren.nl/examen-doen/inhoud-kennisexamens.jsp): computer-based KNM exam, 45 minutes.
- [DUO change announcement, 1 July 2025](https://inburgeren.nl/nieuwsberichten/artikel.jsp?cid=tcm%3A94-225285-16).
- [Government explanation of the July 2025 revision](https://www.rijksoverheid.nl/actueel/nieuws/2025/06/30/inburgeringsexamen-vernieuwd-extra-aandacht-voor-zelfbeschikking-vrouwen-en-kennis-holocaust): knowledge-focused questions, women’s self-determination and Holocaust knowledge.
- [Official attainment targets, effective 1 July 2025](https://zoek.officielebekendmakingen.nl/stcrt-2024-15802.html): the eight-theme framework.
- [DUO official practice](https://www.inburgeren.nl/examen-doen/oefenen.jsp), linked from the app. These official exams are separate from this site’s independently created practice.

The original 35-page book supplied the core lesson text, terminology and short-answer prompts. Lessons retain page references; the full text companion is `public/study-book.txt`. The source PDF is not published in the build. The older chat’s assistant responses were available only as content-reference placeholders; the implementation follows the user’s explicit feature list and approved grayscale/visual preferences.

The book’s chapter order differs from the statutory order, so use topic names when cross-referencing. See `CURRICULUM.md` and `CURRICULUM_AUDIT.md`. The book is a condensed study resource, not a guarantee that every statutory sub-indicator is represented. The website does not copy official exam questions, assert official question counts, invent a pass threshold or promise an exam result. Forty questions and equal topic weighting are practice design choices. English is learning support; actual KNM questions are in Dutch. Variable benefit amounts, fees and eligibility thresholds are intentionally not hard-coded.

## Maintain or extend

- `src/book.json`: bilingual lessons and book prompts with page provenance.
- `src/data.ts`: topic supplements, vocabulary, official sources, assembled question bank.
- `src/supplements.json`: 32 expanded bilingual lessons, questions, explanations, words, dated sources and curriculum references.
- `src/curriculum.ts`: 78 numbered knowledge targets and province guide.
- `src/distractors.ts`: incorrect answer choices, keyed by question ID.
- `src/main.tsx`: interface, original SVG scenes, study flows and progress.
- `src/engine.ts`: storage validation, random selection and deadline utilities.
- `src/style.css`: design and responsive layouts at 1100, 760 and 480 px.
- `tests/study.test.mjs`: content, choice validity, exam sampling, storage and timer tests.

Keep each question ID stable when updating content. If a saved attempt references a removed question, the application discards that attempt rather than displaying incomplete results. The stored data schema uses version 1 under `knm-study-v1`; bump the schema/key when making incompatible changes.

Storage is per browser and origin. Data does not automatically transfer from localhost to GitHub Pages, across devices, between private and normal windows, or after browser data is cleared. The timer follows the device clock. Device speech quality depends on installed Dutch voices and browser support.

## Verification

The production TypeScript/Vite build and ten automated tests pass. Browser checks covered lesson switching, saved completion, quiz choice/feedback, flashcard flipping/known state/filtering, the navigation drawer, mock timer startup, answer restoration after reload, submission and answer review. Expansion checks also covered checklist filters and persistence, lesson deep links and interactive province selection. Visual inspection used the available 615 px in-app preview; physical phone and wider desktop browser checks remain useful before release. Timer boundary/expiry arithmetic is automated; a real 45-minute session was not waited out.

## Licences

Original application code is MIT licensed. Lucide icons are ISC licensed with Feather portions under MIT. The user-supplied study material retains its original rights and is excluded from the application’s MIT grant. Dependency and image-credit information is in `THIRD_PARTY_NOTICES.md`.

## Expansion — 14 November 2026

The additional lessons cover rental rights and budgeting, utilities and insurance distinctions, employment representation and benefit duties, social diversity and holidays, urgent-care routes and insurance costs, education age boundaries and school support, identity and naturalisation, digital help, tax and complaints, voting and current officeholders, privacy and donor registration, provinces, colonial history and international organisations. Each expanded lesson provides its numbered curriculum references and primary-source links.

The 78-item checklist covers numbered knowledge targets at section level. It is a learning navigation tool and self-assessment, not a claim that every sub-indicator/example is exhaustively taught or tested. Personal eligibility and changeable facts should be checked through the official links. The prime minister and monarch entry is explicitly dated; it is not updated automatically. Earlier completion IDs are preserved and prior progress is retained.

## Compact reading layout

The home page opens directly on topics and study controls. Promotional copy and decorative scene illustrations have been removed. Lesson and feedback sentences are rendered as semantic bullet lists with the original wording preserved; Dutch and English remain separate. Smaller headings, tighter spacing, compact concept icons and reduced province-guide height keep the interface focused on study text.

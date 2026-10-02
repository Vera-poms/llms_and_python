# LLM Foundations - a weekly LLM lab course

A week-by-week course in which students work through hands-on LLM labs in the
browser. **Week 1** is the 15 built-in labs (probability through a real
Groq-backed `GroqClient`). **Later weeks** are filled in over time: admins author
weekly resources and release them, and each week appears in the student's week
navigator once it has a released resource.

```
compose.yml            Postgres + backend + frontend
apps/backend/app/      FastAPI API (Python 3.14)
apps/frontend/app/     React + Vite + Chakra UI single-page app
course/                Week 1 content: notebooks, project briefs, answer key, plain .py labs
```

## How the weeks work

| Week | Content | Source |
|------|---------|--------|
| 1 | The 15 labs below, graded and scored | Static (`apps/frontend/app/src/data/labs.ts`, readings, notebooks) |
| 2+ | Resources: ordered blocks of **text** (Markdown), **code** (runnable) and **link** (URL, optional title/note) | Authored by admins, stored in the `resources` table |

A resource is a draft until an admin releases it; students only see released
ones, and an admin can unrelease it again. Resource code blocks run in their own
kernel, which never collides with a lab's. Week 1 is never stored in the
database. The student's lab list page switches weeks with `?week=N`.

## Week 1: the labs

| # | Lab | Groq key |
|---|-----|:---:|
| 1 | Probability | |
| 2 | Probability: Simple Prediction | |
| 3 | Conditional Probability | |
| 4 | The Perceptron | |
| 5 | Training a Simple Perceptron | |
| 6 | LLM Architecture Anatomy | |
| 7 | The Transformer and Attention Mechanisms | |
| 8 | Prompting Techniques | |
| 9 | Zero-Shot Prompting | yes |
| 10 | Few-Shot Structured Output | yes |
| 11 | Chain-of-Thought | yes |
| 12 | System Instruction Build | yes |
| 13 | Free APIs and Integration: The Complete Digital Twin | yes |
| 14 | The 5 Universal API Components | yes |
| 15 | The Messages List In Depth / GroqClient Wrapper Class | yes |

Labs 1-8 run offline; labs 9-15 make real calls to Groq's free API.

### Inside a lab (`/labs/:labId`)

- **Reading** - the lesson, with *runnable examples* and *practice cells*
  ("Try it live": editable code with a graded check).
- **Notebook** - the lab's notebook in the browser. Cells run in a real Jupyter
  kernel on the server (one per user and lab, restartable); matplotlib images and
  errors come back with the output. The reference project never reaches the
  browser: students get the written brief and an empty cell. Code autosaves per
  cell. In labs 9-15 the `GROQ_API_KEY` prompt can be filled in for you.
- **Navigation** - a lab sidebar and week navigation on every lab.

> Kernels run arbitrary Python with no sandbox beyond the OS process. Use for a
> single trusted user or a local deployment only.

### Scoring and grading

Every graded item is checked against a server-side answer key that never leaves
the server.

| Kind | Where | Points |
|------|-------|-------:|
| `python` | "Try it live" practice cell in a reading (51 in total) | 5 |
| `llm` | The notebook exercise cell, one per lab | 10 |
| `project` | The notebook real-world project, one per lab | 20 |

Maximum score: 705 (51 x 5 + 15 x 10 + 15 x 20).

- **Judging.** With an LLM configured, the model compares code and output to the
  reference by logic rather than exact text and returns `CORRECT`/`INCORRECT`
  plus one line of feedback; stub code (TODOs, `NotImplementedError`) is
  incorrect. If no LLM is available or the call fails, practice cells fall back
  to an exact output match; exercises and projects report that checking is
  unavailable.
- **Passing sticks**; every judged run counts an attempt. A lab is marked done
  when all its graded items pass.
- **Hints** are free (counted, never deducted). Three escalating levels - a
  nudge, which part needs attention, then numbered plain-English steps; level 3
  repeats. The tutor may not write code or output values, the server scans each
  hint for lines of the reference solution, retries once on a leak, and redacts
  anything that remains.
- The provider (Groq by default, or Anthropic) handles both judging and hints,
  with student-safe error messages and a 30 s timeout.

## Course content - `course/`

| Path | Contents |
|------|----------|
| `notebooks/lab_NN_*.ipynb` | One self-contained notebook per lab (1-15) |
| `projects/lab_NN.md` | Written project brief per lab (1-15) |
| `exercises/practice_cells.json` | Server-side answer key for practice cells (generated) |
| `tools/extract_practice_cells.py` | Regenerates that key from the frontend readings |
| `data/review_sentences.csv` | Shared dataset: 170 lowercase review sentences, label 1 = positive / 0 = negative |
| `lab_01_*` ... `lab_05_*` | Original plain-`.py` versions of labs 1-5 |
| `requirements.txt` | `numpy`, `matplotlib` |

After adding or editing a `<PracticeCell>` in the readings, re-run:

```bash
python course/tools/extract_practice_cells.py
```

### Notebook structure

Cells carry a `role` (`reading`, `setup`, `exercise`, `solution`, `project`):

- **Reading** cells explaining the concept
- An **exercise** cell with `# TODO` markers and self-check asserts
- A **solution** cell (same functions/classes, filled in)
- A **real-world project**: labs 1-8 use the review dataset, labs 9-15 call Groq

Each notebook embeds its own data and re-includes code from earlier labs, so no
repo checkout is needed. Labs 9-15 ask for `GROQ_API_KEY` via a hidden `getpass`
field and never save it.

### Run a notebook in Google Colab

1. At [colab.research.google.com](https://colab.research.google.com) choose
   **File > Upload notebook** and pick the `.ipynb` from `course/notebooks/`.
2. Run cells top to bottom. The exercise cell raises `NotImplementedError` until
   you fill in the `# TODO`s - that's expected.
3. For labs 9-15 get a free key at
   [console.groq.com/keys](https://console.groq.com/keys).

### Run a notebook locally

```bash
cd course
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt jupyter
jupyter notebook notebooks/
```

### Plain `.py` labs (1-5)

Run from `course/`, e.g. `python lab_01_probability/project.py`.

- Labs 1-3: `exercise.py`, `solution.py`, `project.py`
- Lab 4: `perceptron.py`, `exercise.py`, `solution.py`, `project.py`
- Lab 5: `train.py`, `project.py` (imports `perceptron.py` from
  `lab_04_perceptron`)

## Who uses it

**Students** sign up at `/signup`, log in at `/login`, and can reset a password
(`/forgot-password` emails a link valid 30 minutes by default;
`/reset-password` consumes it). They use `/labs` and `/labs/:labId`.

**Owner** - one identity set by env vars (not a database user) at `/owner/login`
and `/owner`. Invites admins by email (one-time, email-bound code, stored only as
a hash; emailed if SMTP is configured, otherwise shown to share manually), lists
and revokes invites, lists and removes admins.

**Admins** - sign up at `/admin/signup` with an invite code (password at least 12
characters), log in at `/admin/login`, work in `/admin`. They can:

- **Manage weekly resources**: create, edit, delete, release/unrelease, and
  preview-run code blocks
- **Manage users**: search and list, view per-lab progress and score,
  promote/demote admins (not themselves), set a password, delete a user (not
  themselves), reset progress, mark a lab done or not

Admin and owner tokens are scoped separately from student tokens (owner tokens
are also accepted on the admin user-management routes), and `is_admin` is
re-checked in the database on every admin request, so revoking admin is
immediate. Failed owner/admin logins and signups are limited to 5 per 15
minutes by an in-memory, per-process limiter - put a shared one at the proxy for
production.

## Running the app

Requires [Podman](https://podman.io) and `podman-compose`. On Windows/macOS,
start the Podman machine first (`podman machine init` once, then
`podman machine start`).

```bash
podman-compose up --build
```

| Service | Address | Notes |
|---------|---------|-------|
| frontend | http://localhost:5000 | Vite dev server |
| backend | http://localhost:8020 | FastAPI; `GET /health`, docs at `/docs` |
| db | localhost:5434 | Postgres 16; credentials are set in `compose.yml` |

The backend reads `apps/backend/app/.env` (git-ignored) and mounts `./course` at
`/course`. On startup it creates tables, adds missing columns
(`users.is_admin`, `cell_results.hints_used`) and upserts the 15 labs.

### Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | required | SQLAlchemy URL (set in `compose.yml`) |
| `SECRET_KEY` | set in `compose.yml` | JWT signing key (HS256); use a unique random value in production |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 days) | Student token lifetime |
| `CORS_ORIGINS` | `http://localhost:5000` | Comma-separated origins |
| `COURSE_DIR` | `/course` | Notebooks, briefs, answer key |
| `FRONTEND_URL` | `http://localhost:5000` | Base URL in emailed links |
| `RESET_TOKEN_EXPIRE_MINUTES` | `30` | Password-reset link lifetime |
| `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | unset; from `no-reply@llm-foundations.local` | STARTTLS email; nothing is emailed without `SMTP_HOST` |
| `OWNER_EMAIL`, `OWNER_PASSWORD` | unset | Owner identity; both needed or owner routes 404 |
| `OWNER_TOKEN_EXPIRE_MINUTES` | `30` | Owner token lifetime |
| `ADMIN_INVITE_EXPIRE_HOURS` | `48` | Invite lifetime |
| `ADMIN_TOKEN_EXPIRE_MINUTES` | `60` | Admin token lifetime |
| `GROQ_API_KEY`, `GROQ_MODEL` | unset, `openai/gpt-oss-120b` | Default grader/hint provider |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | unset, `claude-sonnet-5-5` | Alternative provider |
| `LLM_PROVIDER` | unset | `groq` or `anthropic`; unset = Groq if keyed, else Anthropic |
| `DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_RECYCLE_SECONDS` | `5`, `10`, `1800` | Connection pool |
| `VITE_API_URL` | `http://localhost:8020` | Backend URL as the browser sees it |

## API

Everything except `/auth/signup`, `/auth/login`, `/auth/forgot-password`,
`/auth/reset-password`, `/owner/auth/login`, `/admin/auth/*` and `/health`
needs a bearer token.

| Prefix | Routes |
|--------|--------|
| `/auth` | `POST /signup`, `/login`, `/forgot-password`, `/reset-password`; `GET /me` |
| `/labs` | `GET ""`, `GET /scores`, `PATCH /{lab}/progress`, `GET /{lab}/cells/results`, `GET`/`PUT /{lab}/cells/{cell}/code`, `POST /{lab}/cells/{cell}/judge`, `POST /{lab}/cells/{cell}/hint` |
| `/notebooks` | `GET /{lab}`, `POST /{lab}/run`, `POST /{lab}/restart` |
| `/resources` | `GET ""`, `GET /{id}`, `POST /{id}/run` (released only) |
| `/owner` | `POST /auth/login`, `POST`/`GET /invites`, `DELETE /invites/{id}`, `GET /admins`, `DELETE /admins/{id}` |
| `/admin/auth` | `POST /signup`, `POST /login` |
| `/admin` | `GET /users`, `GET`/`PATCH`/`DELETE /users/{id}`, `DELETE /users/{id}/progress`, `PATCH /users/{id}/labs/{lab}` |
| `/admin/resources` | `GET ""`, `POST ""`, `POST /run`, `GET`/`PUT`/`DELETE /{id}`, `POST /{id}/release`, `POST /{id}/unrelease` |

## Data model

`users`, `admin_invites`, `labs`, `lab_progress` (done, hint count), `cell_code`
(autosaved source), `cell_results` (passed, attempts, hints used, feedback,
timestamps), `resources` (week, title, summary, position, JSON blocks, release
time, uploader). Passwords are bcrypt-hashed; a password-reset token embeds the
current password hash, so it dies once the password changes.

## Frontend

React 18, TypeScript, Vite, Chakra UI, React Router, axios, react-markdown and
CodeMirror (Python).

```bash
cd apps/frontend/app
npm run dev          # :5000
npm run build        # tsc -b && vite build
npx playwright test  # end-to-end
```

The Playwright test (`e2e/admin-signup.spec.ts`) needs the backend running with
`OWNER_EMAIL`/`OWNER_PASSWORD` set and `SMTP_HOST` unset, plus
`E2E_OWNER_EMAIL`/`E2E_OWNER_PASSWORD` (optionally `E2E_BASE_URL`).

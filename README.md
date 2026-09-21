# Personal Site

Portfolio + research blog built with React (JS) and Vite.

## Getting started

```bash
npm install
npm run dev      # start the dev server (hot reload)
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
├── main.jsx              # entry point, sets up the router
├── App.jsx               # route definitions
├── components/           # reusable UI pieces
│   ├── Layout.jsx        # navbar + page + footer shell
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProjectCard.jsx
│   └── PostCard.jsx
├── pages/                # one component per route
│   ├── Home.jsx
│   ├── Projects.jsx
│   ├── Research.jsx      # blog index
│   ├── BlogPost.jsx      # single post (/research/:slug)
│   ├── About.jsx
│   └── NotFound.jsx
├── data/
│   ├── projects.js       # list of projects
│   └── posts.js          # blog post registry (metadata + content)
├── content/posts/*.md    # Markdown source for each blog post
├── utils/format.js       # small helpers
└── styles/global.css     # all styling
```

## How to add content

**A project:** add an object to the array in `src/data/projects.js`.

**A blog post:**
1. Create `src/content/posts/my-post.md`.
2. Import it in `src/data/posts.js` (`import myPost from '../content/posts/my-post.md?raw'`).
3. Add an entry to the `posts` array with a unique `slug`, `title`, `date`,
   `summary`, `tags`, and `content: myPost`.

The post is then reachable at `/research/my-post`.

## Notes

- Routing uses `react-router-dom`. Because it uses the HTML5 history API,
  configure your host to serve `index.html` for unknown paths when you deploy.
- Markdown is rendered with `react-markdown` + `remark-gfm` (tables, task
  lists, etc.).

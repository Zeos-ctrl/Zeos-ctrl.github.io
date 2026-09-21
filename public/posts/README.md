# Post images

Put images for blog posts in this folder (or subfolders), then reference them
in your Markdown with an **absolute path from the site root** — note the
leading slash and that you do NOT include `public/`:

```markdown
![A quantum circuit diagram](/posts/quantum-circuit.png)
```

Vite serves everything in `public/` at the site root, so a file saved as
`public/posts/quantum-circuit.png` is available at `/posts/quantum-circuit.png`
in both `npm run dev` and the production build.

Tips:
- Use a descriptive alt text (the part in `[...]`) — it shows if the image
  fails to load and is read by screen readers.
- Keep large photos reasonably sized (e.g. ≤ 1600px wide) so pages stay fast.
- Organize with subfolders if you like: `/posts/quantum/diagram.png`.

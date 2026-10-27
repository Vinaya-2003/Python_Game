# Python Lab — Learn, Code, Build
Static site (no backend). Python runs in the browser via Pyodide inside a Web Worker.

## Run locally
    cd python-lab && python -m http.server 8000   # open http://localhost:8000
(Open via a server, not by double-clicking index.html.)

## Publish on GitHub Pages
    git init && git add . && git commit -m "Python Lab: loops"
    git branch -M main && git remote add origin <your-repo-url> && git push -u origin main
Then: repo Settings → Pages → Deploy from branch → main / root.

## Add a new topic
In `data/lessons.js` add a key beside `loops` with: title, desc, objectives, learn[], practice[], build, freeStarter, skills, badge, next.
Each challenge: `{id, level, title, xp, prompt, starter, hints[], tests[]}`.
A test is `{stdin:[lines for input()], out:[exact output lines]}` and/or `{has:[substrings]}`.
Then point `const T = LESSONS.loops` in `js/app.js` at the new key (a topic picker is the natural next step).
The Explore demo in `app.js` is the only loop-specific code.

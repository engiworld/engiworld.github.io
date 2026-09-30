# EngiWorld Project Page

Static project website for **EngiWorld: What Can Frontier Agents Deliver in Professional Engineering Environments?**

The root `index.html` and bundled `assets/` work directly on GitHub Pages, including a repository subpath. No build step or external JavaScript/font CDN is required.

## Publish with GitHub Pages

1. Create a dedicated public repository for the project page, or select an existing empty repository.
2. Upload the contents of this directory to the repository root, preserving `index.html`, `assets/`, and `.nojekyll`.
3. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing the files and **/ (root)**, then save.
5. Use the website URL returned by GitHub after the Pages build succeeds.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Hero video

The 70-second GUI showcase of 88 distinct successful tasks appears after the authors, affiliations, resource buttons, and statistics, immediately above **01 / Overview**. It autoplays muted, loops continuously, and includes playback controls. Reduced-motion preferences disable autoplay. The video moves from an ALE-inspired introduction into one task and then a wall of 88 successful GUI tasks. The opening cards are stationary; the task wall keeps playing. It uses real experiment recordings and screenshots, with model-neutral agent output.

## Content

The page includes the user-supplied list of 22 authors and 11 affiliations, manuscript figures, task descriptions, model results, ablations, case studies, and an arXiv citation. Author names link to verified Google Scholar profiles or GitHub accounts where available; unverified entries link back to the project homepage. Eight authors are displayed without profile links.

Paper: https://arxiv.org/abs/2609.37686

Code and Dataset links remain marked **Coming soon** until their official release destinations are supplied. This repository contains the project website; it does not contain the benchmark implementation or the complete task dataset.

## Local preview

Run `python -m http.server 8765 --bind 127.0.0.1` in this directory and open `http://127.0.0.1:8765/`, or open `index.html` directly.

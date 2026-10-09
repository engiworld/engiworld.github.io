# EngiWorld Project Page

Static project website for **EngiWorld: What Can Frontier Agents Deliver in Professional Engineering Environments?**

Official homepage: https://engiworld.github.io/
Paper: https://arxiv.org/abs/2609.37686
Benchmark repository and tasks: https://github.com/Hongcheng-Gao/EngiWorld
Environment images: https://huggingface.co/datasets/HongchengGao/EngiWorld-Images

## Content

Synchronized with the author-supplied updated arXiv manuscript on 2026-10-09: 1,301 tasks across 26 software applications and six domains; seven models evaluated on 306 tasks (158 CLI, 148 GUI), including all 10 Open-Environment Engineering tasks. The highest EngiScore is 44.7. The page includes 22 authors, 11 affiliations, the abstract, manuscript figures, task types, results, ablations, case studies, and the arXiv citation.

The interactive leaderboard compares EngiScore against mean turns/task, output tokens/turn (K), and API cost/task. Resource means cover all 306 tasks, including unsuccessful runs. CLI and GUI scores use different task subsets. Interface and task-type tables support sorting; the full main-results CSV is available for download.

Figures have individual width limits and support enlargement. The domain radar and native failure-analysis table share top and bottom edges on desktop and stack on narrow screens. Dataset construction and cross-software cases are expanded by default. The compact typography and simplified annotations are retained.

The 70-second GUI showcase of 88 distinct successful tasks appears above Overview. It autoplays muted, loops, and includes controls. Reduced-motion preferences disable autoplay.

The video opening follows the 2026-10-09 arXiv manuscript: the current paper title, DCC, all six task-type names, and the 306-task main evaluation (158 CLI / 148 GUI). The approved GUI replay footage is retained.

## Deployment and preview

The root `index.html` and bundled `assets/` work directly on GitHub Pages. No build step or external JavaScript/font CDN is required. Publication uses this repository's `main` branch and root directory; preserve `.nojekyll`.

Run `python -m http.server 8765 --bind 127.0.0.1` in this directory for a local preview. This repository hosts the website; the benchmark implementation and task definitions are in the linked benchmark repository.

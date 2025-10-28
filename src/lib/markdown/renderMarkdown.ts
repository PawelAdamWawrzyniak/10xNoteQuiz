import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import footnote from "markdown-it-footnote";
import taskLists from "markdown-it-task-lists";
import hljs from "highlight.js/lib/core";
// Import only commonly used languages to reduce bundle size
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml"; // covers HTML
import css from "highlight.js/lib/languages/css";
import markdown from "highlight.js/lib/languages/markdown";
import sql from "highlight.js/lib/languages/sql";
import yaml from "highlight.js/lib/languages/yaml";
import sanitizeHtml from "sanitize-html";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash); // alias
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml); // alias
hljs.registerLanguage("css", css);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("md", markdown); // alias
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml); // alias
// Common aliases for JS/TS
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("jsx", javascript);
hljs.registerLanguage("tsx", typescript);

export interface TocItem {
  level: number;
  id: string;
  text: string;
}

// Slugify similar to GitHub/markdown-it-anchor default
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createMd(toc: TocItem[]) {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
        } catch {
          // If highlighting fails, return plain escaped code
          return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
        }
      }
      // No language specified or not registered - return plain code without auto-detection
      // This saves ~100KB from the bundle by removing auto-detection logic
      return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
    },
  })
    .use(taskLists, { enabled: true, label: true })
    .use(footnote)
    .use(anchor, {
      slugify,
      level: [1, 2, 3, 4, 5, 6],
      tabIndex: false,
      permalink: anchor.permalink.linkInsideHeader({
        symbol: "#",
        placement: "before",
        ariaHidden: true,
      }),
      callback(token, info) {
        // Collect TOC items
        if (token.tag && token.tag.match(/^h[1-6]$/)) {
          const level = Number(token.tag[1]);
          toc.push({ level, id: info.slug, text: token.content });
        }
      },
    });
  return md;
}

function sanitize(html: string) {
  const clean = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "span",
      "code",
      "pre",
      "sup",
      "sub",
      "del",
      "input",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      span: ["class"],
      code: ["class"],
      pre: ["class"],
      input: ["type", "checked", "disabled"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    // Transform URLs and ensure rel safety
    transformTags: {
      a: (tagName, attribs) => {
        const rel = attribs.rel ? attribs.rel + " noopener nofollow noreferrer" : "noopener nofollow noreferrer";
        return { tagName, attribs: { ...attribs, rel } };
      },
      input: (tagName, attribs) => {
        // Ensure task list checkboxes are always readonly
        return { tagName, attribs: { ...attribs, disabled: "disabled" } };
      },
    },
    // Allow http, https, mailto links only
    allowedSchemes: ["http", "https", "mailto"],
  });
  return clean;
}

export async function renderMarkdown(markdown: string | null | undefined): Promise<{ html: string; toc: TocItem[] }> {
  const src = (markdown ?? "").toString();
  if (!src.trim()) {
    return { html: "", toc: [] };
  }
  const toc: TocItem[] = [];
  const md = createMd(toc);
  const raw = md.render(src);
  const html = sanitize(raw);
  return { html, toc };
}

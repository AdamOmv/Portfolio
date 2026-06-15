const brandClass = 'h-5 w-5';

function svg(paths, viewBox = '0 0 24 24') {
  return (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" className={brandClass}>
      {paths}
    </svg>
  );
}

export const techIcons = {
  react: (
    <svg viewBox="0 0 24 24" className={brandClass} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
  ),
  nodejs: svg(<path d="M12 2 19 6v12l-7 4-7-4V6l7-4Z M9 9v6m6-6v6m-3-3h3" />),
  mysql: svg(<path d="M5 8c0-2.8 3.1-5 7-5s7 2.2 7 5v8c0 2.8-3.1 5-7 5s-7-2.2-7-5V8Zm0 0c0 2.8 3.1 5 7 5s7-2.2 7-5" />),
  symfony: svg(<path d="M17.8 7.5c-.6-2.3-2.7-3.9-5.6-3.9-3.8 0-6.2 2.7-6.2 6.5s2.5 6.3 6 6.3c2.7 0 4.7-1.5 5.7-3.9" />),
  docker: svg(<path d="M4 13h12v4.2c0 1.5-1.3 2.8-2.8 2.8H8c-2.2 0-4-1.8-4-4V13Zm3-4h2v2H7V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9ZM7 6h2v2H7V6Zm3 0h2v2h-2V6Zm8.4 4.6c1.1 0 1.8-.2 2.6-.8-.1 2.6-1.5 4.8-4.9 4.8" />),
  github: svg(<path d="M9 19c-4 .8-4-2-6-2m12 4v-3.5a3 3 0 0 0-.8-2.1c2.6-.3 5.3-1.3 5.3-5.9a4.6 4.6 0 0 0-1.2-3.1 4.3 4.3 0 0 0-.1-3.1s-1-.3-3.2 1.2a10.8 10.8 0 0 0-6 0C6.8 3 5.8 3.3 5.8 3.3a4.3 4.3 0 0 0-.1 3.1 4.6 4.6 0 0 0-1.2 3.1c0 4.6 2.7 5.6 5.3 5.9A3 3 0 0 0 9 17.5V21" />),
  git: svg(<path d="m12 3 9 9-9 9-9-9 9-9Zm-2.5 7.5 5 5M9.5 10.5V8.2m5 7.6v-2.3" />),
  tailwindcss: svg(<path d="M6 9.5c1.2-2.4 3-3.5 5.5-3.5 3.8 0 4.3 2.7 6.2 3.2 1 .3 2.2-.1 3.3-1.2-1.2 2.4-3 3.5-5.5 3.5-3.8 0-4.3-2.7-6.2-3.2-1-.3-2.2.1-3.3 1.2Zm-3 6c1.2-2.4 3-3.5 5.5-3.5 3.8 0 4.3 2.7 6.2 3.2 1 .3 2.2-.1 3.3-1.2-1.2 2.4-3 3.5-5.5 3.5-3.8 0-4.3-2.7-6.2-3.2-1-.3-2.2.1-3.3 1.2Z" />),
  typescript: svg(<path d="M4 4h16v16H4V4Zm5 5v6m-1.8-6H11m4 0v6m0-6h2m-2 3h1.6" />),
  express: svg(<path d="M5 12h14M5 8h9M5 16h8" />),
  php: svg(
    <>
      <ellipse cx="12" cy="12" rx="8.5" ry="5.5" />
      <path d="M8 12h2.5a1.5 1.5 0 1 0 0-3H8v6m7-6h-2v6m5-6h-2.3a1.7 1.7 0 0 0-1.7 1.7V15" />
    </>
  ),
  nginx: svg(<path d="M12 3 20 8v8l-8 5-8-5V8l8-5Zm0 5v8m-3-5 6 4" />),
  figma: svg(<path d="M10 4a3 3 0 1 1 0 6H8a3 3 0 1 1 0-6h2Zm0 6a3 3 0 1 1 0 6H8a3 3 0 1 1 0-6h2Zm0 6a3 3 0 1 1 0 6H8a3 3 0 1 1 0-6h2Zm4-12a3 3 0 1 1 0 6h-4V4h4Zm0 6a3 3 0 1 1 0 6h-4v-6h4Z" />),
  vite: svg(<path d="m12 3 6 2-4.5 16L12 18 10.5 21 6 5l6-2Z" />),
};

export const uiIcons = {
  arrow: svg(<path d="M5 12h14m-5-5 5 5-5 5" />),
  external: svg(<path d="M14 5h5v5M10 14 19 5M19 14v5h-5M5 10V5h5M5 19h5v-5" />),
  mail: svg(<path d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />),
  lock: svg(<path d="M7 10V8a5 5 0 0 1 10 0v2m-10 0h10v10H7V10Z" />),
  check: svg(<path d="m5 12 4 4 10-10" />),
};

export function resolveTechIcon(slug) {
  return techIcons[slug] || svg(<path d="M4 12h16M12 4v16" />);
}

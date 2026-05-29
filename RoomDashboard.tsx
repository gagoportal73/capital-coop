@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&family=Inter:ital,wght@0,300;0,400;0,600;0,800;1,300;1,400;1,600&family=JetBrains+Mono:wght@400;700;800&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

/* Custom global rules for the Bold Typography styling */
body {
  background-color: #0A0A0A !important;
  color: #F5F5F5 !important;
  font-family: "Space Grotesk", "Inter", sans-serif;
}

/* Custom scrollbar to keep it flat and blocky */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0D0D0D;
}
::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ea580c;
}

.font-black-italic {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 900;
  font-style: italic;
}

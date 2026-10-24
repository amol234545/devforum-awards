const fonts = [
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
  "https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;700&display=swap",
];

for (const href of fonts) {
  if (!document.head.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);
  }
}

const style = document.createElement("style");
style.textContent = `
  :root {
    --md-ref-typeface-brand: "Google Sans Flex", sans-serif;
    --md-ref-typeface-plain: "Google Sans Flex", sans-serif;
    font-family: var(--md-ref-typeface-plain);
    font-size: 14px;
  }

  body {
    margin: 0;
    font-family: var(--md-ref-typeface-plain);
  }

  button, input, textarea, select {
    font: inherit;
  }
`;

document.head.append(style);

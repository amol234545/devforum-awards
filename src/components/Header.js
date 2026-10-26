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

const card_import = document.createElement("script");

card_import.type = "module";
card_import.innerText = `
  import "material/card/card.js";
`;
document.head.append(card_import);

const card = document.createElement("md-card");

card.innerHTML = `
  <h3 style="text-align: left; margin: 8px 16px 0;">
  Made by AudioCreation1 and more
</h3>
<h2 style="text-align: center; padding-top: 1px; margin-top: 0;">
  DevForum Awards 2026
</h2>
`;
document.body.prepend(card);

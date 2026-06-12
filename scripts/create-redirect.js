const fs = require("fs");
const path = require("path");

const BASE_HREF = "/resume/";

const html = `<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8" />
        <title>Myriam Mira — Développeuse front-end</title>
        <meta http-equiv="refresh" content="0; url=${BASE_HREF}fr/" />
        <script>
            const lang = (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
            window.location.replace("${BASE_HREF}" + lang + "/");
        </script>
    </head>
    <body>
        <p><a href="${BASE_HREF}fr/">Français</a> | <a href="${BASE_HREF}en/">English</a></p>
    </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "..", "docs", "index.html"), html);
console.log("Created docs/index.html redirect");

import Fastify from "fastify";
import dotenv from "dotenv";
import * as path from "node:path";

const fastify = Fastify({ logger: true });
const decoder = new TextDecoder();
const env = dotenv.parse(decoder.decode(Deno.readFileSync("./.env")));
const DEVFORUM_TOKEN = env["DEVFORUM_TOKEN"];
const importMap = `
<script type="importmap">
{
  "imports": {
    "material/": "https://cdn.jsdelivr.net/gh/material-esm/material@3/",
    "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.3",
    "lit/": "https://cdn.jsdelivr.net/npm/lit@3.3.3/",
    "@lit/localize": "https://cdn.jsdelivr.net/npm/@lit/localize/lit-localize.js",
    "@lit/reactive-element": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2/reactive-element.js",
    "@lit/reactive-element/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2/",
    "lit-element/lit-element.js": "https://cdn.jsdelivr.net/npm/lit-element@4/lit-element.js",
    "lit-html": "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js",
    "lit-html/": "https://cdn.jsdelivr.net/npm/lit-html@3/"
  }
}
</script>
`;

async function safeResolve(baseDir: string, userInput: string) {
  try {
    const absoluteBase = await Deno.realPath(baseDir);
    const absoluteTarget = await Deno.realPath(
      path.resolve(absoluteBase, userInput),
    );
    const targetInfo = await Deno.stat(absoluteTarget);
    if (!targetInfo.isFile) return null;

    const relativeTarget = path.relative(absoluteBase, absoluteTarget);

    if (
      relativeTarget === "" ||
      relativeTarget === "." ||
      relativeTarget === ".." ||
      relativeTarget.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativeTarget)
    ) {
      return null;
    }

    return absoluteTarget;
  } catch {
    return null;
  }
}

function servePage(path: string) {
  let file = decoder.decode(Deno.readFileSync(path));

  if (!file.includes('type="importmap"')) {
    file = file.replace(/<head([^>]*)>/i, `<head$1>\n${importMap}`);
  }

  return file;
}

fastify.get("/", {}, (_, reply) => {
  reply.type("text/html");
  return servePage("./src/pages/index.html");
});

fastify.get("/is_devforum_user/:id", async (request, reply) => {
  const id = Number(request.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return reply.code(400).send({ error: "Invalid user ID" });
  }
  try {
    const response = await fetch("https://users.roblox.com/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [id] }),
    });
    const { data } = await response.json();
    const username = data?.[0]?.name;
    if (!username) return { isDevForumUser: false };
    const profileResponse = await fetch(
      `https://devforum.roblox.com/u/${encodeURIComponent(username)}.json`,
      {
        headers: { "Cookie": `_t=${DEVFORUM_TOKEN}` },
      }
    );
    if (!profileResponse.ok) return { isDevForumUser: false };
    const profile = await profileResponse.json();
    return {
      isDevForumUser: true,
      username,
      trustLevel: profile?.user?.trust_level ?? null,
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(502).send({ error: "Failed to communicate with external APIs" });
  }
});

fastify.get("/:page", {}, async (request, reply) => {
  const file = await safeResolve(
    "./src/pages",
    `${request.params["page"]}.html`,
  );
  if (!file) return reply.code(404).send({ error: "Not found" });

  reply.type("text/html");
  return servePage(file);
});

fastify.get("/components/:path", {}, async (request, reply) => {
  const file = await safeResolve("./src/components", request.params["path"]);
  if (!file) return reply.code(404).send({ error: "Not found" });

  reply.type("text/javascript");
  return Deno.readFileSync(file);
});

fastify.get("/assets/:path", {}, async (request, reply) => {
  const file = await safeResolve("./src/assets", request.params["path"]);
  if (!file) return reply.code(404).send({ error: "Not found" });

  const contentType = file.endsWith(".png")
    ? "image/png"
    : file.endsWith(".json")
    ? "application/json"
    : "application/octet-stream";
  return reply.type(contentType).send(Deno.readFileSync(file));
});

fastify.get("/themes/:path", {}, async (request, reply) => {
  const file = await safeResolve("./src/themes", request.params["path"]);
  if (!file) return reply.code(404).send({ error: "Not found" });

  reply.type("text/css");
  return Deno.readFileSync(file);
});


await fastify.listen({ port: 8000 });

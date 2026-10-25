import Fastify from "fastify";
import dotenv from "dotenv";
import * as path from "node:path"

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


function safeResolve(baseDir: string, userInput: string) {
  // 1. Resolve to an absolute path to eliminate '.' and '..'
  const absoluteBase = path.resolve(baseDir);
  const absoluteTarget = path.resolve(baseDir, userInput);

  // 2. Check if the target path starts with the base directory path
  if (!absoluteTarget.startsWith(absoluteBase)) {
    throw new Error("Directory traversal attempt detected!");
  }

  return absoluteTarget;
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

fastify.get("/:page", {}, (request, reply) => {
  reply.type("text/html");
  return servePage(safeResolve(`./src/pages/`,request.params["page"]+".html"));
});

fastify.get("/components/:path", {}, (request, reply) => {
  reply.type("text/javascript");
  return Deno.readFileSync(
    safeResolve(`./src/components/`,request.params["page"]+".js"),
  );
});

fastify.get("/assets/:path", {}, (request) => {
  // no header here; the browser can figure it out
  return Deno.readFileSync(
    safeResolve(`./src/assets/`,request.params["page"]),
  );
});

fastify.get("/themes/:path", {}, (request, reply) => {
  reply.type("text/css");
  return Deno.readFileSync(
    safeResolve(`./src/assets/`,request.params["page"]+".css"),
  );
});


await fastify.listen({ port: 8000 });

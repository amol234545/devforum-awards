module.exports = {
  apps: [
    {
      name: "deno-server",
      script: "deno",
      args: "run --allow-net --allow-env --allow-sys --allow-read main.ts",
      autorestart: true,
      watch: false,
    },
    {
      name: "cf-tunnel",
      script: "cloudflared",
      args: "tunnel --no-autoupdate run awards",
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER || "root",
      host: process.env.DEPLOY_HOST,
      ref: "origin/main",
      repo: "https://github.com/amol234545/devforum-awards",
      path: "~/devforum-awards",
    },
  },
};

module.exports = {
  apps: [
    {
      name: "deno-server",
      script: "deno",
      args: "--allow-net --allow-env --allow-sys --allow-read main.ts", 
      autorestart: true,
      watch: false,
    },
    {
      name: "cf-tunnel",
      script: "cloudflared",
      args: "tunnel --no-autoupdate run awards",
    }
  ]
};

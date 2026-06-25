module.exports = {
  apps: [
    {
      name: "joao-sistema",
      script: "npm",
      args: "run start",
      cwd: process.env.APP_DIR || process.cwd(),
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};

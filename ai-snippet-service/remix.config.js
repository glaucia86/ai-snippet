/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  tailwind: true,
  postcss: true,
  appDirectory: "app",
  buildDirectory: "build",
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
  devServerPort: 3030,
};
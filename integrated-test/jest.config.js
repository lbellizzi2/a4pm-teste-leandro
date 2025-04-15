module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.js"], 
  verbose: true,
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./html-report",
        filename: "report.html",
        expand: true,
      },
    ],
  ],
};

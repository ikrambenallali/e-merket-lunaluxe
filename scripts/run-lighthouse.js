import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:5173";

async function runLighthouse() {
  const chrome = await launch({ chromeFlags: ["--headless"] });

  const options = {
    logLevel: "info",
    output: ["html", "json"],
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

const htmlDir = path.resolve("repports/html");
const jsonDir = path.resolve("repports/json");

if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });
if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

// Save HTML report
const htmlReport = runnerResult.report[0];
fs.writeFileSync(path.join(htmlDir, "lighthouse-report.html"), htmlReport);

// Save JSON report
const jsonReport = runnerResult.report[1];
fs.writeFileSync(path.join(jsonDir, "lighthouse-report.json"), jsonReport);


  console.log("✔ Lighthouse Scan Completed!");
  console.log(`📄 HTML report saved as: lighthouse-report.html`);
  console.log(`📄 JSON report saved as: lighthouse-report.json`);

  console.log("\n=== SCORES ===");
  console.log("Performance:", runnerResult.lhr.categories.performance.score * 100);
  console.log("Accessibility:", runnerResult.lhr.categories.accessibility.score * 100);
  console.log("Best Practices:", runnerResult.lhr.categories["best-practices"].score * 100);
  console.log("SEO:", runnerResult.lhr.categories.seo.score * 100);

  await chrome.kill();
}

runLighthouse();

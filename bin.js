#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs/promises";
import process from "node:process";
import { execa } from "execa";
import ora from "ora";

const CWD = process.cwd();
const DEBUG = process.env.DEBUG;

async function readPackageJson() {
  let packageJson = path.join(CWD, "package.json");
  let content = await fs.readFile(packageJson);

  return JSON.parse(content);
}

async function getDeclaredDeps(json, includeDev = false) {
  let deps = [
    ...Object.entries(json.dependencies || {}),
    ...Object.entries(json.peerDependencies || {}),
  ];

  if (includeDev) {
    deps.push(...Object.entries(json.devDependencies || {}));
  }

  return deps;
}

async function getPackageInfo(name, version) {
  try {
    let { stdout } = await execa`npm info ${name}@${version} --json`;

    return JSON.parse(stdout);
  } catch (e) {
    if (typeof e === "object" && e !== null) {
      if ("message" in e) {
        let msg = e.message;
        if (msg.includes("code E404")) {
          NOT_FOUND.add(name);

          return;
        }

        if (msg.includes("code E401")) {
          NOT_AUTHORIZED.add(name);

          return;
        }
      }
    }

    throw e;
  }
}

const SEEN_DEPS = new Set();
const NOT_FOUND = new Set();
const WORKSPACE_DEPS = new Set();
const NOT_AUTHORIZED = new Set();
const ADDONS = {};

const QUEUE = [];

function updateAddons(info, latestVersionInfo) {
  ADDONS[info.name] = {
    currentVersion: info.version,
    latestVersion: latestVersionInfo.version,
    author: info.maintainers?.join(",") ?? info.author,
    isV2Addon: info["ember-addon"]?.version === 2,
    isV2AddonAvailable: latestVersionInfo["ember-addon"]?.version === 2,
  };
}

async function traverseGraph() {
  async function processDep(depName, depVersion) {
    if (SEEN_DEPS.has(depName)) {
      return;
    }
    if (depVersion.startsWith("workspace:")) {
      WORKSPACE_DEPS.add(depName);
      SEEN_DEPS.add(depName);
      return;
    }

    if (DEBUG) {
      console.debug(`Processed ${SEEN_DEPS.size}. Processing ${depName}`);
    }

    spinner.text = `Inspecting ${depName}`;
    let info = await getPackageInfo(depName, depVersion);

    if (!info) {
      SEEN_DEPS.add(depName);
      return;
    }

    if (!info.keywords?.includes("ember-addon")) {
      SEEN_DEPS.add(depName);
      return;
    }

    let latestInfo = await getPackageInfo(depName, "latest");

    updateAddons(info, latestInfo);

    SEEN_DEPS.add(depName);

    let subDeps = await getDeclaredDeps(info);

    QUEUE.push(...subDeps);
  }

  async function prepareBatch(batch) {
    await Promise.all(
      batch.map((depName) => processDep(depName[0], depName[1]))
    );
  }

  while (QUEUE.length > 0) {
    let batch = [];

    for (let i = 0; i < Math.min(QUEUE.length, 20); i++) {
      let depName = QUEUE.pop();
      batch.push(depName);
    }

    await prepareBatch(batch);
  }
}

let rootJson = await readPackageJson();

console.info(`Gathering Ember Addon dependency info for '${rootJson.name}'`);
const spinner = ora("Loading dependencies").start();

let rootDeps = await getDeclaredDeps(rootJson, true);
QUEUE.push(...rootDeps);
await traverseGraph();

spinner.succeed("Successfully compiled addon info");
spinner.stop();

let tableData = Object.entries(ADDONS).map(([addonName, addonInfo]) => ({
  "NPM Name": addonName,
  // Author: addonInfo.author,
  "Current version": addonInfo.currentVersion,
  "Latest version": addonInfo.latestVersion,
  "On V2 Addon": addonInfo.isV2Addon ? "✅" : "❌",
  "V2 Addon available": addonInfo.isV2AddonAvailable ? "✅" : "❌",
}));

tableData.sort((a, b) => a["NPM Name"].localeCompare(b["NPM Name"]));
console.table(tableData);

if (NOT_FOUND.size > 0) {
  console.info("The following packages could not be found and were skipped");
  console.log(NOT_FOUND);
}

if (NOT_AUTHORIZED.size > 0) {
  console.info(
    "The following packages required authorization and were skipped"
  );
  console.log(NOT_AUTHORIZED);
}

if (WORKSPACE_DEPS.size > 0) {
  console.info(
    "The following packages were skipped as they are workspace local"
  );
  console.log(WORKSPACE_DEPS);
}

const upgradableAddons = Object.entries(ADDONS).filter(
  ([_, info]) => info.isV2AddonAvailable !== info.isV2Addon
);
if (upgradableAddons.length) {
  console.info(
    "There are addons available that are on V1 but have a V2 version available 🎉"
  );

  upgradableAddons.forEach(([addonName, addonInfo]) => {
    console.info(`- ${addonName} (latest: ${addonInfo.latestVersion})`);
  });
}

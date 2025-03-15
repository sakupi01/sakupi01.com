import path from "node:path";
import { confirm, input } from "@inquirer/prompts";
import type { Command } from "commander";
import ora from "ora";
import { checkTailwindCSS } from "../utils/check-deps";
import { createUtils } from "../utils/create-utils";
import { fetchUtils } from "../utils/registry/index";

// Define the command to initialize the environment to generate the heatmap in tailwindcss and with given types and constants
// > pnpm git-heatmap init -d <directory>
export const init = (program: Command) =>
  program
    .command("init")
    .description("Initialize the environment to generate the heatmap")
    .action(async () => {
      const spinner = ora();
      // check if tailwindcss is installed
      spinner.start("Checking if tailwindcss is installed...");
      const isTailwindCSSInstalled = await checkTailwindCSS();
      if (!isTailwindCSSInstalled) {
        spinner.fail(
          "tailwindcss is not installed. Please install it first adopting your project. See: https://tailwindcss.com/docs/installation/framework-guides",
        );
        spinner.stop();
        return;
      }
      spinner.succeed("tailwindcss is installed!");
      spinner.stop();

      const globalCSSDir = await input({
        message: " Where is your global CSS file?",
        default: "app/global.css",
      });
      const directory = path.join(globalCSSDir, "git-heatmap");

      const needTypeFile = await confirm({
        message: "Do you need types and constants?",
        default: true,
      });

      try {
        // fetch files from GitHub
        spinner.start("Fetching files...");
        const files = await fetchUtils(needTypeFile);
        spinner.succeed("Files are fetched from GitHub!");
        spinner.stop();

        // set files under the given directory
        spinner.start(`Setting files under ${directory}`);
        createUtils(directory, files, needTypeFile);
        spinner.succeed(
          `Files are set under ${directory}/constants and ${directory}/types`,
        );
        spinner.stop();
      } catch {
        spinner.fail("There was an error fetching the components");
        spinner.stop();
      }
      spinner.clear();
    });

import path from "node:path";
import { input } from "@inquirer/prompts";
import type { Command } from "commander";
import ora from "ora";
import { createComponent } from "../utils/create-components";
import { fetchComponent } from "../utils/registry";

// Define the command to generate the heatmap under the given directory if it is not already present
// > pnpm git-heatmap generate <components...> -d <directory>
export const generate = (program: Command) =>
  program
    .command("gen")
    .description("Generate the heatmap under the given directory")
    .arguments("<components...>")
    .action(async (components) => {
      const globalCSSDir = await input({
        message: " Where is your global CSS file?",
      });
      const directory = path.join(globalCSSDir, "git-heatmap");
      const spinner = ora();
      try {
        // fetch component from GitHub
        spinner.start("Fetching components...");
        const items = await fetchComponent(components);
        spinner.succeed("Components are fetched from GitHub!");
        spinner.stop();

        // create directory and component file under the given directory and write the content
        for (const item of items) {
          spinner.start(`Creating component ${item.name}`);
          createComponent(directory, item);
          spinner.succeed(
            `Component ${item.name} is generated under ${directory}`,
          );
        }
        spinner.stop();
      } catch {
        spinner.fail("There was an error fetching the components");
        spinner.stop();
      }
      spinner.clear();
    });

import fs from "node:fs";

// Function to parse CSS variable value
function parseValue(value) {
  // Remove CSS comments if they exist
  const cleanedValue = value.replace(/\/\*.*?\*\//g, "").trim();
  // Remove any trailing semicolons and trim whitespace
  return cleanedValue.replace(/;$/, "").trim();
}

// Function to build nested object structure from parts
function buildNestedObject(obj, parts, value) {
  let current = obj;

  // Handle special case for font-family and other similar properties
  const normalizedParts = parts.flatMap((part) => {
    // Replace 'family-title' with ['family', 'title'] etc.
    if (part.includes("-")) {
      return part.split("-");
    }
    return [part];
  });

  for (let i = 0; i < normalizedParts.length - 1; i++) {
    const part = normalizedParts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }

  const lastPart = normalizedParts[normalizedParts.length - 1];
  // Handle numeric parts (like steps) by removing leading zeros
  current[lastPart] = value;
}

// Main function to convert CSS to JSON
function convertCssToJson(inputPath, outputPath) {
  try {
    // Read the CSS file
    let cssContent = fs.readFileSync(inputPath, "utf8");

    // Remove multi-line comments
    cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, "");

    // Extract the content within :root {...}
    const rootMatch = cssContent.match(/:where\(\*\) \s*{([^}]+)}/);
    if (!rootMatch) {
      throw new Error("No :root selector found in CSS");
    }

    cssContent = rootMatch[1];

    // Initialize the result object
    const result = {
      tokens: {},
    };

    // Regular expression to match CSS custom properties, handling multi-line values
    const cssVarRegex = /--([^:]+):\s*([^;]+);/g;

    // Process each CSS variable
    while (true) {
      const match = cssVarRegex.exec(cssContent);
      if (match === null) break;
      const [_, name, value] = match;

      // Split the variable name into parts (excluding 'webui' prefix)
      const parts = name.split("-");
      // Build the nested structure
      buildNestedObject(result.tokens, parts, parseValue(value));
    }

    // Write the result to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");

    console.log(`✅ Successfully converted CSS to JSON: ${outputPath}`);
  } catch (error) {
    console.error("❌ Error converting CSS to JSON:", error.message);
  }
}

// Get the command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log(
    "node cssToJson.js src/css/tokens/tokens.css src/css/tokens/tokens.json",
  );
  process.exit(1);
}

const [inputPath, outputPath] = args;

// Run the conversion
convertCssToJson(inputPath, outputPath);

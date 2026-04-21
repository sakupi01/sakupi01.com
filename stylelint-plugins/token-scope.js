/**
 * stylelint custom rule: enforce token boundaries.
 *
 * Two enforcement modes, configured separately per rule:
 *   - `allowedPrefix`: which token prefixes any var() may use in matching
 *     declarations. Use this to forbid --p-* outside the token layer.
 *   - `rules`: which specific token names are allowed for a given property.
 *     Use this to restrict e.g. `padding` to --s-space-layout-*.
 *
 * Config shape:
 *   "custom/token-scope": [true, {
 *     allowedPrefix: "^--s-",
 *     rules: [
 *       { propPattern: "^padding", tokenPattern: "^--s-space-layout-" },
 *       ...
 *     ]
 *   }]
 */
import stylelint from "stylelint";

const ruleName = "custom/token-scope";
const messages = stylelint.utils.ruleMessages(ruleName, {
  forbiddenPrefix: (prop, token, allowed) =>
    `"${prop}: var(${token})" is forbidden — only tokens matching /${allowed}/ may be used here`,
  mismatch: (prop, token, allowed) =>
    `"${prop}" should reference a token matching /${allowed}/, got "${token}"`,
});

function extractVarNames(value) {
  return [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);
}

const rule =
  (primary, secondary = {}) =>
  (root, result) => {
    const valid = stylelint.utils.validateOptions(
      result,
      ruleName,
      { actual: primary, possible: [true] },
      {
        actual: secondary,
        possible: {
          allowedPrefix: (v) => typeof v === "string",
          // stylelint iterates array values and calls this per-element,
          // so `r` is a single rule object, not the whole array.
          rules: (r) =>
            r != null &&
            typeof r === "object" &&
            typeof r.propPattern === "string" &&
            typeof r.tokenPattern === "string",
        },
        optional: true,
      }
    );
    if (!valid) return;

    const allowedPrefixRe = secondary.allowedPrefix
      ? new RegExp(secondary.allowedPrefix)
      : null;

    const propRules = (secondary.rules || []).map((r) => ({
      propRe: new RegExp(r.propPattern),
      tokenRe: new RegExp(r.tokenPattern),
      rawTokenPattern: r.tokenPattern,
    }));

    root.walkDecls((decl) => {
      const tokens = extractVarNames(decl.value);
      if (tokens.length === 0) return;

      for (const token of tokens) {
        // Ignore locally-scoped CSS custom properties (non-token vars).
        if (!token.startsWith("--p-") && !token.startsWith("--s-")) continue;

        // Rule 1: global prefix restriction (e.g. no --p-* in project code)
        if (allowedPrefixRe && !allowedPrefixRe.test(token)) {
          stylelint.utils.report({
            message: messages.forbiddenPrefix(
              decl.prop,
              token,
              secondary.allowedPrefix
            ),
            node: decl,
            result,
            ruleName,
          });
          continue; // don't double-report on per-prop rule
        }

        // Rule 2: per-property token pattern
        for (const { propRe, tokenRe, rawTokenPattern } of propRules) {
          if (!propRe.test(decl.prop)) continue;
          if (!tokenRe.test(token)) {
            stylelint.utils.report({
              message: messages.mismatch(decl.prop, token, rawTokenPattern),
              node: decl,
              result,
              ruleName,
            });
          }
        }
      }
    });
  };

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);

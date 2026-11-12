/**
 * Pure rule-based eligibility engine.
 * Evaluates configurable JSON rules (AND / OR / NOT) without any hardcoded scheme logic.
 */

function evaluateCondition(rule, rawAnswer) {
  if (rawAnswer === undefined || rawAnswer === null || rawAnswer === "") {
    return { status: "missing", reason: "No answer provided" };
  }

  if (rawAnswer === "unsure") {
    return { status: "manual", reason: "Marked for manual verification" };
  }

  const { operator, value } = rule;
  let passed = false;

  switch (operator) {
    case "eq":
      passed = String(rawAnswer).toLowerCase() === String(value).toLowerCase();
      break;
    case "neq":
      passed = String(rawAnswer).toLowerCase() !== String(value).toLowerCase();
      break;
    case "lte":
      passed = Number(rawAnswer) <= Number(value);
      break;
    case "gte":
      passed = Number(rawAnswer) >= Number(value);
      break;
    case "in":
      passed = Array.isArray(value)
        ? value.map((v) => String(v).toLowerCase()).includes(String(rawAnswer).toLowerCase())
        : false;
      break;
    case "boolean_yes":
      passed = rawAnswer === true || rawAnswer === "yes";
      break;
    case "boolean_no":
      passed = rawAnswer === false || rawAnswer === "no";
      break;
    default:
      passed = false;
  }

  // For NOT rules, the condition describes an exclusion criterion.
  // If operator matches the exclusion (e.g. "yes" to "Are you an income tax payer?"),
  // then the exclusion is triggered -> fails!
  if (rule.logic === "NOT") {
    if (rule.manualConfirmNote && rawAnswer === "yes") {
      return { status: "failed", reason: rule.manualConfirmNote };
    }
    return passed
      ? { status: "failed", reason: "Exclusion condition applies" }
      : { status: "passed", reason: "No exclusion triggered" };
  }

  if (passed && rule.manualConfirmNote) {
    return { status: "manual", reason: rule.manualConfirmNote };
  }

  return passed
    ? { status: "passed", reason: "Satisfied" }
    : { status: "failed", reason: "Requirement not met" };
}

export function evaluateSchemeEligibility(rules = [], answers = {}) {
  if (!rules.length) {
    return {
      outcome: "needs_verification",
      details: [],
      summary: { passed: 0, failed: 0, missing: 0, manual: 0 }
    };
  }

  const details = rules.map((rule) => {
    const answer = answers[rule.id];
    const evalResult = evaluateCondition(rule, answer);
    return {
      ruleId: rule.id,
      logic: rule.logic || "AND",
      label: rule.question,
      answer,
      status: evalResult.status,
      reason: evalResult.reason
    };
  });

  const andRules = details.filter((d) => d.logic === "AND");
  const orRules = details.filter((d) => d.logic === "OR");
  const notRules = details.filter((d) => d.logic === "NOT");

  const andFailed = andRules.some((d) => d.status === "failed");
  const notFailed = notRules.some((d) => d.status === "failed");
  const orPassed = orRules.length === 0 || orRules.some((d) => d.status === "passed");
  const orAllEvaluatedFailed =
    orRules.length > 0 && orRules.every((d) => d.status === "failed");

  const mandatoryRules = [...andRules, ...notRules];
  const hasMissing =
    mandatoryRules.some((d) => d.status === "missing") ||
    (!orPassed && orRules.some((d) => d.status === "missing"));
  const hasManual =
    mandatoryRules.some((d) => d.status === "manual") ||
    (!orPassed && orRules.some((d) => d.status === "manual"));

  let outcome = "eligible";
  if (andFailed || notFailed || orAllEvaluatedFailed) {
    outcome = "not_eligible";
  } else if (hasMissing) {
    outcome = "needs_info";
  } else if (hasManual) {
    outcome = "needs_verification";
  } else {
    outcome = "eligible";
  }

  const summary = {
    passed: details.filter((d) => d.status === "passed").length,
    failed: details.filter((d) => d.status === "failed").length,
    missing: details.filter((d) => d.status === "missing").length,
    manual: details.filter((d) => d.status === "manual").length
  };

  return { outcome, details, summary };
}

export function prefillAnswersFromProfile(rules = [], profile = null) {
  if (!profile) return {};
  const prefilled = {};
  for (const rule of rules) {
    if (rule.profileField && profile[rule.profileField] !== undefined && profile[rule.profileField] !== "") {
      prefilled[rule.id] = profile[rule.profileField];
    }
  }
  return prefilled;
}

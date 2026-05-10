/**
 * Input validation & abuse detection for AI routes.
 *
 * Checks for:
 * - Fields exceeding max length (prevents token stuffing)
 * - Prompt injection attempts ("ignore previous instructions", etc.)
 * - Junk/garbage input (random characters, no real words)
 * - Suspiciously repetitive content
 */

// ─── Max lengths ──────────────────────────────────────────────────────────────

export const MAX_LENGTHS = {
  businessName: 80,
  category:     60,
  city:         60,
  state:        2,
  phone:        20,
  email:        100,
  address:      150,
  description:  800,   // Main abuse vector — cap tightly
  services:     500,
  hours:        200,
  message:      2000,  // Contact form
};

// ─── Prompt injection patterns ────────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /forget\s+(everything|all|your)\s+(above|previous|prior)/i,
  /you\s+are\s+now\s+(a|an|the)\s+/i,
  /act\s+as\s+(a|an|the)\s+/i,
  /pretend\s+you\s+are/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /bypass\s+(safety|filter|restriction)/i,
  /\[SYSTEM\]/i,
  /<\|im_start\|>/i,
  /###\s*Instruction/i,
  /reveal\s+(your|the)\s+(prompt|system|instructions)/i,
];

// ─── Junk detection ───────────────────────────────────────────────────────────

function isGarbageInput(text: string): boolean {
  if (!text || text.trim().length < 3) return false;

  // Check ratio of letters to total chars — garbage has low letter ratio
  const letters = (text.match(/[a-zA-Z]/g) ?? []).length;
  const ratio = letters / text.length;
  if (ratio < 0.3 && text.length > 20) return true;

  // Check for excessive repetition (same char repeated many times)
  if (/(.)\1{9,}/.test(text)) return true;

  // Check for no spaces in long strings (likely keyboard mashing)
  if (text.length > 30 && !text.includes(" ") && !/^[\w.@-]+$/.test(text)) return true;

  return false;
}

// ─── Main validation function ─────────────────────────────────────────────────

export type GuardResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

export function guardInputs(
  inputs: Record<string, string | undefined>
): GuardResult {
  for (const [field, value] of Object.entries(inputs)) {
    if (!value) continue;

    const maxLen = MAX_LENGTHS[field as keyof typeof MAX_LENGTHS];

    // Length check
    if (maxLen && value.length > maxLen) {
      return {
        ok: false,
        error: `Field "${field}" exceeds maximum length of ${maxLen} characters`,
        field,
      };
    }

    // Prompt injection check
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(value)) {
        return {
          ok: false,
          error: "Invalid input detected",
          field,
        };
      }
    }

    // Junk input check (only on longer free-text fields)
    if (["description", "services", "message"].includes(field) && isGarbageInput(value)) {
      return {
        ok: false,
        error: `Please enter a valid ${field}`,
        field,
      };
    }
  }

  return { ok: true };
}

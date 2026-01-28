export const TAGS = {
  DOC: { DOCUMENTED: '@docs', NOT_DOCUMENTED: '@no_docs' },
  TYPE: { API: '@api', WEB: '@web' },
  SPEED: { SLOW: '@slow', FAST: '@fast' },
  STATUS: { EXPECTED_TO_PASS: '@expected_to_pass', EXPECTED_TO_FAIL: '@expected_to_fail' }
} as const

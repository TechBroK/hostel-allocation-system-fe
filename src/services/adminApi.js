// Deprecated module: use `adminApi` from `src/utils/api.js` instead.
// This module remains only for backward compatibility and will be removed.
// If any old code calls these functions, they will warn/throw to highlight migration.

export function fetchStudents() {
  console.warn('[DEPRECATED] src/services/adminApi.js.fetchStudents is deprecated. Use adminApi.getStudents from src/utils/api.js');
  throw new Error('Deprecated: Use adminApi from src/utils/api.js');
}

// No default export to discourage imports
export default undefined;

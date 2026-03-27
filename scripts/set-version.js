const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');

const hash = execSync('git rev-parse --short HEAD').toString().trim();

const content = `// Auto-generated at build time — do not edit
export const GIT_HASH = '${hash}';
`;

writeFileSync(join(__dirname, '../src/version.ts'), content);
console.log(`Version set: ${hash}`);

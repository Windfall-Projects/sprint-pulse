const fs = require('fs');

const createMarkdown = (filePath, rule, snippet, correction) => {
    return `**File Path:** \`${filePath}\`
**Violated Boundary/Rule:** \`${rule}\`

**Failing Code Snippet:**
\`\`\`typescript
${snippet}
\`\`\`

**Required Correction:** \`${correction}\``;
};

// ... Wait, I can just use curl.

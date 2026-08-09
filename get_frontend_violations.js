const fs = require('fs');
const path = require('path');

function getViolations(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getViolations(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('.trim(')) {
                console.log(`Violation found in ${fullPath}`);
            }
        }
    }
}

getViolations('apps/web/src/app');

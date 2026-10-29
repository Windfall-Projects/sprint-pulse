const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'supabase', 'functions', 'tests');
const files = fs.readdirSync(testsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
    const filePath = path.join(testsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if tests connect to the real supabase instance
    if (content.includes('supabase = createClient') && !content.includes('mock')) {
        console.log(`Uses real Supabase in ${file}`);
    }
}

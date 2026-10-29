const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'supabase', 'functions', 'api', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for `as any` or explicit cast instead of using types
    if (content.includes('as any')) {
        console.log(`Uses 'as any' in ${file}`);
    }
}

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'supabase', 'functions', 'api', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

let allGood = true;
for (const file of files) {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for runtime validation with Zod
    if (content.includes('c.req.json()') || content.includes('c.req.param(') || content.includes('c.req.query(')) {
        if (!content.includes('zValidator')) {
            console.log(`Missing zValidator in ${file}`);
            allGood = false;
        }
    }
}
if (allGood) console.log("All files look good!");

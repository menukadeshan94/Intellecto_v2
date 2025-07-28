// scripts/force-regenerate.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Force regenerating Prisma client...\n');

try {
    // 1. Remove existing generated client
    const generatedPath = path.join(__dirname, '../src/generated');
    if (fs.existsSync(generatedPath)) {
        console.log('🗑️  Removing existing generated client...');
        fs.rmSync(generatedPath, { recursive: true, force: true });
        console.log('✅ Removed existing generated client');
    }

    // 2. Remove node_modules/.prisma if it exists
    const prismaNodeModulesPath = path.join(__dirname, '../node_modules/.prisma');
    if (fs.existsSync(prismaNodeModulesPath)) {
        console.log('🗑️  Removing .prisma cache...');
        fs.rmSync(prismaNodeModulesPath, { recursive: true, force: true });
        console.log('✅ Removed .prisma cache');
    }

    // 3. Push schema to database
    console.log('\n📤 Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Schema pushed to database');

    // 4. Generate fresh client
    console.log('\n🔨 Generating fresh Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Fresh Prisma client generated');

    // 5. Verify the generated types
    console.log('\n🔍 Verifying generated CategoryStat type...');
    const typesPath = path.join(__dirname, '../src/generated/prisma/index.d.ts');
    
    if (fs.existsSync(typesPath)) {
        const types = fs.readFileSync(typesPath, 'utf8');
        const categoryStatMatch = types.match(/export type CategoryStat = \{[\s\S]*?\}/);
        
        if (categoryStatMatch) {
            console.log('📋 Generated CategoryStat type:');
            console.log(categoryStatMatch[0]);
            
            if (categoryStatMatch[0].includes('bestScore')) {
                console.log('\n✅ SUCCESS: bestScore field is now in generated types!');
            } else {
                console.log('\n❌ ISSUE: bestScore field still missing from generated types');
                console.log('📝 This might indicate a schema issue. Check your schema.prisma file.');
            }
        } else {
            console.log('❌ Could not find CategoryStat type in generated file');
        }
    } else {
        console.log('❌ Generated types file not found');
    }

    console.log('\n🎉 Regeneration complete!');
    console.log('🔄 Now restart your development server and IDE/TypeScript server');

} catch (error) {
    console.error('❌ Error during regeneration:', error.message);
    process.exit(1);
}
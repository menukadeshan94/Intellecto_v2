// scripts/detailed-verification.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Detailed verification of schema and generated types...\n');

// 1. Check schema.prisma
console.log('📋 CHECKING SCHEMA.PRISMA:');
console.log('='.repeat(50));
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file found');
    
    // Find CategoryStat model
    const modelStart = schema.indexOf('model CategoryStat');
    if (modelStart !== -1) {
        const modelEnd = schema.indexOf('}', modelStart) + 1;
        const categoryStatModel = schema.substring(modelStart, modelEnd);
        console.log('✅ CategoryStat model found:');
        console.log(categoryStatModel);
        
        if (categoryStatModel.includes('bestScore')) {
            console.log('\n✅ bestScore field exists in schema');
        } else {
            console.log('\n❌ bestScore field missing from schema');
        }
    } else {
        console.log('❌ CategoryStat model not found in schema');
    }
} else {
    console.log('❌ Schema file not found');
}

console.log('\n' + '='.repeat(50));

// 2. Check generated client
console.log('🔨 CHECKING GENERATED CLIENT:');
console.log('='.repeat(50));
const generatedPath = path.join(__dirname, '../src/generated/prisma/index.d.ts');
if (fs.existsSync(generatedPath)) {
    console.log('✅ Generated types file found');
    const types = fs.readFileSync(generatedPath, 'utf8');
    
    // Look for all CategoryStat references
    const categoryStatReferences = [];
    const lines = types.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('CategoryStat')) {
            categoryStatReferences.push(`Line ${index + 1}: ${line.trim()}`);
        }
    });
    
    if (categoryStatReferences.length > 0) {
        console.log(`✅ Found ${categoryStatReferences.length} CategoryStat references:`);
        categoryStatReferences.slice(0, 10).forEach(ref => console.log(`   ${ref}`));
        if (categoryStatReferences.length > 10) {
            console.log(`   ... and ${categoryStatReferences.length - 10} more`);
        }
    } else {
        console.log('❌ No CategoryStat references found in generated types');
    }
    
    // Look for the main CategoryStat type
    const typeMatch = types.match(/export type CategoryStat = \{[\s\S]*?\}/);
    if (typeMatch) {
        console.log('\n✅ CategoryStat type definition found:');
        console.log(typeMatch[0]);
        
        if (typeMatch[0].includes('bestScore')) {
            console.log('\n✅ bestScore field exists in generated type');
        } else {
            console.log('\n❌ bestScore field missing from generated type');
        }
    } else {
        console.log('\n❌ CategoryStat type definition not found');
        
        // Try alternative search patterns
        const altMatch1 = types.match(/CategoryStat.*=.*\{[\s\S]*?\}/);
        const altMatch2 = types.match(/interface CategoryStat[\s\S]*?\}/);
        
        if (altMatch1) {
            console.log('🔍 Found alternative CategoryStat definition:');
            console.log(altMatch1[0]);
        } else if (altMatch2) {
            console.log('🔍 Found CategoryStat interface:');
            console.log(altMatch2[0]);
        }
    }
    
    // Check file size and basic content
    console.log(`\n📊 Generated file stats:`);
    console.log(`   Size: ${(types.length / 1024).toFixed(2)} KB`);
    console.log(`   Lines: ${types.split('\n').length}`);
    console.log(`   Contains "CategoryStat": ${types.includes('CategoryStat')}`);
    console.log(`   Contains "bestScore": ${types.includes('bestScore')}`);
    
} else {
    console.log('❌ Generated types file not found at expected location');
    
    // Check alternative locations
    const altPaths = [
        path.join(__dirname, '../node_modules/.prisma/client/index.d.ts'),
        path.join(__dirname, '../prisma/generated/client/index.d.ts'),
        path.join(__dirname, '../generated/prisma/index.d.ts')
    ];
    
    console.log('\n🔍 Checking alternative locations:');
    altPaths.forEach(altPath => {
        if (fs.existsSync(altPath)) {
            console.log(`✅ Found at: ${altPath}`);
        } else {
            console.log(`❌ Not found: ${altPath}`);
        }
    });
}

console.log('\n' + '='.repeat(50));
console.log('🎯 RECOMMENDATIONS:');
console.log('='.repeat(50));

if (!fs.existsSync(schemaPath)) {
    console.log('1. ❌ Fix schema.prisma path');
} else if (!fs.existsSync(generatedPath)) {
    console.log('1. ❌ Prisma client not generated to expected location');
    console.log('   Try: npx prisma generate --force');
} else {
    console.log('1. ✅ Both schema and generated client exist');
    console.log('2. 🔄 Try restarting your TypeScript server');
    console.log('3. 🔄 Try restarting your development server');
}
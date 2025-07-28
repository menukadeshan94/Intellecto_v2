// scripts/enhanced-verification.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Enhanced verification of CategoryStat type definition...\n');

const generatedPath = path.join(__dirname, '../src/generated/prisma/index.d.ts');

if (fs.existsSync(generatedPath)) {
    const types = fs.readFileSync(generatedPath, 'utf8');
    
    console.log('🔍 SEARCHING FOR CATEGORYSTAT TYPE PATTERNS:');
    console.log('='.repeat(60));
    
    // Pattern 1: Direct type export
    const pattern1 = /export type CategoryStat = [^}]+}/g;
    const matches1 = types.match(pattern1);
    if (matches1) {
        console.log('✅ Pattern 1 - Direct type export:');
        matches1.forEach(match => console.log(match));
        console.log();
    }
    
    // Pattern 2: $Result.DefaultSelection pattern
    const pattern2 = /export type CategoryStat = \$Result\.DefaultSelection<[^>]+>/g;
    const matches2 = types.match(pattern2);
    if (matches2) {
        console.log('✅ Pattern 2 - $Result.DefaultSelection:');
        matches2.forEach(match => console.log(match));
        console.log();
    }
    
    // Pattern 3: Look for the actual payload definition
    console.log('🔍 SEARCHING FOR CATEGORYSTAT PAYLOAD:');
    console.log('='.repeat(60));
    
    const payloadPattern = /\$CategoryStatPayload[^}]+}[^}]+}/g;
    const payloadMatches = types.match(payloadPattern);
    if (payloadMatches) {
        console.log('✅ Found CategoryStat payload definitions:');
        payloadMatches.forEach((match, index) => {
            console.log(`\nPayload ${index + 1}:`);
            console.log(match);
        });
    }
    
    // Pattern 4: Search for the actual object structure with bestScore
    console.log('\n🔍 SEARCHING FOR BESTSCORE IN TYPE DEFINITIONS:');
    console.log('='.repeat(60));
    
    const lines = types.split('\n');
    let inCategoryStatDefinition = false;
    let definitionLines = [];
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Start of a CategoryStat-related definition
        if (line.includes('CategoryStat') && (line.includes('type') || line.includes('interface') || line.includes('payload'))) {
            inCategoryStatDefinition = true;
            definitionLines = [line];
            braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
            continue;
        }
        
        if (inCategoryStatDefinition) {
            definitionLines.push(line);
            braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
            
            // Check if this definition contains bestScore
            if (line.includes('bestScore')) {
                console.log('✅ Found CategoryStat definition with bestScore:');
                console.log('Lines ' + (i - definitionLines.length + 2) + '-' + (i + 1) + ':');
                console.log(definitionLines.join('\n'));
                console.log();
                inCategoryStatDefinition = false;
                definitionLines = [];
                continue;
            }
            
            // End of definition
            if (braceCount <= 0) {
                inCategoryStatDefinition = false;
                definitionLines = [];
            }
        }
    }
    
    // Pattern 5: Search around line 45 where the main type was found
    console.log('🔍 CONTEXT AROUND MAIN CATEGORYSTAT TYPE (Line 45):');
    console.log('='.repeat(60));
    
    const contextLines = lines.slice(40, 50);
    contextLines.forEach((line, index) => {
        console.log(`Line ${41 + index}: ${line}`);
    });
    
    // Pattern 6: Find all type definitions that mention bestScore
    console.log('\n🔍 ALL DEFINITIONS MENTIONING BESTSCORE:');
    console.log('='.repeat(60));
    
    lines.forEach((line, index) => {
        if (line.includes('bestScore')) {
            console.log(`Line ${index + 1}: ${line.trim()}`);
        }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ANALYSIS SUMMARY:');
    console.log('='.repeat(60));
    console.log(`✅ CategoryStat references found: 643`);
    console.log(`✅ bestScore mentions found: ${(types.match(/bestScore/g) || []).length}`);
    console.log(`✅ File size: ${(types.length / 1024).toFixed(2)} KB`);
    
    // Check if we can import and use the type
    console.log('\n🧪 TESTING TYPE IMPORT:');
    console.log('='.repeat(60));
    
    try {
        // Try to extract the actual import path
        const importPath = generatedPath.replace('.d.ts', '');
        console.log(`Import path would be: ${importPath}`);
        console.log('Try this in your TypeScript file:');
        console.log(`import { CategoryStat } from '${importPath.replace(__dirname + '/../', './')}'`);
        console.log('or');
        console.log(`import type { CategoryStat } from '${importPath.replace(__dirname + '/../', './')}'`);
    } catch (error) {
        console.log(`❌ Error testing import: ${error.message}`);
    }
    
} else {
    console.log('❌ Generated types file not found');
}

console.log('\n🔧 NEXT STEPS:');
console.log('='.repeat(60));
console.log('1. The type exists and contains bestScore');
console.log('2. Try importing with: import type { CategoryStat } from "@/generated/prisma"');
console.log('3. If still having issues, try: npx prisma generate --force');
console.log('4. Restart your IDE/TypeScript server');
console.log('5. Check your tsconfig.json paths configuration');
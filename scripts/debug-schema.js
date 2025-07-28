// scripts/debug-schema.js
const { MongoClient } = require('mongodb')

const DATABASE_URL = "mongodb+srv://admin:Menuka19941223@cluster0.0t0fzpd.mongodb.net/Intellecto?retryWrites=true&w=majority&appName=Cluster0"

async function debugSchema() {
  const client = new MongoClient(DATABASE_URL)
  
  try {
    console.log('🔌 Connecting to MongoDB...')
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    
    // Check CategoryStat collection structure
    console.log('\n🔍 Checking CategoryStat collection...')
    
    // Get a sample document to see the structure
    const sampleDoc = await db.collection('CategoryStat').findOne()
    
    if (sampleDoc) {
      console.log('📋 Sample CategoryStat document structure:')
      console.log(JSON.stringify(sampleDoc, null, 2))
      
      // Check if bestScore field exists
      if ('bestScore' in sampleDoc) {
        console.log('✅ bestScore field exists in the document')
      } else {
        console.log('❌ bestScore field is missing from the document')
        console.log('🔧 Adding bestScore field to all documents...')
        
        const result = await db.collection('CategoryStat').updateMany(
          { bestScore: { $exists: false } },
          { $set: { bestScore: null } }
        )
        
        console.log(`✅ Added bestScore field to ${result.modifiedCount} documents`)
      }
    } else {
      console.log('❌ No CategoryStat documents found')
    }
    
    // Check collection indexes
    console.log('\n📊 Collection indexes:')
    const indexes = await db.collection('CategoryStat').indexes()
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

debugSchema()
// scripts/enhanced-fix.js
const { MongoClient } = require('mongodb')

const DATABASE_URL = "mongodb+srv://admin:Menuka19941223@cluster0.0t0fzpd.mongodb.net/Intellecto?retryWrites=true&w=majority&appName=Cluster0"

async function fixDatabase() {
  const client = new MongoClient(DATABASE_URL)
  
  try {
    console.log('🔌 Connecting to MongoDB...')
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const now = new Date()
    
    // Collections to fix with their required timestamp fields
    const collections = [
      {
        name: 'Category',
        fields: ['createdAt', 'updatedAt']
      },
      {
        name: 'User', 
        fields: ['createdAt', 'updatedAt']
      },
      {
        name: 'Quiz',
        fields: ['createdAt', 'updatedAt']
      },
      {
        name: 'Question',
        fields: ['createdAt', 'updatedAt']
      },
      {
        name: 'Option',
        fields: ['createdAt']
      },
      {
        name: 'CategoryStat',
        fields: ['createdAt', 'updatedAt']
      },
      {
        name: 'QuizAttempt',
        fields: ['createdAt', 'updatedAt', 'startedAt']
      },
      {
        name: 'Achievement',
        fields: ['createdAt']
      },
      {
        name: 'UserAchievement',
        fields: ['unlockedAt']
      }
    ]
    
    let totalUpdated = 0
    
    for (const collection of collections) {
      console.log(`\n🔧 Fixing ${collection.name}...`)
      
      try {
        // First, check how many documents need fixing
        const orConditions = []
        
        for (const field of collection.fields) {
          orConditions.push(
            { [field]: { $exists: false } },
            { [field]: null }
          )
        }
        
        const documentsToFix = await db.collection(collection.name).countDocuments({
          $or: orConditions
        })
        
        if (documentsToFix === 0) {
          console.log(`   ✅ ${collection.name}: No documents need fixing`)
          continue
        }
        
        console.log(`   📊 ${collection.name}: ${documentsToFix} documents need fixing`)
        
        // Prepare update object
        const updateFields = {}
        for (const field of collection.fields) {
          updateFields[field] = now
        }
        
        // Update documents
        const result = await db.collection(collection.name).updateMany(
          { $or: orConditions },
          { $set: updateFields }
        )
        
        console.log(`   ✅ ${collection.name}: Updated ${result.modifiedCount} documents`)
        totalUpdated += result.modifiedCount
        
      } catch (collectionError) {
        console.error(`   ❌ Error fixing ${collection.name}:`, collectionError.message)
      }
    }
    
    console.log(`\n🎉 Fix completed successfully!`)
    console.log(`📊 Total documents updated: ${totalUpdated}`)
    console.log('\n🔄 Next steps:')
    console.log('   1. Run: npx prisma generate')
    console.log('   2. Test your application')
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

// Add some additional helper functions
async function checkDataIntegrity() {
  const client = new MongoClient(DATABASE_URL)
  
  try {
    await client.connect()
    const db = client.db()
    
    console.log('\n🔍 Checking data integrity...')
    
    // Check CategoryStat specifically (the problematic collection)
    const categoryStats = await db.collection('CategoryStat').find({
      $or: [
        { createdAt: null },
        { createdAt: { $exists: false } },
        { updatedAt: null },
        { updatedAt: { $exists: false } }
      ]
    }).toArray()
    
    if (categoryStats.length > 0) {
      console.log(`❌ Found ${categoryStats.length} CategoryStat documents with missing timestamps`)
      console.log('Sample problematic document:', categoryStats[0])
    } else {
      console.log('✅ All CategoryStat documents have proper timestamps')
    }
    
  } catch (error) {
    console.error('❌ Integrity check failed:', error.message)
  } finally {
    await client.close()
  }
}

// Run the main fix
console.log('🚀 Starting MongoDB timestamp fix...')
fixDatabase()
  .then(() => {
    console.log('\n🔍 Running integrity check...')
    return checkDataIntegrity()
  })
  .then(() => {
    console.log('\n✨ All done! Your database should now work properly with Prisma.')
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
// Script pour supprimer les doublons d'emails et créer la contrainte
const { driver } = require('./db');

async function cleanDuplicatesAndSetupConstraints() {
    const session = driver.session();
    
    try {
        console.log('🔍 Recherche des emails en double...');
        
        // Trouver les emails en double
        const duplicatesResult = await session.run(`
            MATCH (u:User)
            WITH u.email AS email, COLLECT(u) AS users, COUNT(u) AS count
            WHERE count > 1
            RETURN email, users, count
            ORDER BY count DESC
        `);
        
        if (duplicatesResult.records.length === 0) {
            console.log('✅ Aucun doublon trouvé !');
        } else {
            console.log(`⚠️  ${duplicatesResult.records.length} emails en double trouvés :`);
            
            for (const record of duplicatesResult.records) {
                const email = record.get('email');
                const users = record.get('users');
                const count = record.get('count');
                
                console.log(`\n📧 Email: ${email} (${count} comptes)`);
                
                // Garder seulement le premier utilisateur, supprimer les autres
                for (let i = 1; i < users.length; i++) {
                    const userId = users[i].properties.id;
                    console.log(`   🗑️  Suppression du doublon ID: ${userId}`);
                    
                    await session.run(`
                        MATCH (u:User {id: $userId})
                        DETACH DELETE u
                    `, { userId });
                }
            }
            
            console.log('\n✅ Tous les doublons ont été supprimés !');
        }
        
        console.log('\n🔧 Création de la contrainte d\'unicité...');
        
        // Créer la contrainte d'unicité
        await session.run(`
            CREATE CONSTRAINT user_email_unique IF NOT EXISTS
            FOR (u:User) REQUIRE u.email IS UNIQUE
        `);
        
        console.log('✅ Contrainte d\'unicité créée avec succès !');
        console.log('🎉 Configuration terminée ! Les emails sont maintenant uniques.');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await session.close();
        await driver.close();
    }
}

cleanDuplicatesAndSetupConstraints();

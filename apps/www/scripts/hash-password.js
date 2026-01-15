const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
	console.error('Usage: node scripts/hash-password.js <password>')
	process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)

console.log('\nPassword hash:')
console.log(hash)
console.log('\nSQL to update your account:')
console.log(`UPDATE account SET password_hash = '${hash}' WHERE email = 'your@email.com';`)

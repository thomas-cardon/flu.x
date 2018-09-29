module.exports = {
  "port": 8920,
  "password": "[REDACTED]",
  "env": process.argv.includes('dev') ? 'development' : 'production'
}

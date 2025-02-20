require('dotenv').config();
const packageJson = require('./package.json');

module.exports = {
    apps: [
        {
            name: packageJson.name,
            script: 'source/app.js',
            env: {
                HOST: process.env.IPBIND || '127.0.0.1',
                PORT: parseInt(process.env.PORT, 10) || 4000,
                BODY_SIZE_LIMIT: process.env.SIZE_LIMIT || '10M',
            },
        },
    ]
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataSource = exports.getDataSourceInstance = exports.dataSourceInstance = void 0;
exports.initializeDatabase = initializeDatabase;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const users_1 = require("../users");
const artists_1 = require("../artists");
const getDataSourceInstance = () => {
    return exports.dataSourceInstance;
};
exports.getDataSourceInstance = getDataSourceInstance;
const createDataSource = () => {
    return new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        schema: process.env.POSTGRES_SCHEMA || 'public',
        entities: [users_1.User, artists_1.Artist],
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
        migrations: [__dirname + '/migrations/*.ts'] // Verify this path
    });
};
exports.createDataSource = createDataSource;
async function initializeDatabase(maxRetries = 5, retryDelay = 3000, maxWaitTime = 60000 // Example: 1 minute max wait time
) {
    if (!exports.dataSourceInstance || !exports.dataSourceInstance.isInitialized) {
        let attempts = 0;
        const startTime = Date.now();
        while (attempts < maxRetries && Date.now() - startTime < maxWaitTime) {
            attempts++;
            try {
                exports.dataSourceInstance = (0, exports.createDataSource)();
                await exports.dataSourceInstance.initialize();
                console.log('Database connection initialized');
                return; // Exit the function on successful connection
            }
            catch (error) {
                console.error(`Failed to initialize database (attempt ${attempts}/${maxRetries}) using config: ${JSON.stringify({
                    host: process.env.POSTGRES_HOST,
                    port: process.env.POSTGRES_PORT,
                    username: process.env.POSTGRES_USER,
                    database: process.env.POSTGRES_DATABASE,
                    schema: process.env.POSTGRES_SCHEMA
                })}:`, error);
                if (attempts < maxRetries && Date.now() - startTime < maxWaitTime) {
                    console.log(`Retrying in ${retryDelay}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                }
                else {
                    throw error; // Re-throw the error after the final attempt
                }
            }
        }
        throw new Error('Max retries or wait time reached. Unable to connect to the database.');
    }
}
// Graceful shutdown in production
if (process.env.NODE_ENV === 'production') {
    process.on('SIGINT', async () => {
        if (exports.dataSourceInstance?.isInitialized) {
            await exports.dataSourceInstance.destroy();
            console.log('Database connection closed.');
            process.exit(0);
        }
        else {
            process.exit(0);
        }
    });
}

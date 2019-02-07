import * as fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as path from 'path';

const globalConfigPath = path.join(__dirname, 'globalConfig.json');

const mongod = new MongoMemoryServer({
  autoStart: false,
});

module.exports = async (): Promise<void> => {
  if (!mongod.runningInstance) {
    await mongod.start();
  }

  const mongoConfig = {
    mongoDBName: 'jest',
    mongoUri: await mongod.getConnectionString(),
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

  // Set reference to mongod in order to close the server during teardown.
  (global as any).__MONGOD__ = mongod;
};

const fs = require('fs');
const path = require('path');
const ini = require('ini');
const chalk = require('chalk');
const pkg = require('../package.json');

if (pkg && pkg.sonar) {
  const configFilePath = path.join(process.cwd(), 'sonar-project.properties');

  const config = {
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.projectKey': pkg.sonar.projectKey || '',
    'sonar.projectName': pkg.name,
    'sonar.sources': pkg.sonar.sources || '',
    'sonar.projectVersion': pkg.version
  };

  fs.writeFileSync(configFilePath, ini.stringify(config))
  console.log(chalk.green('sonar config added'));
}

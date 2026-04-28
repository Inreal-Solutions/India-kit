
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import semver from 'semver';
import { validatePAN, validateAadhaar, mockPAN, mockAadhaar } from '@india-kit/core';
import { validateIFSC } from '@india-kit/core';

const program = new Command();

program
  .name('india-kit')
  .description('india-kit — The Definitive Indian Dev Toolkit CLI')
  .version('0.1.0');

function outputResult(ok: boolean, msg: string) {
  if (ok) console.log(chalk.green('✔'), msg);
  else console.log(chalk.red('✖'), msg);
}

program
  .command('validate')
  .description('Validate an identifier (pan|aadhaar|ifsc)')
  .argument('<type>', 'pan|aadhaar|ifsc')
  .argument('<value>', 'value to validate')
  .action(async (type: string, value: string) => {
    try {
      const spinner = ora({ text: `Validating ${type}...` }).start();
      await new Promise((r) => setTimeout(r, 120));
      spinner.stop();
      if (type === 'pan') {
        const r = validatePAN(value);
        outputResult(r.valid, r.valid ? `PAN ${value} is valid` : `PAN invalid: ${r.reason}`);
        process.exit(r.valid ? 0 : 2);
      }
      if (type === 'aadhaar') {
        const r = validateAadhaar(value);
        outputResult(r.valid, r.valid ? `Aadhaar ${value} is valid` : `Aadhaar invalid: ${r.reason}`);
        process.exit(r.valid ? 0 : 2);
      }
      if (type === 'ifsc') {
        const r = validateIFSC(value);
        outputResult(r.valid, r.valid ? `IFSC ${value} is valid` : `IFSC invalid: ${r.reason}`);
        process.exit(r.valid ? 0 : 2);
      }
      console.error(chalk.yellow('Unsupported type. Use pan, aadhaar or ifsc'));
      process.exit(3);
    } catch (err: any) {
      console.error(chalk.red('Error:'), err?.message || err);
      process.exit(1);
    }
  });

program
  .command('mock')
  .description('Generate mock identifiers (pan|aadhaar)')
  .argument('<type>', 'pan|aadhaar')
  .action(async (type: string) => {
    try {
      const spinner = ora({ text: 'Generating mock data...' }).start();
      await new Promise((r) => setTimeout(r, 150));
      spinner.succeed('Generated');
      if (type === 'pan') console.log(chalk.cyan(mockPAN()));
      else if (type === 'aadhaar') console.log(chalk.cyan(mockAadhaar()));
      else {
        console.error(chalk.yellow('Unsupported type. Use pan or aadhaar'));
        process.exit(3);
      }
    } catch (err: any) {
      console.error(chalk.red('Error:'), err?.message || err);
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('Run environment checks and basic diagnostics')
  .action(async () => {
    const spinner = ora('Running doctor checks').start();
    try {
      // Node version
      const nodeVer = process.version;
      const okNode = semver.satisfies(semver.coerce(nodeVer) || '0.0.0', '>=18');
      spinner.text = 'Checking Node.js version';
      await new Promise((r) => setTimeout(r, 80));

      spinner.stop();
      console.log(chalk.bold('Environment diagnostics'));
      outputResult(okNode, `Node.js ${nodeVer} ${okNode ? '' : '(>=18 recommended)'}`);

      // Basic self-tests
      console.log(chalk.bold('\nSelf-checks'));
      const panOk = validatePAN('ABCDE1234F').valid;
      outputResult(panOk, 'PAN validation (sample)');
      const aadOk = validateAadhaar(mockAadhaar()).valid;
      outputResult(aadOk, 'Aadhaar mock -> validate');

      console.log(chalk.gray('\nAll checks completed.')); 
      process.exit(0);
    } catch (err: any) {
      spinner.fail('Doctor failed');
      console.error(chalk.red('Error during doctor:'), err?.message || err);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Interactive mode')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Choose an action',
          choices: [
            { name: 'Validate identifier', value: 'validate' },
            { name: 'Generate mock identifier', value: 'mock' },
            { name: 'Run doctor', value: 'doctor' },
            { name: 'Exit', value: 'exit' }
          ]
        }
      ] as any);

      if (answers.action === 'validate') {
        const { type, value } = await inquirer.prompt([
          { type: 'list', name: 'type', message: 'Type', choices: ['pan', 'aadhaar', 'ifsc'] },
          { type: 'input', name: 'value', message: 'Value' }
        ] as any);
        await program.parseAsync(['node','india-kit','validate', type, value]);
      } else if (answers.action === 'mock') {
        const { type } = await inquirer.prompt([{ type: 'list', name: 'type', message: 'Type', choices: ['pan', 'aadhaar'] }] as any);
        await program.parseAsync(['node','india-kit','mock', type]);
      } else if (answers.action === 'doctor') {
        await program.parseAsync(['node','india-kit','doctor']);
      } else {
        console.log('bye');
      }
    } catch (err: any) {
      console.error(chalk.red('Interactive error:'), err?.message || err);
      process.exit(1);
    }
  });

program.parseAsync();

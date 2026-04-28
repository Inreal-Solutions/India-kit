#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const semver_1 = __importDefault(require("semver"));
const core_1 = require("@india-kit/core");
const core_2 = require("@india-kit/core");
const program = new commander_1.Command();
program
    .name('india-kit')
    .description('india-kit — The Definitive Indian Dev Toolkit CLI')
    .version('0.1.0');
function outputResult(ok, msg) {
    if (ok)
        console.log(chalk_1.default.green('✔'), msg);
    else
        console.log(chalk_1.default.red('✖'), msg);
}
program
    .command('validate')
    .description('Validate an identifier (pan|aadhaar|ifsc)')
    .argument('<type>', 'pan|aadhaar|ifsc')
    .argument('<value>', 'value to validate')
    .action(async (type, value) => {
    try {
        const spinner = (0, ora_1.default)({ text: `Validating ${type}...` }).start();
        await new Promise((r) => setTimeout(r, 120));
        spinner.stop();
        if (type === 'pan') {
            const r = (0, core_1.validatePAN)(value);
            outputResult(r.valid, r.valid ? `PAN ${value} is valid` : `PAN invalid: ${r.reason}`);
            process.exit(r.valid ? 0 : 2);
        }
        if (type === 'aadhaar') {
            const r = (0, core_1.validateAadhaar)(value);
            outputResult(r.valid, r.valid ? `Aadhaar ${value} is valid` : `Aadhaar invalid: ${r.reason}`);
            process.exit(r.valid ? 0 : 2);
        }
        if (type === 'ifsc') {
            const r = (0, core_2.validateIFSC)(value);
            outputResult(r.valid, r.valid ? `IFSC ${value} is valid` : `IFSC invalid: ${r.reason}`);
            process.exit(r.valid ? 0 : 2);
        }
        console.error(chalk_1.default.yellow('Unsupported type. Use pan, aadhaar or ifsc'));
        process.exit(3);
    }
    catch (err) {
        console.error(chalk_1.default.red('Error:'), err?.message || err);
        process.exit(1);
    }
});
program
    .command('mock')
    .description('Generate mock identifiers (pan|aadhaar)')
    .argument('<type>', 'pan|aadhaar')
    .action(async (type) => {
    try {
        const spinner = (0, ora_1.default)({ text: 'Generating mock data...' }).start();
        await new Promise((r) => setTimeout(r, 150));
        spinner.succeed('Generated');
        if (type === 'pan')
            console.log(chalk_1.default.cyan((0, core_1.mockPAN)()));
        else if (type === 'aadhaar')
            console.log(chalk_1.default.cyan((0, core_1.mockAadhaar)()));
        else {
            console.error(chalk_1.default.yellow('Unsupported type. Use pan or aadhaar'));
            process.exit(3);
        }
    }
    catch (err) {
        console.error(chalk_1.default.red('Error:'), err?.message || err);
        process.exit(1);
    }
});
program
    .command('doctor')
    .description('Run environment checks and basic diagnostics')
    .action(async () => {
    const spinner = (0, ora_1.default)('Running doctor checks').start();
    try {
        // Node version
        const nodeVer = process.version;
        const okNode = semver_1.default.satisfies(semver_1.default.coerce(nodeVer) || '0.0.0', '>=18');
        spinner.text = 'Checking Node.js version';
        await new Promise((r) => setTimeout(r, 80));
        spinner.stop();
        console.log(chalk_1.default.bold('Environment diagnostics'));
        outputResult(okNode, `Node.js ${nodeVer} ${okNode ? '' : '(>=18 recommended)'}`);
        // Basic self-tests
        console.log(chalk_1.default.bold('\nSelf-checks'));
        const panOk = (0, core_1.validatePAN)('ABCDE1234F').valid;
        outputResult(panOk, 'PAN validation (sample)');
        const aadOk = (0, core_1.validateAadhaar)((0, core_1.mockAadhaar)()).valid;
        outputResult(aadOk, 'Aadhaar mock -> validate');
        console.log(chalk_1.default.gray('\nAll checks completed.'));
        process.exit(0);
    }
    catch (err) {
        spinner.fail('Doctor failed');
        console.error(chalk_1.default.red('Error during doctor:'), err?.message || err);
        process.exit(1);
    }
});
program
    .command('interactive')
    .description('Interactive mode')
    .action(async () => {
    try {
        const answers = await inquirer_1.default.prompt([
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
        ]);
        if (answers.action === 'validate') {
            const { type, value } = await inquirer_1.default.prompt([
                { type: 'list', name: 'type', message: 'Type', choices: ['pan', 'aadhaar', 'ifsc'] },
                { type: 'input', name: 'value', message: 'Value' }
            ]);
            await program.parseAsync(['node', 'india-kit', 'validate', type, value]);
        }
        else if (answers.action === 'mock') {
            const { type } = await inquirer_1.default.prompt([{ type: 'list', name: 'type', message: 'Type', choices: ['pan', 'aadhaar'] }]);
            await program.parseAsync(['node', 'india-kit', 'mock', type]);
        }
        else if (answers.action === 'doctor') {
            await program.parseAsync(['node', 'india-kit', 'doctor']);
        }
        else {
            console.log('bye');
        }
    }
    catch (err) {
        console.error(chalk_1.default.red('Interactive error:'), err?.message || err);
        process.exit(1);
    }
});
program.parseAsync();

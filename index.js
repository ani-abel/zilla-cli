#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import clipboard from 'clipboardy';

let passwordLength, createdPassword;

const generatePassword = (passwordLength) => {
    const numberChars = "0123456789";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const allChars = numberChars + upperChars + lowerChars;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
};
  
const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
};

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

// Print out intro text
async function printOutIntroText() {
    console.clear();
    const message = 'ZILLA WORLD';
    figlet(message, (error, data) => {
        console.log(gradient.pastel.multiline(data));
    });
    await sleep();
}
await printOutIntroText();

// collect password length
async function askForPasswordLength() {
    const answer = await inquirer.prompt({
        name: 'password_length',
        type: 'input',
        message: 'How long should your password be?',
        default: () => {
            return 10;
        },
    });
    passwordLength = parseInt(answer.password_length);
}
await askForPasswordLength();

async function callLoader() {
    const spinner = createSpinner('Generating password...').start();
    await sleep();
    spinner.success({ text: `Password generated` });
}
await callLoader();

// Create password based on the length provided
async function generateUserPassword() {
    createdPassword = generatePassword(passwordLength);
    if (createdPassword) {
        const rainbowTitle = chalkAnimation.rainbow(`Your Password '${createdPassword}' has been copied to clipboard`);
        await sleep();
        rainbowTitle.stop();
    }
}
await generateUserPassword();

// Copy the password to clipboard
async function copyPasswordToClipboard() {
    if (createdPassword) {
        clipboard.writeSync(createdPassword);
        clipboard.readSync();
    }
}
await copyPasswordToClipboard();

// Deploy app to npm
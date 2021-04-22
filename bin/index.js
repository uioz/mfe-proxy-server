#!/usr/bin/env node
'use strict';
// assuming we are under the node_modules folder
const { resolve, join } = require('path');
const { readFile, writeFile } = require('fs').promises;

const CWD = process.cwd();
// /node_modules -> <project root>
const projectPath = resolve(CWD, '../../');

const TEMPLATE_NAME = 'template.js';
const TARGET_NAME = 'mfe-server.js';
const PACKAGE_NAME = require('../package.json').name;

async function run() {
  const template = await readFile(join(CWD, 'bin', TEMPLATE_NAME));

  try {
    await writeFile(join(projectPath, TARGET_NAME), template, {
      flag: 'wx',
    });
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(
        `because you already have a ${TARGET_NAME} in your project dir,so ${PACKAGE_NAME} won't eject anymore`
      );
      console.log(
        `The latest template of ${TARGET_NAME} at ${__dirname}, if you have trouble with ${TARGET_NAME}`
      );
    } else {
      throw error;
    }
  }
}

run();

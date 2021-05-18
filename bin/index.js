#!/usr/bin/env node
'use strict';
// assuming we are under the node_modules folder
const { resolve, join } = require('path');
const { writeFile } = require('fs').promises;
const { generateTemplate } = require('./template');

const CWD = process.cwd();
// /node_modules -> <project root>
const projectPath = resolve(CWD, '../../');

const TARGET_NAME = 'mfe-server.js';
const PACKAGE_NAME = require('../package.json').name;

async function run() {
  const template = generateTemplate({
    host: process.env.MFE_SERVER_HOST,
    port: process.env.MFE_SERVER_PORT,
    mode: process.env.MFE_SERVER_MODE,
  });

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

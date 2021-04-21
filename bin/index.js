#!/usr/bin/env node
'use strict';
// assuming we are under the node_modules folder
const {resolve, join} = require('path');
const {readFile, writeFile} = require('fs').promises;

const CWD = process.cwd();
// /node_modules -> <project root>
const projectPath = resolve(CWD, '../../');

const TEMPLATE_NAME = 'template.js';
const TARGET_NAME = 'mfe-server.js';

async function run() {
  const template = await readFile(join(CWD, 'bin', TEMPLATE_NAME));

  await writeFile(join(projectPath, TARGET_NAME), template);
}

run();

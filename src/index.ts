#! /usr/bin/env node

import figlet from "figlet";
import { Command } from "commander";

console.log(figlet.textSync("RSA Passphrase", { font: "Small" }));

const program = new Command()
  .version("1.0.0")
  .description("Testing tool for RSA Passphrase Utilization")
  .option(
    "-g, --generate <passphrase>",
    "Generate new RSA Private Key with an optional passphrase"
  )
  .parse(process.argv);

const options = program.opts();

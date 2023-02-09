#! /usr/bin/env node

import figlet from "figlet";
import { Command } from "commander";
import { PrintService } from "./services/print";

const APP_NAME = "RSA Passphrase";
const APP_VERSION = "1.0.0";
const APP_DESCRIPTION = "Testing tool for RSA Passphrase Utilization";

console.log(figlet.textSync(APP_NAME, { font: "Small" }));

const program = new Command()
  .name(APP_NAME)
  .version(APP_VERSION)
  .description(APP_DESCRIPTION);

program
  .command("message")
  .option("-m, --message [message]", "Print a message", "Hello World!")
  .action((options) => {
    if (options.message) PrintService.printToConsole(options.message);
  });

program.parse();

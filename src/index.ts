#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import * as fs from "fs";
import { sign, verify } from "jsonwebtoken";
import { join } from "path";
import { CryptoService } from "./services/crypto";
import { KeygenService } from "./services/keygen";
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

program
  .command("generate-private")
  .description("Generate RSA private key")
  .option("-b, --bitSize [size]", "Bit size of the key", "2048")
  .action((options) => {
    let bitSize = parseInt(options.bitSize) || 2048;
    KeygenService.generatePrivateKey(bitSize);
  });

program
  .command("generate-public")
  .description("Generate RSA public key")
  .option("-p, --passphrase [passphrase]", "Use passphrase")
  .action((options) => {
    let passphrase = options.passphrase;
    KeygenService.generatePublicKey(passphrase);
  });

program
  .command("create-cipher")
  .description("Create cipher")
  .option("-m, --message [message]", "Text to encrypt")
  .action((options) => {
    CryptoService.createCipher(options.message);
  });

program
  .command("verify")
  .option("-p, --pass [passphrase]", "Use passphrase")
  .action((options) => {
    CryptoService.verifyCipher(options.passphrase);
  });

program.parse();

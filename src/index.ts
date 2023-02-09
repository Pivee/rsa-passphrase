#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import * as fs from "fs";
import { sign, verify } from "jsonwebtoken";
import { join } from "path";
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
  .command("verify-signature")
  .option("-p, --pass [passphrase]", "Use passphrase")
  .action((options) => {
    const privateKey = fs.readFileSync(join(__dirname, "../certs/private.pem"));
    const publicKey = fs.readFileSync(join(__dirname, "../certs/private.pem"));

    let message = "";
    let cipher = "";
    try {
      message = fs.readFileSync(join(".temp/message.txt")).toString("utf8");

      console.log("📄 Plain Text:", message);

      cipher = sign(message, publicKey, {
        algorithm: "RS256",
      });

      console.log("🔒 Encrypted:", cipher);

      fs.writeFileSync(join(".temp/message-cipher.txt"), cipher);
    } catch (error) {
      console.error(error);
    }

    if (options.pass) {
      console.log(
        "✅ Verified:",
        verify(cipher, {
          key: privateKey,
          passphrase: options.pass,
        })
      );
    } else {
      console.log("⚠️ Verifying without passphrase");
      console.log(
        "✅ Verified:",
        verify(cipher, {
          key: privateKey,
          passphrase: "",
        })
      );
    }
  });

program.parse();

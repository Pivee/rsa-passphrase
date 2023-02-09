#! /usr/bin/env node

import figlet from "figlet";
import { Command } from "commander";
import { PrintService } from "./services/print";
import * as fs from "fs";
import { join } from "path";
import { sign, verify } from "jsonwebtoken";
import { exec } from "child_process";

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
    let generatePrivateKeyCommand = "openssl genrsa -out ./certs/private.pem";

    if (bitSize && bitSize % 2 == 0) {
      generatePrivateKeyCommand = generatePrivateKeyCommand + ` ${bitSize}`;
    }

    console.info(`⏳ Generating private key of size ${bitSize} bits`);
    exec(generatePrivateKeyCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      console.info(`⌛ ${stdout || stderr}`);
      console.log("✅ Done!");
    });
  });

program
  .command("generate-public")
  .description("Generate RSA public key")
  .option("-p, --passphrase [passphrase]", "Use passphrase")
  .action((options) => {
    let passphrase = options.passphrase;
    let generatePublicKeyCommand =
      "openssl rsa -in ./certs/private.pem -pubout -out ./certs/public.pem";

    if (passphrase)
      generatePublicKeyCommand =
        generatePublicKeyCommand + ` -passout pass:${passphrase}`;

    console.info(
      `⏳ Generating public key${
        !passphrase ? "" : ` with "${passphrase}" as the passphrase`
      }`
    );
    exec(generatePublicKeyCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      console.info(`⌛ ${stdout || stderr}`);
      console.log("✅ Done!");
    });
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

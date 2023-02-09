import { exec } from "child_process";
import * as fs from "fs";

export class KeygenService {
  static makeCertsDirectory() {
    try {
      fs.mkdirSync("./certs");
    } catch (error) {
      if ((error as any)?.code !== "EEXIST") {
        console.error(error);
        throw error;
      }
    }
  }

  static generatePrivateKey(bitSize: number) {
    this.makeCertsDirectory();

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
  }

  static generatePublicKey(passphrase: string) {
    this.makeCertsDirectory();

    let generatePublicKeyCommand =
      "openssl rsa -in ./certs/private.pem -pubout -out ./certs/public.pem";

    if (passphrase) {
      generatePublicKeyCommand =
        generatePublicKeyCommand + ` -passout pass:${passphrase}`;

      fs.writeFileSync("./certs/passphrase.txt", passphrase);
    }

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
  }
}

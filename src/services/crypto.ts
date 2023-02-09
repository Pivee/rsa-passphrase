import * as fs from "fs";
import { sign, verify } from "jsonwebtoken";
import { join } from "path";

export class CryptoService {
  static makeTempDirectory() {
    try {
      fs.mkdirSync("./temp");
    } catch (error) {
      if ((error as any)?.code !== "EEXIST") {
        console.error(error);
        throw error;
      }
    }
  }

  static createCipher(message: string, passphrase = "") {
    const privateKey = this.getPrivateKey();

    try {
      console.log("📄 Plain Text:", message);

      const cipher = sign(
        message,
        { key: privateKey, passphrase: passphrase },
        {
          algorithm: "RS256",
        }
      );

      console.log("🔒 Encrypted:", cipher);

      this.makeTempDirectory();

      fs.writeFileSync(join(".temp/message.txt"), message);
      fs.writeFileSync(join(".temp/message-cipher.txt"), cipher);
      fs.writeFileSync(join(".temp/message-cipher-passphrase.txt"), passphrase);
    } catch (error) {
      console.error(error);
    }
  }

  static verifyCipher(passphrase?: string) {
    const publicKey = this.getPublicKey();

    const cipher = this.getCipherText();

    try {
      if (passphrase) {
        console.log(
          "✅ Verified:",
          verify(cipher, {
            key: publicKey,
            passphrase: passphrase || "",
          })
        );
      } else {
        console.log("⚠️ Verifying without passphrase");
        console.log("✅ Verified:", verify(cipher, publicKey));
      }
    } catch (error) {
      console.error(error);
    }
  }

  static getPrivateKey() {
    return fs.readFileSync(join("./certs/private.pem")).toString("utf8");
  }

  static getPublicKey() {
    return fs.readFileSync(join("./certs/public.pem"));
  }

  static getCipherText() {
    return fs.readFileSync(join(".temp/message-cipher.txt")).toString("utf8");
  }
}

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

  static createCipher(message: string) {
    const privateKey = fs
      .readFileSync(join("./certs/private.pem"))
      .toString("utf8");

    let cipher = "";
    try {
      console.log("📄 Plain Text:", message);

      cipher = sign(message, privateKey, {
        algorithm: "RS256",
      });

      console.log("🔒 Encrypted:", cipher);

      this.makeTempDirectory();

      fs.writeFileSync(join(".temp/message.txt"), message);
      fs.writeFileSync(join(".temp/message-cipher.txt"), cipher);
    } catch (error) {
      console.error(error);
    }
  }

  static verifyCipher(passphrase?: string) {
    const privateKey = fs.readFileSync(join("./certs/private.pem"));

    const cipher = fs
      .readFileSync(join(".temp/message-cipher.txt"))
      .toString("utf8");

    try {
      if (passphrase) {
        console.log(
          "✅ Verified:",
          verify(cipher, {
            key: privateKey,
            passphrase: passphrase || "",
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
    } catch (error) {
      console.error(error);
    }
  }
}

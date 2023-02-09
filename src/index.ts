import figlet from "figlet";
import { Command } from "commander";

const program = new Command()
  .version("1.0.0")
  .description("Testing tool for RSA Passphrase Utilization")
  .option("-g, --generate", "Generate new RSA Private Key")
  .parse(process.argv);

console.log(figlet.textSync("RSA Passphrase", { font: "Small" }));

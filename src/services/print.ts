export class PrintService {
  static printToConsole(message: string) {
    if (!message || typeof message === "string") {
      console.log(message);
    } else {
      console.error("Invalid message");
    }
  }
}

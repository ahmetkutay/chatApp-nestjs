import fs from "fs";
import path from "path";

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

class Logger {
  private static instance: Logger;
  private logFilePath: string;
  private currentDate: string;

  private constructor() {
    this.logFilePath = "";
    this.currentDate = "";
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  private createLogFile(): void {
    const currentDate = this.getCurrentDate();
    this.currentDate = currentDate;
    const logDirectory = path.join(__dirname, "logs");
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }
    this.logFilePath = path.join(logDirectory, `api-logs-${currentDate}.log`);
    fs.writeFileSync(this.logFilePath, "");
  }

  private checkCurrentDate(): void {
    const currentDate = this.getCurrentDate();
    if (currentDate !== this.currentDate) {
      this.createLogFile();
    }
  }

  public info(message: string): void {
    this.checkCurrentDate();
    this.log(LogLevel.INFO, message);
  }

  public error(message: string): void {
    this.checkCurrentDate();
    this.log(LogLevel.ERROR, message);
  }

  public debug(message: string): void {
    this.checkCurrentDate();
    this.log(LogLevel.DEBUG, message);
  }

  public warn(message: string): void {
    this.checkCurrentDate();
    this.log(LogLevel.WARN, message);
  }

  private log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;
    fs.appendFileSync(this.logFilePath, logEntry);
    console.log(logEntry);
  }
}

export default Logger;
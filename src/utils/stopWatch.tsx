export default class StopWatch {
  constructor() {
    this.start();
  }

  private startTime: number;

  public start() {
    this.startTime = Date.now();
  }

  public watch() {
    return Date.now() - this.startTime;
  }
}

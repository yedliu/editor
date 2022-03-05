export default class LoopWork {
  timer: NodeJS.Timeout = null;
  loopDelay: number = 25;
  missions: Map<any, () => void>;
  isWork = false;

  private static instance: LoopWork = null;
  static get Instance() {
    if (LoopWork.instance == null) LoopWork.instance = new LoopWork();
    return LoopWork.instance;
  }

  public start() {
    this.isWork = true;
    this.timer = setTimeout(this.doloop.bind(this), this.loopDelay);
  }

  public pause() {
    this.isWork = false;
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public stop() {
    this.pause();
    this.missions.clear();
  }

  doloop() {
    if (this.missions) {
      this.missions.forEach((func, key) => {
        func();
      });
    }
    clearTimeout(this.timer);
    this.timer = null;
    if (this.isWork)
      this.timer = setTimeout(this.doloop.bind(this), this.loopDelay);
  }

  setMission(key: any, func: () => void) {
    if (key != null) {
      if (!this.missions) this.missions = new Map<any, () => void>();
      this.missions.set(key, func);
      if (this.timer == null && func != null) this.start();
    }
  }

  removeMission(key: any) {
    if (this.missions && key != null && this.missions.has(key)) {
      this.missions.delete(key);
      if (this.missions.size == 0) this.pause();
    }
  }
}

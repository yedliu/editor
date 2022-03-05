export class InvokeTriggerSetting {
  name: string;
  displayName: string;
  triggerType: Function;

  constructor(_name: string, _displayName: string, _triggerType: Function) {
    this.name = _name;
    this.displayName = _displayName;
    this.triggerType = _triggerType;
  }
}

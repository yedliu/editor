import EnvHelper from './envHelper';

export default class KeyHelper {
  static PressedKeys: string[] = [];

  static onPressKey(key: string) {
    if (!KeyHelper.PressedKeys.includes(key)) KeyHelper.PressedKeys.push(key);
  }

  static onReleaseKey(key: string) {
    if (KeyHelper.PressedKeys.includes(key))
      KeyHelper.PressedKeys.splice(KeyHelper.PressedKeys.indexOf(key), 1);
  }

  static isKeyPressed(key: string) {
    return KeyHelper.PressedKeys.includes(key);
  }

  static checkCtrlOrMetaKeyWhenMousemove(e: MouseEvent) {
    if (KeyHelper.isKeyPressed('Control') != e.ctrlKey) {
      if (!e.ctrlKey) KeyHelper.onReleaseKey('Control');
      else KeyHelper.onPressKey('Control');
    }
    if (KeyHelper.isKeyPressed('Meta') != e.metaKey) {
      if (!e.metaKey) KeyHelper.onReleaseKey('Meta');
      else KeyHelper.onPressKey('Meta');
    }
  }

  static checkCtrlOrMeta(event) {
    if (EnvHelper.getOsInfo().name == 'Mac') return event.metaKey;
    else return event.ctrlKey;
  }
  static get isCtrlOrMetaPressed() {
    if (EnvHelper.getOsInfo().name == 'Mac')
      return KeyHelper.isKeyPressed('Meta');
    else return KeyHelper.isKeyPressed('Control');
  }
}

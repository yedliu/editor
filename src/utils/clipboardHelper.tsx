import copy from 'copy-to-clipboard';

export default class ClipboardHelper {
  static clipboardPermission = true;

  static copyToClipboard(text: string) {
    copy(text);
    if (!ClipboardHelper.clipboardPermission) {
      localStorage.setItem('clipboard', text);
    }
  }

  static getClipboardText(callback: (v: string) => void) {
    if (ClipboardHelper.clipboardPermission && navigator.clipboard) {
      navigator.clipboard.readText().then(callback);
    } else {
      var data = localStorage.getItem('clipboard');
      if (data) callback(data);
    }
  }
}

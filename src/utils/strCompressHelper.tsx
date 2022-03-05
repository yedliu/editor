import pako from 'pako';

export default class StrCompressHelper {
  // 解压
  static unzip(b64Data) {
    let strData = atob(b64Data);
    const charData = strData.split('').map(function(x) {
      return x.charCodeAt(0);
    });
    const binData = new Uint8Array(charData);
    const data = new Uint16Array(pako.inflate(binData));
    //分段转化，放止报错
    strData = '';
    var chunk = 8 * 1024;
    var i;
    for (i = 0; i < data.length / chunk; i++) {
      strData += String.fromCharCode.apply(
        null,
        data.slice(i * chunk, (i + 1) * chunk),
      );
    }
    strData += String.fromCharCode.apply(null, data.slice(i * chunk));

    //strData = String.fromCharCode(...data);
    return decodeURIComponent(strData);
  }

  // 压缩
  static zip(str) {
    const binaryString = pako.gzip(encodeURIComponent(str), { to: 'string' });
    return btoa(binaryString);
  }

  static Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = '';
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(
            ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
          );
          break;
      }
    }
    return JSON.parse(out);
  }

  static unzipUTF8(b64Data) {
    var strData = atob(b64Data);
    var charData = strData.split('').map(function(x) {
      return x.charCodeAt(0);
    });
    var binData = new Uint8Array(charData);
    var data = pako.inflate(binData);
    return this.Utf8ArrayToStr(data);
  }
}

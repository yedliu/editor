import { from } from 'linq-to-typescript';
import { v4 as uuidv4 } from 'uuid';

export default class IdHelper {
  static NewId() {
    return (uuidv4() as string).replaceAll('-', '');
  }

  static ReplaceId(src: string, originId: string, targetId: string): string {
    if (src != null && src.includes(originId)) {
      var splited = from(src.split(','))
        .distinct()
        .toArray();
      if (splited.includes(originId)) {
        splited[splited.indexOf(originId)] = targetId;
        var result = from(splited)
          .where(x => x != null && x != '')
          .toArray()
          .join(',');
        return result;
      }
    }
    return src;
  }

  static ContainsId(src: string, originId: string): boolean {
    if (src != null && src != '' && src.includes(originId)) {
      var splited = from(src.split(','))
        .distinct()
        .toArray();
      if (splited.includes(originId)) return true;
    }
    return false;
  }

  static RemoveId(src: string, originId: string): string {
    if (src != null && src.includes(originId)) {
      var splited = from(src.split(','))
        .distinct()
        .toArray();
      if (splited.includes(originId)) {
        var result = splited
          .filter(x => x != originId && x != null && x != '')
          .join(',');
        return result;
      }
    }
    return src;
  }

  static ToIdList(src: string): string[] {
    var result: string[] = [];
    if (src != null && src != '') {
      var splited = from(src.split(',').filter(x => x != null && x != ''))
        .distinct()
        .toArray();
      return splited;
    }
    return result;
  }

  static ToIdStr(idList: string[]): string {
    if (idList != null)
      return idList.filter(x => x => x != null && x != '').join(',');
    return '';
  }

  static ReplaceIdByMap(src: string, map: Map<string, string>): string {
    if (src != null && src != '') {
      var result = src;
      for (var key of map.keys()) {
        result = IdHelper.ReplaceId(result, key, map.get(key));
      }
      return result;
    }
    return src;
  }
}

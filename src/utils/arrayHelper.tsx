export default class ArrayHelper {
  static intersect<T>(arr1: T[], arr2: T[]) {
    return arr1?.filter(x => arr2?.includes(x)) || [];
  }

  static except<T>(arr1: T[], arr2: T[]) {
    return arr1?.filter(x => !(arr2 || []).includes(x)) || [];
  }

  static distinct<T>(arr1: T[], compare: (a: T, b: T) => boolean = null) {
    var result = [];
    if (arr1) {
      for (var a of arr1) {
        if (compare ? !result.find(b => compare(a, b)) : !result.includes(a))
          result.push(a);
      }
    }
    return result;
  }

  static lastOrDefault<T>(arr1: T[], condi: (a: T) => boolean = null) {
    if (arr1 && arr1.length > 0) {
      if (condi) {
        for (var i = arr1.length - 1; i >= 0; i--) {
          if (condi(arr1[i])) return arr1[i];
        }
      } else {
        return arr1[arr1.length - 1];
      }
    }
    return null;
  }
}

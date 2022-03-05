import { classToClass, classToPlain, plainToClass } from '@/class-transformer';
import { ClassType } from '@/class-transformer/ClassTransformer';

export default class ObjHelper {
  constructor(parameters) {}

  static DeepClone<T>(obj: T, typeMaps?: any): T {
    if (!obj) return null;
    var _item = classToClass(obj, {
      strategy: 'excludeAll',
      groups: ['clone'],
      enableCircularCheck: true,
      typeMaps: typeMaps,
    });
    return _item;
  }

  static ConvertObj<T>(classType: ClassType<T>, obj: any, typeMaps?: any): T {
    if (obj) {
      try {
        var plain = classToPlain(obj, {
          //strategy: 'excludeAll',
          //groups: ['clone'],
          enableCircularCheck: true,
          typeMaps: typeMaps,
        });
        var result = plainToClass(classType, plain, {
          strategy: 'excludeAll',
          //groups: ['clone'],
          enableCircularCheck: true,
          typeMaps: typeMaps,
        });
        return result;
      } catch (ex) {
        console.error(ex);
      }
    }
    return null;
  }
}

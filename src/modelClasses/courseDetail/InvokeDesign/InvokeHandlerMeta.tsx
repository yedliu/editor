import { ClassType } from '@/class-transformer/ClassTransformer';
import MetaHelper from '@/utils/metaHelper';
import { ViewTemplate } from '../toolbox/CustomTypeDefine';
import InvokableBase from '../InvokableBase';

export enum InvokerType {
  Event,
  Invoke,
  Nono,
}

export class InvokeHandlerMetaStorage {
  private static _invokeHandlerMetas = new Map<
    Function,
    Map<string, InvokeHandlerMeta>
  >();

  static addInvHandlerMeta(meta: InvokeHandlerMeta) {
    if (
      meta == null ||
      meta.target == null ||
      meta.propertyName == null ||
      meta.propertyName == ''
    )
      return;
    if (meta.option) meta.option.PropertyName = meta.propertyName;
    if (!InvokeHandlerMetaStorage._invokeHandlerMetas.has(meta.target)) {
      InvokeHandlerMetaStorage._invokeHandlerMetas.set(
        meta.target,
        new Map<string, InvokeHandlerMeta>(),
      );
    }
    this._invokeHandlerMetas.get(meta.target).set(meta.propertyName, meta);
  }

  static findInvHandlerMetasByClassType(targetClass: Function) {
    return MetaHelper.getMetadata(
      InvokeHandlerMetaStorage._invokeHandlerMetas,
      targetClass,
    );
  }
}

export class InvokeHandlerMeta {
  target: Function;
  propertyName: string;
  option?: InvokeHandlerOption;
}

export class InvokeHandlerOption {
  Type: InvokerType;

  DisplayName: string;
  PropertyName?: string;

  /**
   * 是否允许多连
   */
  AllowMulti?: boolean = true;
  /**
   * 是否在本身可执行组件上显示
   */
  DisplayInOwner?: boolean = true;
  // BlackList?: ClassType<any>[]; // (new (...args: any[]) => any)[];
  // WhiteList?: ClassType<any>[];

  Checker?: (_constructor: ClassType<InvokableBase>) => boolean;

  /**
   * 排在第几个
   */
  OrderIndex?: number = 0;

  /**
   * 调用接口样式模板
   */
  Template?: ViewTemplate;
  /**
   * 列表式调用接口头模板
   */
  HeaderTemplate?: ViewTemplate;
  /**
   * 是否是列表式调用接口
   */
  IsList?: boolean = false;

  /**
   * 列表式增减排序更新
   */
  ListUpdated?: (list: any[]) => void = null;
  /**
   * 列表式调用接口是否可添加行
   */
  Addable?: boolean = true;
  /**
   * 列表式调用接口每一行的数据类型
   */
  ListItemType?: ClassType<any> = String;
  /**
   * 列表式调用接口每一行的调用Id对应的属性名称
   */
  ValuePropertyName?: string;
  /**
   * 调用接口的输出数据接口
   */
  OutputDataDisplayNames?: string[] = null;
  /**
   * 列表式调用接口头的数据接口
   */
  HeaderOutputDataDisplayNames?: string[] = null;
}

export function InvHandler(option: InvokeHandlerOption) {
  return function(target: any, key: string) {
    var _option = Object.assign(new InvokeHandlerOption(), option);
    InvokeHandlerMetaStorage.addInvHandlerMeta({
      target: target.constructor,
      propertyName: key,
      option: _option,
    });
  };
}

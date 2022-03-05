import { from } from 'linq-to-typescript';
import { Type } from '@/class-transformer';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import CWElement from '@/modelClasses/courseDetail/cwElement';
import RUHelper from '@/redoundo/redoUndoHelper';
import MetaHelper from '@/utils/metaHelper';

export class PropPanelEntity {
  public name: string;
  public type: number;
  constructor(_name: string, _type: number) {
    this.type = _type;
    this.name = _name;
  }
}

export class ElementGroup {
  _elements: any[];
  setValue = (
    name: any,
    value: any,
    propertyType: ClassType = ClassType.string,
  ) => {
    if (this._elements != null) {
      CacheEntityServer.setPropPanel(name, value, this._elements, propertyType);
    }
  };
}

export default class CacheEntityServer {
  private static elementDic: Map<Function, Array<PropPanelEntity>> = new Map<
    Function,
    Array<PropPanelEntity>
  >();

  private static unique(arr): Array<any> {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
        res.push(arr[i]);
        json[arr[i]] = 1;
      }
    }
    return res;
  }

  private static getElementDic(id: any): Array<PropPanelEntity> {
    return this.elementDic.get(id);
  }
  public static setElementDic(
    id: any,
    propertyName: string,
    propertyType: number,
  ) {
    if (!this.elementDic.has(id))
      this.elementDic.set(id, new Array<PropPanelEntity>());
    this.elementDic
      .get(id)
      .push(new PropPanelEntity(propertyName, propertyType));
  }
  public static getPropPanel(elements: any[]): ElementGroup {
    let elemetArray = new Array<PropPanelEntity>();
    elements.forEach(element => {
      let functions = MetaHelper.getAncestors(element.constructor);

      elemetArray.push(
        ...(CacheEntityServer.getElementDic(element.constructor) || []),
      );
      functions.forEach(elementType => {
        elemetArray.push(
          ...(CacheEntityServer.getElementDic(elementType) || []),
        );
      });
    });
    let element = new ElementGroup();
    element._elements = elements;
    elemetArray.forEach(property => {
      let propertys = [];
      elements.forEach(item => {
        propertys.push(Reflect.get(item, property.name));
      });

      switch (property.type) {
        case ClassType.resource:
        case ClassType.json: {
          let propertysJson = from<any>(propertys)
            .select(p => JSON.stringify(p))
            .distinct()
            .toArray();
          if (propertysJson.length == 1 && propertysJson[0] != undefined) {
            propertysJson = propertys[0];
            propertys = [];
            propertys.push(propertysJson);
          } else {
            propertys = [];
          }
          break;
        }

        default:
          propertys = from(propertys)
            .distinct()
            .toArray();
          break;
      }

      if (propertys.length == 1 && propertys[0] != undefined) {
        Reflect.set(element, property.name, propertys[0]);
      } else {
        switch (property.type) {
          case ClassType.string:
            Reflect.set(element, property.name, '');
            break;
          case ClassType.bool:
            Reflect.set(element, property.name, false);
            break;
          case ClassType.number:
            Reflect.set(element, property.name, 0);
            break;
          case ClassType.resource:
          case ClassType.object:
            Reflect.set(element, property.name, null);
            break;
          case ClassType.enum:
            Reflect.set(element, property.name, -1);
            break;
          default:
            Reflect.set(element, property.name, '');
            break;
        }
      }
    });
    return element;
  }

  public static setPropPanel(
    name: any,
    value: any,
    cwElements: any,
    propertyType: ClassType = ClassType.string,
  ) {
    RUHelper.Core.CreateTransaction();
    cwElements.forEach(item => {
      switch (propertyType) {
        case ClassType.number:
          Reflect.set(item, name, CacheEntityServer.convertNumber(value));
          break;
        default:
          Reflect.set(item, name, value);
          break;
      }
    });
    RUHelper.Core.CommitTransaction();
  }

  private static convertNumber(value: any): number {
    if (isNaN(Number(value))) {
      return 0;
    } else {
      return Number(value);
    }
  }
}

export function batch(type: ClassType = ClassType.number, custonKey?: string) {
  return function(target: any, key: string) {
    CacheEntityServer.setElementDic(
      target.constructor,
      custonKey ? custonKey : key,
      type,
    );
  };
}

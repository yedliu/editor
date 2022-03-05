import { ClassType } from '@/class-transformer/ClassTransformer';
import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import CWElement from '@/modelClasses/courseDetail/cwElement';

export type ElementTypeDesc = {
  property: string;
  subTypes: {
    value: ClassType<CWElement>;
    name: any;
    title: string;
    width?: number;
    height?: number;
    thumb?: any;
  }[];
};

export type InvokableTypeDesc = {
  property: string;
  subTypes: {
    value: ClassType<InvokableBase>;
    name: any;
    grouptype: string;
    type?: string;
    cat: string;
    desc: string;
    linecolor?: any;
    resBuild?: CWResourceTypes;
  }[];
};

export default class TypeMapHelper {
  static CommonTypeMap: any[];
  static ElementTypeDiscriminator: ElementTypeDesc;
  static InvokableTypeDiscriminator: InvokableTypeDesc;
  static ResRefTypeDiscriminator: any;
}

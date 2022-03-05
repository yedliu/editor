import { Point2D } from '@/utils/Math2D';
import LogicDesign from '../../logicDesign';
import InvokeHandler from '../InvokeHandler';
import InvokableBase from '../../InvokableBase';

export default interface ILogicDesignItem {
  Position: Point2D;

  readonly Role: string;

  DisplayName: string;

  LogicDesign: LogicDesign;

  IsSelectedInDesign: boolean;

  //IsOpratingByOther:boolean

  InvId: string;

  InvokeHandlers: InvokeHandler[];

  SettingTemplate: (...args: any[]) => JSX.Element;

  CheckCanInvoke(target: InvokableBase): boolean;

  GetDirectlyInvs(): InvokableBase[];
  GetAllLinkableInvokeHandlers(): InvokeHandler[];

  //TrySetOtherSelectedDItemProperties(propName: stirng, value: any): void;

  ReplaceRelativeIds(map: Map<string, string>): void;
}

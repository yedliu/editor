import { Expose } from '@/class-transformer';
import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import RUHelper from '@/redoundo/redoUndoHelper';
import MetaHelper from '@/utils/metaHelper';
import { observable } from 'mobx';
import { InvHandler, InvokerType } from '../../../InvokeHandlerMeta';
import MissionBase from '../Mission/MissionBase';

export default class PresetCommand extends InvokableBase {
  get CanInvoke() {
    return false;
  }

  get IsUnique() {
    return true;
  }

  @observable
  private _SucessId: string;
  @InvHandler({
    DisplayName: '正确命令',
    Checker: (_cons: any) => {
      //不允许连接记录器和提交器
      return (
        !_cons.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    Type: InvokerType.Event,
    OrderIndex: 0,
  })
  @Expose()
  public get SucessId(): string {
    return this._SucessId;
  }
  public set SucessId(v: string) {
    if (
      RUHelper.TrySetPropRedoUndo(
        this,
        'SucessId',
        () => (this._SucessId = v),
        v,
        this._SucessId,
      )
    ) {
    }
  }

  @observable
  private _ErrorId: string;
  @InvHandler({
    DisplayName: '失败命令',
    Checker: (_cons: any) => {
      //不允许连接记录器和提交器
      return (
        !_cons.IsMissionReceiver &&
        !MetaHelper.getAncestors(_cons).includes(MissionBase)
      );
    },
    Type: InvokerType.Event,
    OrderIndex: 1,
  })
  @Expose()
  public get ErrorId(): string {
    return this._ErrorId;
  }
  public set ErrorId(v: string) {
    if (
      RUHelper.TrySetPropRedoUndo(
        this,
        'ErrorId',
        () => (this._ErrorId = v),
        v,
        this._ErrorId,
      )
    ) {
    }
  }
}

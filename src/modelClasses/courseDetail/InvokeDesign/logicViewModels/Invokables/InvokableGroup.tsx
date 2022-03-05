import InvokableBase from '@/modelClasses/courseDetail/InvokableBase';
import { observable, reaction } from 'mobx';
import { from } from 'linq-to-typescript';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { Expose, Type } from '@/class-transformer';

export default class InvokableGroup extends InvokableBase {
  constructor() {
    super();
  }

  public get CanInvoke(): boolean {
    return false;
  }
  public set CanInvoke(v: boolean) {
    super.CanInvoke = false;
  }

  @observable
  private _SubItems: InvokableBase[] = [];

  // @Expose({ groups: ['clone'] })//只在复制时起效
  // @Type(() => InvokableBase)
  public get SubItems(): InvokableBase[] {
    return this._SubItems;
  }
  public set SubItems(v: InvokableBase[]) {
    if (v) this._SubItems = v;
  }
  private _oldSubItems: InvokableBase[] = [];
  protected subItemsChanged = reaction(
    () => {
      var oldItems = from(this._oldSubItems || [])
        .except(this.SubItems || [])
        .toArray();
      var newItems = from(this.SubItems || [])
        .except(this._oldSubItems || [])
        .toArray();
      this._oldSubItems = [...(this.SubItems || [])];
      return { oldItems, newItems };
    },
    ({ oldItems, newItems }) => {
      newItems?.forEach(x => (x.FatherItem = this));
      oldItems?.forEach(x => (x.FatherItem = null));
      this.OnSubItemsChanged({ oldItems, newItems });
    },
    { fireImmediately: true },
  );

  OnSubItemsChanged({ oldItems, newItems }) {}

  get TotalInvItems(): InvokableBase[] {
    var result: InvokableBase[] = [];
    if (this.SubItems) {
      for (var item of this.SubItems) {
        result.push(item);
        if (item instanceof InvokableGroup) {
          result.push(...item.TotalInvItems);
        }
      }
    }
    return result;
  }

  ReplaceRelativeIds(map: Map<string, string>) {
    super.ReplaceRelativeIds(map);
    if (this.SubItems != null)
      for (var subitem of this.SubItems) subitem.ReplaceRelativeIds(map);
  }

  SearchRes(resLib: CWResource[]) {
    super.SearchRes(resLib);
    this.SubItems?.forEach(x => x.SearchRes(resLib));
  }
}

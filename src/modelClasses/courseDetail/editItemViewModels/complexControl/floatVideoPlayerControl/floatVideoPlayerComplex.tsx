import floatVideoPlayerTemplate, {
  PropPanelTemplate as floatVideoPlayerTemplatePropPanelTemplate,
} from '@/components/cwDesignUI/elements/controlTemplates/floatVideoPlayerTemplate';
import CWResource from '@/modelClasses/courseDetail/cwResource';
import { observable } from 'mobx';
import { Expose, Type } from '@/class-transformer';
import { ResourceRef } from '@/modelClasses/courseDetail/resRef/resourceRef';
import { batch } from '@/server/CacheEntityServer';
import RUHelper from '@/redoundo/redoUndoHelper';
import { ClassType } from '@/modelClasses/courseDetail/courseDetailenum';
import CWElement from '@/modelClasses/courseDetail/cwElement';

export default class floatVideoPlayerComplex extends CWElement {
  public get Template(): any {
    return floatVideoPlayerTemplate;
  }

  public get PropPanelTemplate(): any {
    return floatVideoPlayerTemplatePropPanelTemplate;
  }

  constructor() {
    super();
  }

  @observable
  private _media: HTMLVideoElement;
  @batch(ClassType.object)
  public get media(): HTMLVideoElement {
    return this._media;
  }
  public set media(v: HTMLVideoElement) {
    this._media = v;
  }

  @observable
  private _VideoRes: ResourceRef;
  @Expose()
  @batch(ClassType.resource)
  @Type(() => ResourceRef)
  public get VideoRes(): ResourceRef {
    return this._VideoRes;
  }
  public set VideoRes(v: ResourceRef) {
    RUHelper.TrySetPropRedoUndo(
      this,
      'VideoRes',
      () => {
        this._VideoRes = v;
        this.media?.load();
      },
      v,
      this._VideoRes,
    );
  }

  SetResourcesFromLib(reslib: CWResource[]) {
    if (!reslib) return;
    this.VideoRes?.SearchResource(reslib);
  }

  public GetDependencyResources(): CWResource[] {
    var res: CWResource[] = [];
    if (this.VideoRes != null && this.VideoRes.Resource != null)
      res.push(this.VideoRes.Resource);
    return res;
  }
}

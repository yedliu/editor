import CWResource from '../cwResource';
import { CWResourceTypes } from '../courseDetailenum';
import { from } from 'linq-to-typescript';
import { Expose } from '@/class-transformer';
import { observable } from 'mobx';

export enum RefSelectorType {
  ImageAndSkeleton = 0,
  Image = 1,
  Skeleton = 2,
  AudioAndVideo = 3,
  Audio = 4,
  Video = 5,
  Captions = 6,
}

export class ResourceRef {
  Resource: CWResource;

  private _tempResId: string;
  @Expose()
  public get ResourceId(): string {
    if (this.Resource == null) return this._tempResId;
    return this.Resource?.resourceId;
  }
  public set ResourceId(v: string) {
    this._tempResId = v;
  }

  @Expose()
  public get ResourceType(): CWResourceTypes {
    return this.Resource?.resourceType;
  }

  //视频时长
  private _duration: number;
  @Expose()
  public get Duration() {
    var duration = null;
    if (this.Resource == null) {
      duration = this._duration;
    } else {
      if (this.Resource?.resourceType == CWResourceTypes.Video) {
        duration = this.Resource?.duration;
      }
    }
    return duration;
  }
  public set Duration(v: number) {
    this._duration = v;
  }

  constructor(res?: CWResource) {
    this.Resource = res;
  }

  SearchResource(reslib: CWResource[], id: string = null) {
    if (id == null || id == '') {
      id = this._tempResId;
      this._tempResId = null;
    }
    if (!(id == null || id == '') && reslib != null) {
      this.Resource = reslib.find(x => x.resourceId == id);
    }
    return this;
  }
}

export class SkResRef extends ResourceRef {
  constructor(res?: CWResource, action?: string, playTimes?: number) {
    super(res);

    this.Action = action;
    this.PlayTimes = playTimes;
  }

  private _Action: string;
  @Expose()
  public get Action(): string {
    return this._Action || this.Resource?.boneList?.[0]?.value;
  }
  public set Action(v: string) {
    this._Action = v;
  }

  private _PlayTimes: number;
  @Expose()
  public get PlayTimes(): number {
    return this._PlayTimes || 0;
  }
  public set PlayTimes(v: number) {
    this._PlayTimes = v;
  }
}

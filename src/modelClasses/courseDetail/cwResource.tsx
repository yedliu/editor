import { CWResourceTypes } from './courseDetailenum';
import { Expose, Type } from '@/class-transformer';

export class BoneDic {
  @Expose()
  public name: string;
  @Expose()
  public value: string;
  @Expose()
  public uuid: string;

  public visiblePop: boolean = false;
}

export class StatusVO {
  @Expose()
  public status: number;
  @Expose()
  public statusDesc: string;
  @Expose()
  public statusStr: string;
  @Expose()
  public language: number;
}

export default class CWResource {
  @Expose()
  resourceId: string;
  @Expose()
  resourceName: string;
  @Expose()
  resourceType: CWResourceTypes;
  @Expose()
  labelNames: string[];
  @Expose()
  strList: string[];
  @Expose()
  resourceMd5: string;
  @Expose()
  boneMd5: string;
  @Expose()
  resourceKey: string;
  @Expose()
  resourceSize: number;
  @Expose()
  createTime: number;
  @Expose()
  updateTime: number;
  @Expose()
  deleted: boolean;
  @Expose()
  width: number;
  @Expose()
  height: number;
  @Expose()
  boneJs: string;
  @Expose()
  boneSource: string;
  @Expose()
  @Type(() => BoneDic)
  boneList: Array<BoneDic>;
  @Expose()
  directoryId: number;
  @Expose()
  useNum: number;
  @Expose()
  userId: string;
  @Expose()
  duration: number;
  @Expose()
  purpose: string;
  @Expose()
  directorys: string;
  @Expose()
  userName: string;
  @Expose()
  language: string;
  @Type(() => StatusVO)
  statusVO: StatusVO;
  @Expose()
  isMyCollect: boolean;

  ///统计使用无需序列化反序列化
  referenceCount: number;
  // @Expose()
  // ImageData: string;
}

import { Expose } from '@/class-transformer';
import { observable } from 'mobx';

export default class SwitchSketelonAction {
  @observable
  private _Id: string;
  @Expose()
  public get Id(): string {
    return this._Id;
  }
  public set Id(v: string) {
    this._Id = v;
  }

  @observable
  private _Action: string;
  @Expose()
  public get Action(): string {
    return this._Action;
  }
  public set Action(v: string) {
    this._Action = v;
  }

  @observable
  private _ChangedSkPlayTimes: number;
  @Expose()
  public get ChangedSkPlayTimes(): number {
    return this._ChangedSkPlayTimes;
  }
  public set ChangedSkPlayTimes(v: number) {
    this._ChangedSkPlayTimes = v;
  }
}

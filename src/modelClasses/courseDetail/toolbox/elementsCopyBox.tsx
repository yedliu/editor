import CWResource from '../cwResource';
import CWElement from '../cwElement';
import { Expose, Type } from '@/class-transformer';
import InvokableBase from '../InvokableBase';

export default class ElementsCopyBox {
  constructor() {}

  private _Name: string;
  @Expose()
  public get Name(): string {
    return this._Name;
  }
  public set Name(v: string) {
    this._Name = v;
  }

  private _Description: string;
  @Expose()
  public get Description(): string {
    return this._Description;
  }
  public set Description(v: string) {
    this._Description = v;
  }

  private _ResLib: CWResource[];
  @Expose()
  @Type(() => CWResource)
  public get ResLib(): CWResource[] {
    return this._ResLib;
  }
  public set ResLib(v: CWResource[]) {
    this._ResLib = v;
  }

  private _Elements: CWElement[];
  @Expose()
  @Type(() => CWElement)
  public get Elements(): CWElement[] {
    return this._Elements;
  }
  public set Elements(v: CWElement[]) {
    this._Elements = v;
  }

  private _Invokables: InvokableBase[];
  @Expose()
  @Type(() => InvokableBase)
  public get Invokables(): InvokableBase[] {
    return this._Invokables;
  }
  public set Invokables(v: InvokableBase[]) {
    this._Invokables = v;
  }
}

import CWResource from './courseDetail/cwResource';
import { observable } from 'mobx';

export class Courseware {
  coursewareId: string;
  coursewareName: string;
  createTime: number;
  updateTime: number;
  labelNames: Array<string>;
  strList: Array<string>;
  directoryId: number;
  upload: number;
  description: string;
  cover: string;
  purpose: string;
  purposeVo: any;
  directorys: string;
  coursewareVersion: string;
  shared: number;
  self: boolean;
  extendInfo: any;
  compiler: string;
  key: string = '1';
  userId: string;
  bu: number;
  directoryList: any[];
  subTitlesStr: string;

  //模板增加属性
  questionType: number;
  questionTypeDirVO: any;
  playType: number;
  styleType: number;
  colorType: number;
  questionId: number;
  constructor() {
    this.coursewareVersion = '2';
  }
}
export class CoursewareDtail extends Courseware {
  coursewareContent: string; //课件内容
  gameResourceList: Array<CWResource>;
}

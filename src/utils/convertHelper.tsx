import { CWResourceTypes } from '@/modelClasses/courseDetail/courseDetailenum';
import CWResource from '@/modelClasses/courseDetail/cwResource';

export default class convertHelper {
  static convertToCwResourceTypeToZh_Cn(type: CWResource) {
    switch (type.resourceType) {
      case CWResourceTypes.Audio:
        return '音频';
      case CWResourceTypes.Captions:
        return '字幕';
      case CWResourceTypes.Image:
        //var valstr = type.resourceKey.substr(type.resourceKey.lastIndexOf('.'))
        return '图片';
      case CWResourceTypes.SkeletalAni:
        return '动画';
      case CWResourceTypes.Video:
        return '视频';
      case CWResourceTypes.Font:
        return '字体';
      default:
        return '其他';
    }
  }
}

import HttpService from '@/server/httpServer';
import { message } from 'antd';

export default class FormworkDataService {
  static async getFormworkCascadeSys() {
    let courseResponse = await HttpService.openApiHttpRequest(
      'template/snapshot/getCascadeCRDirectory',
      {
        type: 5,
        dataType: 2,
      },
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  static async getFormworkList(
    keywords: string,
    colorType: number,
    playType: number,
    styleType: number,
    questionCode: string,
    pageIndex: number,
    pageSize: number,
    quId: string,
  ) {
    let courseResponse = await HttpService.openApiHttpRequest(
      'template/snapshot/pageQuery',
      {
        //bu: undefined,
        colorType: colorType,
        playType: playType,
        questionCode: questionCode,
        styleType: styleType,
        //searchType: 1,
        coursewareName: keywords,
        //searchDomain: 0,
        pageSize: pageSize,
        pageNo: pageIndex,
        questionId: quId,
        //directoryId: 0,
        //field: 'updateTime',
        //sort: 'DESC',
      },
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  /** 获取题目详情 */
  static async getQuDetail(questionId: string) {
    let quResponse = await HttpService.openApiHttpRequest(
      `template/snapshot/question/detail?questionId=${questionId}`,
      null,
      'GET',
    );
    if (quResponse.code == '0' && quResponse.data) {
      return quResponse.data;
    } else {
      message.error('获取题目失败：' + quResponse.message);
    }
    return null;
  }

  /** 连接模板和问题 */
  static async linkTemplateQu(
    questionId: string,
    templateId: string,
    userId: string,
  ) {
    let quResponse = await HttpService.openApiHttpRequest(
      'template/snapshot/compound/courseware',
      {
        questionId: questionId,
        templateId: templateId,
        userId: userId,
      },
      'POST',
    );
    if (quResponse.code == '0') {
      return true;
    } else {
      message.error(quResponse.message);
    }
    return null;
  }
}

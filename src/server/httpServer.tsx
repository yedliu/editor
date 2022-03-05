import { message } from 'antd';
import axios from 'axios';
axios.defaults.withCredentials = true;
const marinapiurlconst = 'api/zm-ai-courseware-editor-b/zmg/';
const openapiurlconst = 'api/kids/interact/open/';
export default class HttpService {
  /**
   * 简单封装http请求
   * @param url  地址
   * @param data 数据
   * @param method 请求方式
   */
  static HttpRequest(
    url: string,
    data: any = null,
    method: string = 'GET',
    mainAppUrl: string = marinapiurlconst,
  ): Promise<any> {
    var requesturl = process.env.apiUrl.concat(mainAppUrl, url);
    if (method === 'POST' && data) {
      return new Promise((resolve, rejects) => {
        try {
          axios
            .post(requesturl, data, {
              headers: {
                'request-platform': 'ZMG_2_WEB',
              },
            })
            .then(res => {
              var data = res.data;
              if (data) {
                if (data.code == '11') {
                  window.location.href = process.env.loginUrl;
                } else resolve(data);
              }
            });
        } catch {
          resolve(null);
        }
      });
    } else {
      return new Promise((resolve, rejects) => {
        try {
          axios
            .get(requesturl, {
              headers: { 'request-platform': 'ZMG_2_WEB' },
            })
            .then(res => {
              var data = res.data;
              if (data) {
                if (data.code == '11') {
                  window.location.href = process.env.loginUrl;
                } else resolve(data);
              }
            });
        } catch {
          resolve(null);
        }
      });
    }
  }

  /**
   * 开放接口的Http请求
   */
  static openApiHttpRequest(
    url: string,
    data: any = null,
    method: string = 'GET',
    mainAppUrl: string = openapiurlconst,
  ): Promise<any> {
    var requesturl = process.env.openapiUrl.concat(mainAppUrl, url);
    if (method === 'POST' && data) {
      return new Promise((resolve, rejects) => {
        try {
          axios
            .post(requesturl, data, {
              headers: {
                'request-platform': 'ZMG_2_WEB',
              },
            })
            .then(res => {
              var data = res.data;
              if (data) {
                resolve(data);
              }
            });
        } catch {
          resolve(null);
        }
      });
    } else {
      return new Promise((resolve, rejects) => {
        try {
          axios
            .get(requesturl, {
              headers: { 'request-platform': 'ZMG_2_WEB' },
            })
            .then(res => {
              var data = res.data;
              if (data) {
                resolve(data);
              }
            });
        } catch {
          resolve(null);
        }
      });
    }
  }

  static async getBuList() {
    return new Promise((resolve, rejects) => {
      axios
        .get(
          'https://web-data.zmlearn.com/config/rLoDGHJBP9ufv1mZ4PSnPg/buPageType.json',
          { withCredentials: false },
        )
        .then(res => {
          var data = res.data;
          resolve(data);
        });
    });
  }

  static async getcompessAndDES(txt) {
    return new Promise((resolve, rejects) => {
      axios.get(txt, { withCredentials: false }).then(res => {
        var data = res.data;
        resolve(data);
      });
    });
  }

  static async getCouresWareDetail(cwId: string) {
    let courseResponse = await HttpService.HttpRequest(
      'courseware/detail?coursewareId=' + cwId,
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  static async updateCourseWareDetail(updateObj: any) {
    let response = await HttpService.HttpRequest(
      'courseware/update',
      updateObj,
      'POST',
    );
    if (response == null) {
      message.error(response.message);
      return false;
    }
    if (response.data == true) {
      return true;
    }
    return false;
  }

  //#region 获取当前用户信息

  static async getUserInfo() {
    let userResponse = await HttpService.HttpRequest('user/initInfo');
    if (userResponse.code == '0') {
      var c = userResponse;
      if (
        userResponse.data.permission &&
        userResponse.data.permission.indexOf('InternalTest') != -1
      ) {
        return userResponse.data;
      } else window.location.href = './tip';
    }
    return null;
  }

  //#endregion

  //#region  资源列表拉取

  static async fetchResDics() {
    let response = await HttpService.HttpRequest(
      'directory/getCascadeCRDirectory',
      { type: 2, dataType: 2 },
      'POST',
    );
    if (response && response.code == '0') {
      return response.data;
    }
    return null;
  }
  static async fetchResDicTypeMap() {
    let response = await HttpService.HttpRequest(
      'gameResource/getResourceTypeList',
      null,
      'GET',
    );
    if (response && response.code == '0') {
      return response.data;
    }
    return null;
  }

  static async queryResPage(requestInfo: any) {
    let response = await HttpService.HttpRequest(
      'gameResource/pageQuery',
      requestInfo,
      'POST',
    );
    if (response && response.code == '0') {
      return response.data;
    }
    return null;
  }

  static async queryResByIds(requestInfo: string[]) {
    let response = await HttpService.HttpRequest(
      'gameResource/queryByResourceIds',
      { resourceIds: requestInfo },
      'POST',
    );
    if (response && response.code == '0') {
      return response.data;
    }
    return null;
  }
  //#endregion

  //#region 课件列表获取

  static async getCourseList(
    keywords: string,
    pageIndex: number,
    serachDomain: number,
    upload: number,
    directoryId: number,
    bu: number,
    isTemplate = false,
    questionType = null,
  ) {
    let courseResponse = await HttpService.HttpRequest(
      (isTemplate ? 'template' : 'courseware') + '/page',
      {
        searchDomain: serachDomain,
        coursewareName: keywords,
        pageSize: 24,
        pageNo: pageIndex,
        coursewareVersion: 2,
        upload: upload,
        directoryId: directoryId,
        bu: bu,
        questionType: questionType,
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
  //#endregion

  //#region  课件BU列表查询
  static async getCourseBu() {
    let courseResponse = await HttpService.HttpRequest(
      'courseware/buList',
      null,
      'GET',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  //#endregion

  //#region  复制课件接口
  static async copyCourseWare(copydata: any, isTemplate = false) {
    let courseResponse = await HttpService.HttpRequest(
      (isTemplate ? 'template' : 'courseware') + '/copy',
      copydata,
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    }
    console.log(courseResponse?.message);
    return null;
  }

  //#endregion

  //#region  拆分课件接口
  static async splitCourseWare(splitdata: any) {
    let courseResponse = await HttpService.HttpRequest(
      'courseware/split',
      splitdata,
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    }
    console.log(courseResponse?.message);
    return null;
  }

  //#endregion

  //#region  查询级联菜单

  static async getCourseTypeCascade(type = 0, dataType = 2) {
    let courseResponse = await HttpService.HttpRequest(
      'directory/getCascadeCRDirectory',
      {
        type: type,
        dataType: dataType,
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

  static async directoryCount(searchDomain = 0, coursewareVersion = 2) {
    let courseResponse = await HttpService.HttpRequest(
      'directory/root/directory/useCount',
      {
        searchDomain: searchDomain,
        coursewareVersion: coursewareVersion,
      },
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else {
      message.error(courseResponse?.message);
    }
    return null;
  }

  //#endregion

  //#region  上传课件信息
  static async SetUploadCourse(
    courseId: string,
    textmark: string,
    isTemplate = false,
  ) {
    let courseResponse = await HttpService.HttpRequest(
      (isTemplate ? 'template' : 'courseware') + '/upload',
      {
        coursewareId: courseId,
        remark: textmark,
      },
      'POST',
    );
    // if (courseResponse.code == '0') {
    //   return courseResponse.data;
    // }
    return courseResponse;
  }

  //#endregion

  //#region  新建课件
  static async AddCourse(course: any, isTemplate = false) {
    let courseResponse = await HttpService.HttpRequest(
      (isTemplate ? 'template' : 'courseware') + '/add',
      course,
      'POST',
    );
    if (courseResponse.code == '0') {
      console.log('setupload');
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  //#region  修改课件
  static async UpdateCourse(course: any, isTemplate = false) {
    let courseResponse = await HttpService.HttpRequest(
      (isTemplate ? 'template' : 'courseware') + '/update',
      course,
      'POST',
    );
    if (courseResponse.code == '0') {
      console.log('setupload');
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');
      return 'loginFail';
    } else {
      message.error(courseResponse?.message);
    }
    return null;
  }

  //#endregion

  //#region  修改资源
  static async UpdateResource(resource: any) {
    let courseResponse = await HttpService.HttpRequest(
      'gameResource/editResources',
      resource,
      'POST',
    );
    return courseResponse;
  }

  static async AddResource(resource: any) {
    let courseResponse = await HttpService.HttpRequest(
      'gameResource/addResources',
      resource,
      'POST',
    );
    return courseResponse;
  }

  //#endregion

  //#region 获取音频字幕

  static async GetAudioResourceCaptions(resId: any) {
    let response = await HttpService.HttpRequest(
      'gameResource/query/subtitleResourceVO?resourceId=' + resId,
      null,
      'GET',
    );
    return response;
  }

  //#endregion

  //#region  上传文字转图片接口
  static async SetImageTextFlies(imagefiles: any) {
    let courseResponse = await HttpService.HttpRequest(
      'gameResource/batchAddOtherResources',
      imagefiles,
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      return 'loginFail';
    }
    return null;
  }

  //#endregion

  //#region  查询上传token信息
  static async getAliToken() {
    let courseResponse = await HttpService.HttpRequest(
      'aLiYunOSSService/getALiYunOSSToken?tokenName=test',
      null,
      'GET',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  //#endregion

  //#region  MD5 校验
  static async MD5ServerValid(md5s: string[]) {
    let response = await HttpService.HttpRequest(
      'gameResource/validateByMD5',
      { md5List: md5s },
      'POST',
    );
    return response;
  }

  //#endregion

  //#region  获取字体信息
  static async getFontList() {
    let courseResponse = await HttpService.HttpRequest(
      'gameResource/resourceTypePageList',
      null,
      'GET',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    } else if (courseResponse.code == '11') {
      console.log('未登录');

      return 'loginFail';
    }
    return null;
  }

  //#endregion

  //#region  获取字体信息
  static async getCategoryConfigList(dicNames: string[]) {
    let courseResponse = await HttpService.HttpRequest(
      'categoryConfig/query',
      {
        categorys: dicNames,
      },
      'POST',
    );
    if (courseResponse.code == '0') {
      return courseResponse.data;
    }
    return null;
  }

  //#endregion

  //#region 音色合成相关

  static async GetHttpLength(url) {
    axios
      .head(url, {
        headers: {
          Accept: 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => {
        var _d = res;
        console.log(_d);
      });
    return null;
  }

  static async RecordResourceAsync(cwResource) {
    console.log(JSON.stringify(cwResource));

    let request = await HttpService.HttpRequest(
      'gameResource/addResources',
      cwResource,
      'POST',
    );
    if (request.data == '1') {
      return 'true';
    }
    console.log(request.message);
    return request.message;
  }

  static async GetVoices() {
    let voices_response = await HttpService.HttpRequest(
      'api/zmg/common/getVoices',
      {},
      'POST',
    );
    if (voices_response.code == '0') {
      return voices_response.data;
    }
    console.log(voices_response.message);
    return null;
  }

  static async TimbreSynthesis(Speed, SynthesisText, id, Volume) {
    var _speed = Speed * 10;
    //console.log(_speed + '--' + SynthesisText + '--' + id + '--' + Volume);
    try {
      let await_response = await HttpService.HttpRequest(
        '/api/zmg/voicer/translateVoice',
        {
          audioType: 'MP3',
          productType: 1,
          speed: _speed,
          text: SynthesisText,
          textType: 'text',
          voiceId: id,
          volume: Volume,
        },
        'POST',
      );
      console.log('执行结束');

      if (await_response.code == '0') {
        return await_response.data;
      }
      console.log(await_response.message);
      return null;
    } catch (error) {}
    return null;
  }

  //#endregion

  //#region  获取项目二维码
  static async GetQRCode(ProfileId) {
    console.log(ProfileId);

    let courseResponse = await HttpService.HttpRequest(
      'courseware/forwardMessage?coursewareId=' + ProfileId,
      null,
      'GET',
    );
    if (courseResponse != null && courseResponse.code == '0') {
      return courseResponse.data;
    } else {
      console.log('请求二维码数据失败:' + courseResponse?.message);
    }
    return null;
  }

  //#endregion

  //#region

  static async sharedOperation(coursewareId, shared) {
    let await_response = await HttpService.HttpRequest(
      'courseware/shared',
      {
        coursewareId: coursewareId,
        shared: shared,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return true;
    }
    console.log(await_response.message);
    return null;
  }

  //#endregion

  //#region  删除课件
  static async deleteCourseWare(cid, isTemplate = false) {
    let courseResponse = await HttpService.HttpRequest(
      (isTemplate ? 'template' : 'courseware') + '/del?coursewareId=' + cid,
      null,
      'GET',
    );
    if (courseResponse != null && courseResponse.code == '0') {
      return courseResponse.data;
    } else {
      console.log('请求删除课件失败:' + courseResponse?.message);
    }
    return null;
  }
  //#endregion

  //#region  键值配置相关接口

  static async categoryConfig_pageQuery(
    category, //所属分类
    configKey, //配置的key
    configValue, //配置的value
    field, //排序字段
    pageNo, //分页查询页数 若不传默认是1   必须
    pageSize, //分页查询步长 size 若不传默认是10   必须
    sort, //排序方式 倒序: DESC 升序：ASC
  ) {
    let await_response = await HttpService.HttpRequest(
      '../mgr/categoryConfig/pageQuery',
      {
        category: category,
        configKey: configKey,
        configValue: configValue,
        field: field,
        pageNo: pageNo,
        pageSize: pageSize,
        sort: sort,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return await_response.data;
    }
    console.log(await_response.message);
    return null;
  }

  static async categoryConfig_add(
    category, //所属分类
    configKey, //配置的key
    configValue, //配置的value
    sort,
  ) {
    let await_response = await HttpService.HttpRequest(
      '../mgr/categoryConfig/add',
      {
        category: category,
        configKey: configKey,
        configValue: configValue,
        orderBit: sort,
      },
      'POST',
    );
    console.log('categoryConfig_add----------------------------------');
    console.log(JSON.stringify(await_response));
    if (await_response.code == '0') {
      return await_response.data;
    }
    console.log(await_response.message);
    return null;
  }

  static async categoryConfig_edit(
    category, //所属分类
    configKey, //配置的key
    configValue, //配置的value
    sort,
  ) {
    let await_response = await HttpService.HttpRequest(
      '../mgr/categoryConfig/edit',
      {
        category: category,
        configKey: configKey,
        configValue: configValue,
        orderBit: sort,
      },
      'POST',
    );
    console.log('categoryConfig_edit----------------------------------');
    console.log(JSON.stringify(await_response));
    if (await_response.code == '0') {
      return await_response.data;
    }
    console.log(await_response.message);
    return null;
  }

  static async categoryConfig_delete(id) {
    let await_response = await HttpService.HttpRequest(
      '../mgr/categoryConfig/delete?id=' + id,
      null,
      'GET',
    );
    console.log('categoryConfig_delete----------------------------------');
    console.log(JSON.stringify(await_response));
    if (await_response.code == '0') {
      return await_response.data;
    }
    console.log(await_response.message);
    return null;
  }

  static async categoryConfig_loadCategory(pageNo = 1, pageSize = 10) {
    let await_response = await HttpService.HttpRequest(
      '../mgr/categoryConfig/loadCategory',
      {
        pageNo: pageNo,
        pageSize: pageSize,
      },
      'POST',
    );
    console.log(
      'categoryConfig_loadCategory----------------------------------',
    );
    console.log(JSON.stringify(await_response));
    if (await_response.code == '0') {
      return await_response.data;
    }
    console.log(await_response.message);
    return null;
  }

  static async categoryConfig_replaceAll(json) {
    var obj = JSON.parse(json);
    let await_response = await HttpService.HttpRequest(
      '../mgr/categoryConfig/replaceAll',
      obj,
      'POST',
    );
    console.log('categoryConfig_replaceAll----------------------------------');
    console.log(JSON.stringify(await_response));
    if (await_response.code == '0') {
      return await_response.data;
    }
    message.error(await_response?.message);
    console.log(await_response?.message);
    return null;
  }

  //#endregion

  //#region 文件夹相关

  //创建文件夹
  static async fileDirAdd(
    directoryId: number, //文件夹所属目录
    name: string, //文件夹名
    parentId: number, //文件夹的上级目录,不传默认为0（最顶层）
  ) {
    let await_response = await HttpService.HttpRequest(
      'courseware/fileDir/add',
      {
        directoryId: directoryId,
        name: name,
        parentId: parentId,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return true;
    }
    message.error(await_response?.message);
    return null;
  }

  //删除文件夹
  static async fileDirDelete(id: number) {
    let await_response = await HttpService.HttpRequest(
      'courseware/fileDir/delete',
      {
        id: id,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return true;
    }
    message.error(await_response?.message);
    return null;
  }

  //编辑文件夹
  static async fileDirEdit(id: number, newName: string) {
    let await_response = await HttpService.HttpRequest(
      'courseware/fileDir/edit',
      {
        id: id,
        newName: newName,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return true;
    }
    message.error(await_response?.message);
    return null;
  }

  //移动到文件夹
  static async fileDirMove(
    ids: any[], //待移动的课件/文件夹id集合
    targetFileDirId: number, //移动到的目标文件夹id
  ) {
    let await_response = await HttpService.HttpRequest(
      'courseware/fileDir/move',
      {
        ids: ids,
        targetFileDirId: targetFileDirId,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return true;
    }
    message.error(await_response?.message);
    return null;
  }

  //#endregion

  //资源收藏夹添加
  static async addOrCancelCollect(reqType, resourceId) {
    let await_response = await HttpService.HttpRequest(
      'gameResource/addOrCancelCollect',
      {
        reqType: reqType ? 1 : 2,
        resourceId: resourceId,
      },
      'POST',
    );
    if (await_response.code == '0') {
      return true;
    }
    message.error(await_response?.message);
    return null;
  }

  // 修改音频音量大小
  static async brushAudieVolume(params) {
    const { id, resourceId, resourceKey, resourceName, volume } = params;
    let res = await HttpService.HttpRequest(
      'gameResource/brushAudioVolume',
      {
        id,
        resourceId,
        resourceKey,
        resourceName,
        volume,
      },
      'POST',
    );
    if (res?.code == '0') {
      return res.data;
    }
    message.error(res?.message);
    return null;
  }

  // 替换音频资源
  static async replaceVolume(params) {
    const { id, resourceId, resourceKey, resourceName, volume } = params;
    let res = await HttpService.HttpRequest(
      'gameResource/replaceAudioResource',
      {
        id,
        resourceId,
        resourceKey,
        resourceName,
        volume,
      },
      'POST',
    );
    if (res?.code == '0') {
      return res.data;
    }
    message.error(res?.message);
    return null;
  }
}

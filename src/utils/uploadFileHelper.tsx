import { action, runInAction, observable } from 'mobx';
import HttpService from '@/server/httpServer';
import IdHelper from './idHelper';
import { Type } from '@/class-transformer';
import OSS from 'ali-oss';

//let OSS = require('ali-oss');

const parallel = 3;
const partSize = 1024 * 1024;

export class ResponseAliYun {
  accessKeyId: string;
  accessKeySecret: string;
  bucketName: string;
  endPoint: string;
  expiration: string;
  securityToken: string;
  domain: string;
  pathPrefix: string;
}

export class ResFile {
  resourceKey: string;
  file: any;
  resourceId: string;
  filetype: string = '.png';
  md5: string;
}

export default class UpLoadFileHelper {
  static coverDir: string = 'cover/';
  static courseDir: string = 'course/';
  // static region: string = 'oss-cn-beijing';

  @action static UploadFile = async (
    file: ResFile,
    dirpath: string = UpLoadFileHelper.courseDir,
  ) => {
    let data: ResponseAliYun = await HttpService.getAliToken();
    return await UpLoadFileHelper.putObject(data, file, dirpath);
  };

  static UploadFileWithProcess = async (
    file: ResFile,
    callback: (p: any) => void,
    dirpath: string = UpLoadFileHelper.courseDir,
  ) => {
    let data: ResponseAliYun = await HttpService.getAliToken();
    return await UpLoadFileHelper.multipartUpload(
      data,
      file,
      callback,
      dirpath,
    );
  };

  static getRegion(endPoint: string) {
    return endPoint?.replace('https://', '').split('.')?.[0];
  }

  //上传-简单
  static async putObject(
    aliConfig: ResponseAliYun,
    file: ResFile,
    dirpath: string = UpLoadFileHelper.courseDir,
  ) {
    try {
      let client = new OSS({
        region: UpLoadFileHelper.getRegion(aliConfig.endPoint),
        accessKeyId: aliConfig.accessKeyId,
        accessKeySecret: aliConfig.accessKeySecret,
        bucket: aliConfig.bucketName,
        stsToken: aliConfig.securityToken,
        timeout: 5 * 60 * 1000,
      });
      let filepath = aliConfig.pathPrefix + '/' + dirpath;
      let filename = IdHelper.NewId() + file.filetype;
      let result = await client.put(filepath + filename, file.file);
      if (result) {
        file.resourceKey = aliConfig.domain + '/' + filepath + filename;
      }
      file.file = null; //清空file文件信息
      return file;
    } catch (e) {
      console.log(e);
    }
  }

  static async multipartUpload(
    aliConfig: ResponseAliYun,
    file: ResFile,
    onCallBack: (p: any) => void,
    dirpath: string = UpLoadFileHelper.courseDir,
  ) {
    try {
      let client = new OSS({
        region: UpLoadFileHelper.getRegion(aliConfig.endPoint),
        accessKeyId: aliConfig.accessKeyId,
        accessKeySecret: aliConfig.accessKeySecret,
        bucket: aliConfig.bucketName,
        stsToken: aliConfig.securityToken,
      });
      let filepath = aliConfig.pathPrefix + '/' + dirpath;
      let filename = IdHelper.NewId() + file.filetype;
      let result = await client.multipartUpload(
        filepath + filename,
        file.file,
        {
          parallel,
          partSize,
          progress: function(p, checkpoint) {
            onCallBack?.(p);
          },
          // meta: { year: 2020, people: 'test' },
          // mime: 'image/jpeg'
        },
      );
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}

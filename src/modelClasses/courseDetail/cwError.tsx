import CWPage from './cwpage';
import CWResource from './cwResource';
import { Courseware } from '../courseware';
import { observable, computed, action, runInAction, reaction } from 'mobx';
import HttpService from '@/server/httpServer';
import { deserializeArray, classToPlain, serialize } from '@/class-transformer';
import CourseCommander from './courseCommander';
import TypeMapHelper from '@/configs/typeMapHelper';
import { message } from 'antd';
import FlexLayout, { Model } from 'flexlayout-react';
import CWCacheHelper from '@/utils/cwCacheHelper';
import WebSqlHelper from '@/utils/webSqlHelper';
import RUHelper from '@/redoundo/redoUndoHelper';
import LoopWork from './toolbox/LoopWork';
import StrCompressHelper from '@/utils/strCompressHelper';
import ActionManager from '@/redoundo/actionManager';
import CacheHelper from '@/utils/cacheHelper';
import ArrayHelper from '@/utils/arrayHelper';
import ObjHelper from '@/utils/objHelper';
import JSSDK from '@zm-fe/zm-jssdk';
import { CWResourceTypes } from './courseDetailenum';
import InvokableBase from './InvokableBase';
import { string } from 'prop-types';
import InvFunction from '@/modelClasses/courseDetail/InvokeDesign/logicViewModels/Invokables/InvFunc/InvFunction';

//异常实体
export class ErrorEntity {
  errorIndex: number; //编号，绑定列表时作为唯一健使用
  pageIndex: number; //页面下标
  pageName: string; //页面名称
  elementsName: string; //元素名称
  logicObjName: string; //逻辑对象名称（包含触发器、执行器、函数）
  errMsg: string; //错误消息
}

export default class CwError {
  constructor() {}

  //递归校验业务执行器
  private ValidateInvokable(
    invokable: InvokableBase,
    pageIndex: number,
    pageName: string,
    parentlogicObjName: string = '',
  ) {
    var errorList = new Array<ErrorEntity>();

    var logicObjName =
      '【' +
      (invokable.DisplayName ? invokable.DisplayName : '-') +
      '】' +
      (invokable.Note ? invokable.Note : '-');
    var msg = invokable.Validate();
    if (msg && msg.length > 0) {
      var errorEntity = new ErrorEntity();
      errorEntity.pageIndex = pageIndex + 1;
      errorEntity.pageName = pageName ? pageName : '-';
      errorEntity.elementsName = '-';
      errorEntity.logicObjName = parentlogicObjName + logicObjName;
      errorEntity.errMsg = msg;
      errorList.push(errorEntity);
    }

    //函数内存在执行器
    if (invokable?.SubItems) {
      invokable?.SubItems?.forEach(invokableSub => {
        var currentlogicObjName =
          (parentlogicObjName.length > 0 ? parentlogicObjName : '') +
          logicObjName +
          '/';
        var subItemErrorList = this.ValidateInvokable(
          invokableSub,
          pageIndex,
          pageName,
          currentlogicObjName,
        );
        if (subItemErrorList.length > 0) {
          errorList.push(...subItemErrorList);
        }
      });
    }
    return errorList;
  }

  //#region 校验全局执行器连线

  //递归校验全局执行器连线
  private ValidateInvokableLine(
    allinvokableList: InvokableBase[],
    invokableList: InvokableBase[],
    pageIndex: number,
    pageName: string,
  ) {
    var errorList = new Array<ErrorEntity>();
    invokableList?.forEach(invokable => {
      var invokableId = invokable.Id;
      var invId = invokable.InvId;
      if (invokableId && invId) {
        var invIdArr = invId.split(',');
        invIdArr.forEach(id => {
          var isMatch = this.ValidateInvokableLineMatch(
            allinvokableList,
            allinvokableList,
            invokableId,
            id,
            [],
          );
          if (isMatch) {
            var errorEntity = new ErrorEntity();
            errorEntity.pageIndex = pageIndex + 1;
            errorEntity.pageName = pageName ? pageName : '-';
            errorEntity.elementsName = '-';
            errorEntity.logicObjName =
              '【' +
              (invokable.DisplayName ? invokable.DisplayName : '-') +
              '】' +
              (invokable.Note ? invokable.Note : '-');

            errorEntity.errMsg = '不能循环连线';
            errorList.push(errorEntity);
          }
        });
      }

      if (invokable?.SubItems && invokable?.SubItems.length > 0) {
        var subItemErrorList = this.ValidateInvokableLine(
          allinvokableList,
          invokable?.SubItems,
          pageIndex,
          pageName,
        );
        if (subItemErrorList.length > 0) {
          errorList.push(...subItemErrorList);
        }
      }
    });

    return errorList;
  }

  //递归校验全局执行器连线匹配
  private ValidateInvokableLineMatch(
    allinvokableList: InvokableBase[],
    invokableList: InvokableBase[],
    invokableId: string,
    invId: string,
    usedInvokableIdArr: string[],
  ) {
    var isMatch = false;
    invokableList?.forEach(invokable => {
      if (
        !(usedInvokableIdArr && usedInvokableIdArr.indexOf(invokable.Id) > -1)
      ) {
        if (!isMatch) {
          //匹配到下级执行器
          if (invokable.Id == invId && invokable.InvId) {
            var newUsedInvokableIdArr = [...usedInvokableIdArr, invokable.Id];

            var invIdArr = invokable.InvId.split(',');
            if (invIdArr.indexOf(invokableId) > -1) {
              isMatch = true;
            }
            //没匹配到就让下级执行器继续匹配
            else {
              invIdArr.forEach(id => {
                if (!isMatch) {
                  isMatch = this.ValidateInvokableLineMatch(
                    allinvokableList,
                    allinvokableList,
                    invokableId,
                    id,
                    newUsedInvokableIdArr,
                  );
                }
              });
            }
          }
        }
        //没有匹配到就用原参数继续匹配
        if (!isMatch) {
          if (invokable?.SubItems) {
            isMatch = this.ValidateInvokableLineMatch(
              allinvokableList,
              invokable?.SubItems,
              invokableId,
              invId,
              usedInvokableIdArr,
            );
          }
        }
      }
    });
    return isMatch;
  }

  //#endregion

  //验证数据
  public Validate(updateObj): Array<ErrorEntity> {
    var currentThis = this;

    var errorList = new Array<ErrorEntity>();
    var pageList = deserializeArray(CWPage, updateObj.coursewareContent, {
      typeMaps: TypeMapHelper.CommonTypeMap,
    });

    //业务校验
    pageList.forEach(function(page, pageIndex) {
      //校验元素
      page.Elements?.forEach(element => {
        var msg = element.Validate();
        if (msg && msg.length > 0) {
          var errorEntity = new ErrorEntity();
          errorEntity.pageIndex = pageIndex + 1;
          errorEntity.pageName = page.Name ? page.Name : '-';
          errorEntity.elementsName = element.Name ? element.Name : '-';
          errorEntity.logicObjName = '-';
          errorEntity.errMsg = msg;
          errorList.push(errorEntity);
        }
        //校验触发器
        element?.Triggers?.forEach(trigger => {
          var msg = trigger.Validate();
          if (msg && msg.length > 0) {
            var errorEntity = new ErrorEntity();
            errorEntity.pageIndex = pageIndex + 1;
            errorEntity.pageName = page.Name ? page.Name : '-';
            errorEntity.elementsName = element.Name ? element.Name : '-';
            errorEntity.logicObjName = trigger.DisplayNameWithOwnerName
              ? trigger.DisplayNameWithOwnerName
              : '-';
            errorEntity.errMsg = msg;
            errorList.push(errorEntity);
          }
        });
      });

      //校验执行器、函数、函数里的执行器
      page.Invokables?.forEach(invokable => {
        var resultList = currentThis.ValidateInvokable(
          invokable,
          pageIndex,
          page.Name,
        );
        if (resultList.length > 0) {
          errorList.push(...resultList);
        }
      });
    });

    console.log('权限', CacheHelper.UserInfo?.permission);
    //全局校验，根据规则校验
    //1.执行器不允许循环调用(只支持验证执行器与执行器循环直连)
    if (CacheHelper.UserInfo?.permission?.indexOf('LOGICLOOPLINK') == -1) {
      pageList.forEach(function(page, pageIndex) {
        if (page.Invokables) {
          var resultList = currentThis.ValidateInvokableLine(
            page.Invokables,
            page.Invokables,
            pageIndex,
            page.Name,
          );
          if (resultList.length > 0) {
            errorList.push(...resultList);
          }
        }
      });
    }

    //生成对象索引，为绑定Table使用
    errorList.map((item, i) => {
      item.errorIndex = i + 1;
    });

    return errorList;
  }
}

import WebSqlHelper from './webSqlHelper';
import { message } from 'antd';

const cacheDbName = 'cwCacheDb';
const maxCacheCount = [20, 10];
const tableName = 'cwSaveHis';

export default class CWCacheHelper {
  static db = null;

  static tryOpenCreateDb() {
    CWCacheHelper.db = WebSqlHelper.openDb(cacheDbName);
    CWCacheHelper.createTable();
  }

  static createTable() {
    WebSqlHelper.createTable(CWCacheHelper.db, tableName, [
      'cwId varchar(255)',
      'type int',
      'content longtext',
      'desc varchar(255)',
      'save_time bigint',
    ]);
  }

  static getSaveLogs(
    cwId: string,
    type: number = 0,
    callback?: (result: any[]) => void,
  ) {
    WebSqlHelper.findValues(
      CWCacheHelper.db,
      tableName,
      ['cwId', 'type', 'desc', 'save_time'],
      ['cwId', 'type'],
      [cwId, type],
      r => callback?.(Array.from(r.rows)),
    );
  }

  static getSaveLogDetail(
    cwId: string,
    type: number,
    save_time: Date,
    callback?: (result: any[]) => void,
  ) {
    WebSqlHelper.findRows(
      CWCacheHelper.db,
      tableName,
      ['cwId', 'type', 'save_time'],
      [cwId, type, Number(save_time)],
      r => callback?.(Array.from(r.rows)),
    );
  }
  static addSaveLog(
    cwId: string,
    type: number,
    content: string,
    desc: string,
    save_time: Date,
    callback?: (result: any[]) => void,
  ) {
    WebSqlHelper.addRow(
      CWCacheHelper.db,
      tableName,
      ['cwId', 'type', 'content', 'desc', 'save_time'],
      [cwId, type, content, desc, Number(save_time)],
      () => CWCacheHelper.clearSurplusLogs(cwId, type, callback),
    );
  }

  static delSaveLog(
    cwId: string,
    type: number,
    save_time: Date,
    callback?: (result: any[]) => void,
  ) {
    WebSqlHelper.delRows(
      CWCacheHelper.db,
      tableName,
      ['cwId', 'type', 'save_time'],
      [cwId, type, Number(save_time)],
      callback,
    );
  }

  static clearSaveLogs(
    cwId: string,
    type: number,
    callback?: (result: any[]) => void,
  ) {
    WebSqlHelper.delRows(
      CWCacheHelper.db,
      tableName,
      ['cwId', 'type'],
      [cwId, type],
      callback,
    );
  }

  static setDesc(cwId: string, time: Date, desc: string) {
    WebSqlHelper.updateRows(
      CWCacheHelper.db,
      tableName,
      ['desc'],
      [desc],
      ['cwId', 'save_time'],
      [cwId, Number(time)],
      null,
    );
  }

  static clearSurplusLogs(
    cwId: string,
    type: number = 0,
    callback?: (result: any[]) => void,
  ) {
    CWCacheHelper.getSaveLogs(cwId, type, async rows => {
      if (rows.length <= maxCacheCount[type]) callback?.(rows);
      else {
        var needdel = true;
        // if (type == 0) {
        //   needdel = confirm(
        //     `手动缓存已超出${maxCacheCount[0]}条，是否删除多余记录`,
        //   );
        //   // await MessageBox.msgbox({
        //   //   title: '缓存已满',
        //   //   message: `手动缓存已超出${maxCacheCount[0]}条，是否删除多余记录`,
        //   //   showCancelButton: true,
        //   //   confirmButtonText: '删除',
        //   // }).then(action => {
        //   //   needdel = String(action) == 'confirm';
        //   // });
        // }
        if (needdel) {
          var sortedRows = rows.sort(x => x.save_time);
          for (var i = 0; i < rows.length - maxCacheCount[type]; i++) {
            WebSqlHelper.delRows(
              CWCacheHelper.db,
              tableName,
              ['cwId', 'save_time'],
              [sortedRows[i].cwId, sortedRows[i].save_time],
            );
          }
        }
        if (callback) CWCacheHelper.getSaveLogs(cwId, type, callback);
      }
    });
  }
}

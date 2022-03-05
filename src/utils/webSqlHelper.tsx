export default class WebSqlHelper {
  static dbErrorCallback(error) {
    console.error('error:' + error.message);
  }

  static openDb(dbName: string, desc: string = '') {
    var db = (window as any).openDatabase(dbName, '1.0', desc, 1);
    return db;
  }

  static query(
    db: any,
    sql: string,
    value: any,
    callback?: (result: any) => void,
  ) {
    if (sql && db) {
      db.transaction(function(tx) {
        tx.executeSql(
          sql,
          value,
          function(tx, rs) {
            callback?.(rs);
          },
          WebSqlHelper.dbErrorCallback,
        );
      });
    }
  }

  static createTable(
    db: any,
    tbName: string,
    propNames: string[],
    callback?: (result: any) => void,
  ) {
    if (db && tbName && propNames && propNames.length > 0) {
      var sql = `create table if not exists ${tbName}(${propNames.join(',')})`;
      WebSqlHelper.query(db, sql, callback);
    }
  }

  static dropTable(db: any, tbName: string, callback?: (result: any) => void) {
    if (db && tbName) {
      var sql = `drop table ${tbName}`;
      WebSqlHelper.query(db, sql, callback);
    }
  }

  static addRow(
    db: any,
    tbName: string,
    propNames: string[],
    values: any[],
    callback?: (result: any) => void,
  ) {
    if (
      db &&
      tbName &&
      propNames &&
      propNames.length > 0 &&
      values &&
      values.length == propNames.length
    ) {
      var sql = `INSERT INTO ${tbName}(${propNames.join(
        ',',
      )}) VALUES (${values.map(x => '?').join(',')})`;
      WebSqlHelper.query(db, sql, values, callback);
    }
  }

  static findRows(
    db: any,
    tbName: string,
    propNames: string[],
    values: any[],
    callback: (result: any) => void,
  ) {
    if (
      db &&
      tbName &&
      propNames &&
      propNames.length > 0 &&
      values &&
      values.length == propNames.length
    ) {
      var sql = `SELECT * FROM ${tbName} WHERE ${propNames
        .map(x => x.concat(' = ?'))
        .join(' AND ')}`;
      WebSqlHelper.query(db, sql, values, callback);
    }
  }

  static findValues(
    db: any,
    tbName: string,
    selectpropNames: string[],
    wherepropNames: string[],
    wherevalues: any[],
    callback: (result: any) => void,
  ) {
    if (
      db &&
      tbName &&
      selectpropNames &&
      selectpropNames.length > 0 &&
      wherepropNames &&
      wherepropNames.length > 0 &&
      wherevalues &&
      wherevalues.length == wherepropNames.length
    ) {
      var sql = `SELECT ${selectpropNames.join(
        ',',
      )} FROM ${tbName} WHERE ${wherepropNames
        .map(x => x.concat(' = ?'))
        .join(' AND ')}`;
      WebSqlHelper.query(db, sql, wherevalues, callback);
    }
  }

  static delRows(
    db: any,
    tbName: string,
    propNames: string[],
    values: any[],
    callback?: (result: any) => void,
  ) {
    if (
      db &&
      tbName &&
      propNames &&
      propNames.length > 0 &&
      values &&
      values.length == propNames.length
    ) {
      var sql = `DELETE FROM ${tbName} WHERE ${propNames
        .map(x => x.concat(' = ?'))
        .join(' AND ')}`;
      WebSqlHelper.query(db, sql, values, callback);
    }
  }

  static updateRows(
    db: any,
    tbName: string,
    updatepropNames: string[],
    updatevalues: any[],
    wherepropNames: string[],
    wherevalues: any[],
    callback?: (result: any) => void,
  ) {
    if (
      db &&
      tbName &&
      updatepropNames &&
      updatepropNames.length > 0 &&
      updatevalues &&
      updatevalues.length == updatepropNames.length &&
      wherepropNames &&
      wherepropNames.length > 0 &&
      wherevalues &&
      wherevalues.length == wherepropNames.length
    ) {
      var sql = `UPDATE ${tbName} SET ${updatepropNames
        .map(x => x.concat(' = ?'))
        .join(' ')} WHERE ${wherepropNames
        .map(x => x.concat(' = ?'))
        .join(' AND ')}`;
      WebSqlHelper.query(db, sql, [...updatevalues, ...wherevalues], callback);
    }
  }
}

export default class TimerHelper {
  public static stringToDate(timestamp: number) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  }

  public static stringToDateNoTime(timestamp: number) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    return Y + M + D;
  }
}

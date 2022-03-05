function parseSearch(search: string): any {
  var pairs = search.slice(1).split('&');

  var result = {};
  pairs.forEach(function(pair) {
    if (pair && pair.indexOf('=') !== -1) {
      let pairArray = pair.split('=');
      //兼容写法
      result[pairArray[0]] = result[
        pairArray[0].toLocaleLowerCase()
      ] = decodeURIComponent(pairArray[1] || '');
    }
  });

  return JSON.parse(JSON.stringify(result));
}

export const search = parseSearch(location.search);

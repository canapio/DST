
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

var str = '11 11 111 1111 12 21 1 1 1 11111111';
console.log(str.replaceAll('11', '22'));


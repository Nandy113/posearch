function stringManipulation(index, filterValues, queryObject) {
  var indexOfChar = queryObject.filters[index].indexOf("(");
  filterValues[index] = queryObject.filters[index].substring(0, indexOfChar) + " in " + queryObject.filters[index].substring(indexOfChar);
  filterValues[index] = filterValues[index].substring(0, indexOfChar + 5) + "'" + filterValues[index].substring(indexOfChar + 5);
  filterValues[index] = filterValues[index].substring(0, filterValues[index].length - 1) + "'" + filterValues[index].substring(filterValues[index].length - 1);
  filterValues[index] = filterValues[index].split(",").join("','");
  filterValues[index] = "p.purchaseorders." + filterValues[index];

  return filterValues[index];
}

module.exports = { stringManipulation }


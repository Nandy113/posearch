const CosmosClient = require("@azure/cosmos").CosmosClient;

const stringManipulation = require("./stringManipulation")
const config = require("./config");
const url = require("url");
const model = require("./model.json");
const endpoint = config.endpoint;
const key = config.key;
const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/purchaseorders/number"] };
const https = require("https");
const { items } = require("./config");
const { promises } = require("fs");

const options = {
    endpoint: endpoint,
    key: key,
    userAgentSuffix: "CosmosDBJavascriptQuickstart",
    agent: new https.Agent({
        rejectUnauthorized: false,
    }),
};

const client = new CosmosClient(options);

async function getFilteredData(req) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject.fields);
    var isFilter = queryObject.filters;
    var select = queryObject.fields;
    // @ts-ignore
    var nameArr = select.split(',');
    var keyArray = Object.keys(model.purchaseorders);
    var keyElementIndex = 0;

    for (var keyIndex = 0; keyIndex < nameArr.length; keyIndex++) {
        while (keyElementIndex < keyArray.length) {
            if (keyArray[keyElementIndex] === nameArr[keyIndex]) {
                nameArr[keyIndex] = 'p.purchaseorders.' + nameArr[keyIndex];
                keyElementIndex++;
                break;
            } else {
                nameArr[keyIndex] = 'p.purchaseorders.items.' + nameArr[keyIndex];
                keyElementIndex++;
                break;;
            }
        }
    }
    var where = "";
    var filterValues = ["0"];
    var i;

    if (typeof isFilter !== 'undefined') {
        var isArray = Array.isArray(queryObject.filters);
        if (!isArray) {
            var arr = [];
            arr.push(queryObject.filters);
            // @ts-ignore
            queryObject.filters = arr;
            stringManipulation.stringManipulation(0, filterValues, queryObject);
            where = filterValues[0];
        }

        if (isArray) {
            for (var index = 0; index < queryObject.filters.length; index++) {
                stringManipulation.stringManipulation(index, filterValues, queryObject);
            }
            var i;
            for (i = 0; i < queryObject.filters.length; i++) {
                if (i !== (queryObject.filters.length - 1)) {
                    where = where + filterValues[i] + " AND ";
                } else {
                    where = where + filterValues[i];
                }
            }
        }

        const querySpec = {
            query: `SELECT ${nameArr} FROM PO p WHERE ${where}`,
        };
        console.log("Query1 :", querySpec)
        const { resources: results } = await client
            .database(databaseId)
            .container(containerId)
            .items.query(querySpec)
            .fetchAll();
        return results;
    }

    if (typeof isFilter === 'undefined') {
        const querySpec = {
            query: `SELECT ${nameArr} FROM PO p`
        };
        console.log("Query2 :", querySpec)
        const { resources: results } = await client
            .database(databaseId)
            .container(containerId)
            .items.query(querySpec)
            .fetchAll();
        return results;
    }
}

module.exports = { getFilteredData } 
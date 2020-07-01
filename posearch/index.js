const poFilter = require("./poFilter")

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  if (req.method == "GET") {
    // @ts-ignore
    let str = await poFilter.getFilteredData(req)
    context.res = {
      body: await str
    }
  }
};


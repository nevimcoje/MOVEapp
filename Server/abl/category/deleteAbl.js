const Ajv = require("ajv");
const ajv = new Ajv();
const categoryDao = require("../../dao/category-dao.js");
const activityDao = require("../../dao/activity-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check there is no activity related to given category
    const activityList = activityDao.listByCategoryId(reqParams.id);
    if (activityList.length) {
      res.status(400).json({
        code: "categoryWithActivity",
        message: "Please delete all activities assigned to this category before you can delete it.",
        validationError: ajv.errors,
      });
      return;
    }

    // remove transaction from persistant storage
    categoryDao.remove(reqParams.id);

    // return dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
}

module.exports = DeleteAbl;

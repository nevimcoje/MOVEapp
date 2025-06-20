const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const activityDao = require("../../dao/activity-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Zadaný vstup není platný.",
        validationError: ajv.errors,
      });
      return;
    }

    // loads activity by its ID
    const activity = activityDao.get(reqParams.id);
    if (!activity) {
      res.status(404).json({
        code: "activityNotFound",
        message: `Aktivita s ID ${reqParams.id} nebyla nalezena.`,
      });
      return;
    }

    // get related category
    const category = categoryDao.get(activity.categoryId);
    activity.category = category;

    // return dtoOut
    res.json(activity);
  } catch (e) {
    res.status(500).json({ message: "Chyba serveru: " + e.message });
  }
}

module.exports = GetAbl;

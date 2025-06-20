const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const activityDao = require("../../dao/activity-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    type: { type: "string", maxLength: 100 },
    duration: { type: "number", minimum: 0.1 },
    date: { type: "string", format: "date" },
    note: { type: "string", maxLength: 200 },
    categoryId: { type: "string" },
  },
  required: ["type", "duration", "date", "categoryId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let activity = req.body;

    // validate input
    const valid = ajv.validate(schema, activity);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Zadaná aktivita není ve správném formátu.",
        validationError: ajv.errors,
      });
      return;
    }

    // date validation
    const inputDate = new Date(activity.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignorujeme čas
    if (inputDate > today) {
      res.status(400).json({
        code: "invalidDate",
        message: "Datum aktivity nemůže být v budoucnosti.",
      });
      return;
    }

    // check if the category exists
    const category = await categoryDao.get(activity.categoryId);
    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `Kategorie s ID '${activity.categoryId}' neexistuje.`,
      });
      return;
    }

    // ssave activity
    activity = activityDao.create(activity);
    activity.category = category;

 
    res.json(activity);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Interní chyba serveru: " + e.message });
  }
}

module.exports = CreateAbl;

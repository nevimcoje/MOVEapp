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
    type: { type: "string" },  
    duration: { type: "number" },  
    date: { type: "string", format: "date" },
    note: { type: "string" },
    categoryId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let activity = req.body;

    // validate input
    const valid = ajv.validate(schema, activity);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Zadaný vstup není platný.",
        validationError: ajv.errors,
      });
      return;
    }

    // validate date (must be todays or in past)
    if (new Date(activity.date) >= new Date()) {
      res.status(400).json({
        code: "invalidDate",
        message: `Datum musí být dnešní nebo v minulosti`,
        validationError: ajv.errors,
      });
      return;
    }

    // update activity in database
    const updatedActivity = activityDao.update(activity);

    // check if categoryID exists
    const category = categoryDao.get(updatedActivity.categoryId);
    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `Kategorie s ID ${updatedActivity.categoryId} neexistuje`,
        validationError: ajv.errors,
      });
      return;
    }

    // check if activityID exists
    if (!updatedActivity) {
      res.status(404).json({
        code: "activityNotFound",
        message: `Aktivita s ID ${activity.id} nebyla nalezena`,
      });
      return;
    }

    // assign activity to category
    updatedActivity.category = category;

    // return dtoOut
    res.json(updatedActivity);
  } catch (e) {
    res.status(500).json({ message: "Chyba serveru: " + e.message });
  }
}

module.exports = UpdateAbl;

const Ajv = require("ajv");
const ajv = new Ajv();

const activityDao = require("../../dao/activity-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
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
        message: "Zadaný vstup není platný.",
        validationError: ajv.errors,
      });
      return;
    }

    // remove activity
    const result = activityDao.remove(reqParams.id);


    // return empty message
    res.json({});
  } catch (e) {
    res.status(500).json({ message: "Chyba serveru: " + e.message });
  }
}

module.exports = DeleteAbl;

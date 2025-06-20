const Ajv = require("ajv");
const ajv = new Ajv(); // Inicializace Ajv

// schema for validation
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"], // just one requied name
  additionalProperties: false,
};

const categoryDao = require("../../dao/category-dao.js");

async function CreateAbl(req, res) {
  try {
    let category = req.body;

    // Input validation
    const valid = ajv.validate(schema, category);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Zadaná kategorie není ve správném formátu.",
        validationError: ajv.errors,
      });
      return;
    }

    // store category to a storage
    try {
      category = categoryDao.create(category);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }

    // return dtoOut
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: "Chyba serveru: " + e.message });
  }
}

module.exports = CreateAbl;

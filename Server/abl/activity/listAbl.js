const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const activityDao = require("../../dao/activity-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    month: { type: "integer" },
    year: { type: "integer" }
  },
  required: ["month", "year"],
  additionalProperties: true,
};

async function ListAbl(req, res) {
  try {
    const rawFilter = req.query?.month ? req.query : req.body;

    const filter = {
      ...rawFilter,
      month: parseInt(rawFilter.month),
      year: parseInt(rawFilter.year)
    };

    const valid = ajv.validate(schema, filter);
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Zadaný vstup není platný.",
        validationError: ajv.errors,
      });
    }

    // Tady posíláme měsíc a rok do DAO, aby už tam proběhlo filtrování
    const activityList = activityDao.list({ month: filter.month, year: filter.year });

    // Už další filtrování neděláme, data jsou vyfiltrována v DAO
    const filteredList = activityList;

    const categoryMap = categoryDao.getCategoryMap();

    const enrichedList = filteredList.map((activity) => ({
      ...activity,
      category: categoryMap[activity.categoryId] || null,
    }));

    res.json({ itemList: enrichedList });
  } catch (e) {
    res.status(500).json({ message: "Chyba serveru: " + e.message });
  }
}

module.exports = ListAbl;

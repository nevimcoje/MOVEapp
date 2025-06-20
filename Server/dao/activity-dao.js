const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const activityFolderPath = path.join(
  __dirname,
  "storage",
  "activityList"
);

function get(activityId) {
  try {
    const filePath = path.join(activityFolderPath, `${activityId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadActivity", message: error.message };
  }
}

function create(activity) {
  try {
    activity.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(activityFolderPath, `${activity.id}.json`);
    const fileData = JSON.stringify(activity);
    fs.writeFileSync(filePath, fileData, "utf8");
    return activity;
  } catch (error) {
    throw { code: "failedToCreateActivity", message: error.message };
  }
}

function update(activity) {
  try {
    const currentActivity = get(activity.id);
    if (!currentActivity) return null;
    const newActivity = { ...currentActivity, ...activity };
    const filePath = path.join(activityFolderPath, `${activity.id}.json`);
    const fileData = JSON.stringify(newActivity);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newActivity;
  } catch (error) {
    throw { code: "failedToUpdateActivity", message: error.message };
  }
}

function remove(activityId) {
  try {
    const filePath = path.join(activityFolderPath, `${activityId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveActivity", message: error.message };
  }
}

function list(filter = {}) {
  try {
    const files = fs.readdirSync(activityFolderPath);
    let activityList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(activityFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });

    if (filter.month !== undefined && filter.year !== undefined) {
      activityList = activityList.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() + 1 === filter.month && d.getFullYear() === filter.year;
      });
    }

    activityList.sort((a, b) => new Date(a.date) - new Date(b.date));

    return activityList;
  } catch (error) {
    throw { code: "failedToListActivities", message: error.message };
  }
}

function listByCategoryId(categoryId) {
  const activityList = list();
  return activityList.filter((item) => item.categoryId === categoryId);
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByCategoryId,
};

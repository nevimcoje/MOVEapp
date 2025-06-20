import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";

function Dashboard() {
  const { selectedDate, setTotalHours } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load activities for the selected month
  useEffect(() => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    fetch(`/activity/list?month=${month}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        const items = data.itemList || [];
        setActivities(items);
        const total = items.reduce((acc, a) => acc + (a.duration || 0), 0);
        setTotalHours(total);
      })
      .catch(err => console.error("Error loading activities:", err));
  }, [selectedDate, setTotalHours]);

  // Load categories for editing/deleting
  useEffect(() => {
    fetch("/category/list")
      .then(res => res.json())
      .then(data => setCategories(data.itemList || []))
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  // Delete category with confirmation
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch("/category/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryId }),
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Cannot delete category.");
        return;
      }
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch {
      alert("Error deleting category.");
    }
  };

  // Edit category name
  const handleEditCategory = async (category) => {
    const newName = prompt("Enter new category name:", category.name);
    if (!newName || newName.trim() === "" || newName === category.name) return;

    try {
      const res = await fetch("/category/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: category.id, name: newName }),
      });

      const updated = await res.json();

      if (!res.ok) {
        alert(updated.message || "Failed to update category.");
        return;
      }

      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch {
      alert("Error updating category.");
    }
  };

  // Delete activity with confirmation
  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    try {
      const res = await fetch("/activity/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activityId }),
      });

      if (!res.ok) {
        alert("Failed to delete activity.");
        return;
      }

      setActivities(prev => prev.filter(a => a.id !== activityId));
    } catch {
      alert("Error deleting activity.");
    }
  };

  // Edit activity duration
  const handleEditActivity = async (activity) => {
    const newDuration = prompt("Enter new duration (in hours):", activity.duration);
    if (!newDuration || isNaN(newDuration)) return;

    try {
      const res = await fetch("/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activity, duration: Number(newDuration) }),
      });

      const updated = await res.json();

      if (!res.ok) {
        alert(updated.message || "Failed to update activity.");
        return;
      }

      setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch {
      alert("Error updating activity.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h1>Dashboard</h1>

      <p>
        <strong>Selected Month:</strong>{" "}
        {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>

      <p>
        <strong>Total Hours:</strong>{" "}
        {activities.reduce((sum, a) => sum + (a.duration || 0), 0)} h
      </p>

      {/* List categories with their activities */}
      {categories.map(category => {
        const acts = activities.filter(a => a.category?.id === category.id);

        return (
          <div key={category.id} className="category-block" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ margin: 0 }}>{category.name}</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <FaEdit onClick={() => handleEditCategory(category)} title="Edit" style={{ cursor: "pointer", fontSize: "16px" }} />
                <FaTrash onClick={() => handleDeleteCategory(category.id)} title="Delete" style={{ color: "red", cursor: "pointer", fontSize: "16px" }} />
              </div>
            </div>

            {acts.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "gray" }}>No activities</p>
            ) : (
              <ul>
                {acts.map(activity => (
                  <li key={activity.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span>{activity.type}</span> — <span>{activity.date}</span> — <span>{activity.duration} h</span>
                    {activity.note && <em> — {activity.note}</em>}
                    <FaEdit onClick={() => handleEditActivity(activity)} title="Edit activity" style={{ cursor: "pointer", fontSize: "14px", marginLeft: "10px" }} />
                    <FaTrash onClick={() => handleDeleteActivity(activity.id)} title="Delete activity" style={{ color: "red", cursor: "pointer", fontSize: "14px" }} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* Activities without a category */}
      {activities.some(a => !a.category) && (
        <div className="category-block">
          <h3>No Category</h3>
          <ul>
            {activities.filter(a => !a.category).map(activity => (
              <li key={activity.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span>{activity.type}</span> — <span>{activity.date}</span> — <span>{activity.duration} h</span>
                {activity.note && <em> — {activity.note}</em>}
                <FaEdit onClick={() => handleEditActivity(activity)} title="Edit activity" style={{ cursor: "pointer", fontSize: "14px", marginLeft: "10px" }} />
                <FaTrash onClick={() => handleDeleteActivity(activity.id)} title="Delete activity" style={{ color: "red", cursor: "pointer", fontSize: "14px" }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

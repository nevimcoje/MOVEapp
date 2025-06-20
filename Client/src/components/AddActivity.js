import React, { useState, useEffect } from "react";

function AddActivity({ onActivityAdded }) {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/category/list")
      .then((res) => res.json())
      .then((data) => setCategories(data.itemList || []))
      .catch((err) => console.error("Chyba při načítání kategorií:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Odesílám novou aktivitu:", {
      type,
      duration: parseFloat(duration),
      date,
      categoryId,
      note,
    });
  
    try {
      const res = await fetch("/activity/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          duration: parseFloat(duration),
          date,
          categoryId,
          note,
        }),
      });
  
      if (!res.ok) throw new Error("Chyba při přidávání aktivity");
  
      const newActivity = await res.json();
      setType("");
      setDuration("");
      setDate("");
      setCategoryId("");
      setNote("");
      setError("");
      if (onActivityAdded) onActivityAdded(newActivity);
    } catch (err) {
      setError("Nepodařilo se přidat aktivitu.");
      console.error(err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>

      <input
        type="text"
        value={type}
        placeholder="Name"
        onChange={(e) => setType(e.target.value)}
        required
      />
      <input
        type="number"
        value={duration}
        placeholder="Time"
        step="0.1"
        min="0.1"
        onChange={(e) => setDuration(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
        maxLength={200}
        rows={3}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />

      <button type="submit">Přidat</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default AddActivity;

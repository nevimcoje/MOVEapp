import React, { useState } from "react";

function AddCategory({ onCategoryAdded }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      setError("Název nesmí být prázdný.");
      return;
    }

    try {
      const res = await fetch("/category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Chyba při přidávání");

      // Úspěch – zavoláme callback a resetujeme
      setName("");
      setError("");
      if (onCategoryAdded) onCategoryAdded();
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se přidat kategorii.");
    }
  };

  return (
    <div>
      <label htmlFor="category-name">Název kategorie:</label>
      <input
        id="category-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Zadej název"
        style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "10px" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleAdd}>Přidat</button>
    </div>
  );
}

export default AddCategory;

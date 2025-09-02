import React, { useState } from 'react';

const AddComment = ({ onAdd, placeholder }) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      <input
        style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button onClick={handleAdd} style={{ padding: "8px 12px" }}>
        Post
      </button>
    </div>
  );
};

export default AddComment;

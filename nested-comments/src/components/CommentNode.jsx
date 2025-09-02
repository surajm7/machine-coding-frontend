import React, { useState } from 'react';
import AddComment from './AddComment';

const CommentNode = ({ node, onReply, onLike, onEdit, depth }) => {
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);

  const handleEditSave = () => {
    if (!editText.trim()) return;
    onEdit(node.id, editText.trim());
    setIsEditing(false);
  };

  return (
    <div style={{
      marginLeft: depth * 20,
      border: "1px solid #eee",
      padding: 10,
      borderRadius: 8,
      marginBottom: 8
    }}>
      {/* Display comment or edit input */}
      <div>
        <strong>{node.author}:</strong>{" "}
        {isEditing ? (
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ padding: 4, borderRadius: 4, border: "1px solid #ccc", width: "80%" }}
          />
        ) : (
          node.text
        )}
      </div>

      {/* Action buttons */}
      <div style={{ fontSize: 12, marginTop: 4, display: "flex", gap: 10 }}>
        <button onClick={() => onLike(node.id)}>👍 {node.likes}</button>
        <button onClick={() => setShowReply((s) => !s)}>
          {showReply ? "Cancel" : "Reply"}
        </button>
        <button onClick={() => isEditing ? handleEditSave() : setIsEditing(true)}>
          {isEditing ? "Save" : "Edit"}
        </button>
        {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
      </div>

      {/* Reply box */}
      {showReply && (
        <div style={{ marginTop: 6 }}>
          <AddComment
            onAdd={(text) => { onReply(node.id, text); setShowReply(false); }}
            placeholder="Write a reply"
          />
        </div>
      )}

      {/* Render child comments recursively */}
      {node.children.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {node.children.map((child) => (
            <CommentNode
              key={child.id}
              node={child}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentNode;

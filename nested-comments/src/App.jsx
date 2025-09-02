import React, { useState } from 'react';
import './App.css';
import AddComment from './components/AddComment';
import CommentNode from './components/CommentNode';

function App() {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "This demo supports nested replies!",
      author: "Ava",
      likes: 2,
      children: [
        {
          id: 2,
          text: "Nice – works recursively.",
          author: "Ben",
          likes: 1,
          children: [],
        },
      ],
    },
  ]);

  // Add comment or reply
  const addComment = (parentId, text) => {
    const newComment = {
      id: Date.now(),
      text,
      author: "You",
      likes: 0,
      children: [],
    };

    if (parentId == null) {
      setComments((c) => [...c, newComment]); // root comment
      return;
    }

    const addRecursively = (nodes) =>
      nodes.map((n) =>
        n.id === parentId
          ? { ...n, children: [...n.children, newComment] }
          : { ...n, children: addRecursively(n.children) }
      );

    setComments((c) => addRecursively(c));
  };

  // Like a comment
  const toggleLike = (id) => {
    const likeRecursively = (nodes) =>
      nodes.map((n) =>
        n.id === id
          ? { ...n, likes: n.likes + 1 }
          : { ...n, children: likeRecursively(n.children) }
      );

    setComments((c) => likeRecursively(c));
  };

  // Edit a comment
  const editComment = (id, newText) => {
    const editRecursively = (nodes) =>
      nodes.map((n) =>
        n.id === id
          ? { ...n, text: newText }
          : { ...n, children: editRecursively(n.children) }
      );

    setComments((c) => editRecursively(c));
  };

  return (
    <div className="App" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Nested Comments Demo</h2>

      {/* Add root comment */}
      <AddComment
        onAdd={(text) => addComment(null, text)}
        placeholder="Add a root comment"
      />

      {/* Render comments recursively */}
      <div style={{ marginTop: 20 }}>
        {comments.map((c) => (
          <CommentNode
            key={c.id}
            node={c}
            onReply={addComment}
            onLike={toggleLike}
            onEdit={editComment}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";

function FileNode({ node }) {
  const [expanded, setExpanded] = useState(false);

  if (node.type === "file") {
    return <div style={{ paddingLeft: "20px" }}> {node.name}</div>;
  }

  return (
    <div style={{ paddingLeft: "20px" }}>
      <div
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "-" : "+"} {node.name}
      </div>
      {expanded &&
        node.children?.map((child, idx) => (
          <FileNode key={idx} node={child} />
        ))}
    </div>
  );
}

export default function FileExplorer({ data }) {
  return (
    <div style={{  fontSize: "14px" }}>
      <FileNode node={data} />
    </div>
  );
}

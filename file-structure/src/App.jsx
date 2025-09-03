import FileExplorer from "./FileExplorer";

const fileStructure = {
  name: "root",
  type: "folder",
  children: [
    { name: "index.html", type: "file" },
    { name: "App.js", type: "file" },
    {
      name: "src",
      type: "folder",
      children: [
        { name: "main.jsx", type: "file" },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "Header.jsx", type: "file" },
            { name: "Footer.jsx", type: "file" },
          ],
        },
      ],
    },
  ],
};

export default function App() {
  return (
    <div style={{ margin: "20px" }}>
      <h2>File Explorer</h2>
      <FileExplorer data={fileStructure} />
    </div>
  );
}

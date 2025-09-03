// import { useState } from "react";

// export default function Pagination({ itemsPerPage, data }) {
//   const [page, setPage] = useState(1);
//   const totalPages = Math.ceil(data.length / itemsPerPage);

//   const start = (page - 1) * itemsPerPage;
//   const currentData = data.slice(start, start + itemsPerPage);

//   return (
//     <div style={{ padding: "20px" }}>
//       <ul style={{ padding: 0 }}>
//         {currentData.map((item, idx) => (
//           <li key={idx} style={{ padding: "6px 0", borderBottom: "1px solid #ddd" }}>
//             {item}
//           </li>
//         ))}
//       </ul>

//       {/* Pagination Controls */}
//       <div style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center" }}>
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           style={{
//             padding: "6px 12px",
//             cursor: page === 1 ? "not-allowed" : "pointer",
//           }}
//         >
//           Prev
//         </button>

//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//           <button
//             key={num}
//             onClick={() => setPage(num)}
//             style={{
//               padding: "6px 12px",
//               fontWeight: page === num ? "bold" : "normal",
//               background: page === num ? "#007bff" : "white",
//               color: page === num ? "white" : "black",
//               border: "1px solid #ddd",
//               cursor: "pointer",
//             }}
//           >
//             {num}
//           </button>
//         ))}

//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//           style={{
//             padding: "6px 12px",
//             cursor: page === totalPages ? "not-allowed" : "pointer",
//           }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function Pagination({ itemsPerPage }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const start = (page - 1) * itemsPerPage;
  const currentData = data.slice(start, start + itemsPerPage);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>🛒 Products</h2>

      {/* Product Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {currentData.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img src={item.image} alt={item.title} style={{ height: "120px", objectFit: "contain" }} />
            <h4 style={{ fontSize: "14px", margin: "10px 0" }}>{item.title}</h4>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "8px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            style={{
              padding: "6px 12px",
              fontWeight: page === num ? "bold" : "normal",
              background: page === num ? "#007bff" : "white",
              color: page === num ? "white" : "black",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {num}
          </button>
        ))}
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

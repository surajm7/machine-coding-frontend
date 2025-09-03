import Pagination from "./Pagination";

// export default function App() {
//   const data = Array.from({ length: 48 }, (_, i) => `Item ${i + 1}`);

//   return (
//     <div>
//       <h2 style={{ textAlign: "center" }}>📄 Pagination Example</h2>
//       <Pagination itemsPerPage={10} data={data} />
//     </div>
//   );
// }


export default function App() {
  return (
    <div>
      <Pagination itemsPerPage={6} />
    </div>
  );
}

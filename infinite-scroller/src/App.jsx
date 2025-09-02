import React, { useEffect, useRef, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const ITEMS_PER_PAGE = 10;

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?_limit=${ITEMS_PER_PAGE}&_page=${page}`);
      const data = await response.json();
      setItems((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchItems();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);


  return (
    <div style={{ padding: "20px" }}>
      <h2>Infinite Scroll - API Data</h2>
      {items.map((item) => (
        <div key={item.id} style={{ padding: "10px", border: "1px solid #ccc" }}>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      <div ref={loaderRef} style={{ height: "20px" }}></div>
    </div>
  );
}

export default App;

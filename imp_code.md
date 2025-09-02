Data Source:
// mockData.js

const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));

const arr = Array.from({ length: 5 }, (_, i) => i + 1);
const arr = Array.from({ length: 5 }, (_, i) => ` Item ${i + 1}`);

console.log(arr); // [1, 2, 3, 4, 5]

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}?_limit=${ITEMS_PER_PAGE}&_page=${page}`);
      const data = await response.json();
      setItems((prev) => [...prev, ...data]);
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
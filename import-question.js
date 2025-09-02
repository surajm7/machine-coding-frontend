import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ------------------------------------------------------------
// XVFVPatterns – 6 mini-projects in one React file
// Patterns:
// 1) Infinite Scroll (IntersectionObserver + mock API)
// 2) Configurable Color Boxes (state-driven UI)
// 3) Posts with Comments (nested replies)
// 4) Progress Bar (animated with useEffect + setInterval)
// 5) Config-Driven Form (JSON → UI)
// 6) Ecommerce Filters (filters + URL sync)
// ------------------------------------------------------------



// ---------- 1) Infinite Scroll ----------
function InfiniteScrollDemo() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const PAGE_SIZE = 20;

  // Mock API that returns paginated items
  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate latency
    const start = pageNum * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const newItems = Array.from({ length: PAGE_SIZE }, (_, i) => ({
      id: start + i + 1,
      title: `Item #${start + i + 1}`,
      body: `This is a lazily loaded item with index ${start + i + 1}.`,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setHasMore(end < 200); // pretend total count = 200
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        const next = page + 1;
        setPage(next);
        fetchPage(next);
      }
    }, { rootMargin: "200px" });

    io.observe(el);
    return () => io.disconnect();
  }, [page, fetchPage, hasMore, loading]);

  return (
    <Section
      title="Infinite Scroll"
      right={<span className="text-sm text-gray-500">{items.length} items</span>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <Card key={it.id}>
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{it.title}</h3>
              <span className="text-xs text-gray-500">#{it.id}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{it.body}</p>
          </Card>
        ))}
      </div>
      {loading && (
        <div className="text-center text-sm text-gray-500 py-3">Loading…</div>
      )}
      <div ref={sentinelRef} className="h-6" />
      {!hasMore && (
        <div className="text-center text-sm text-gray-500 pt-2">No more items</div>
      )}
    </Section>
  );
}

// ---------- 2) Configurable Color Boxes ----------
function ColorBoxesDemo() {
  const palette = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#6b7280",
  ];

  const [boxes, setBoxes] = useState([
    { id: 1, color: palette[5], size: 100, radius: 16 },
  ]);

  const addBox = () =>
    setBoxes((b) => [
      ...b,
      { id: Date.now(), color: palette[Math.floor(Math.random() * palette.length)], size: 100, radius: 16 },
    ]);

  const updateBox = (id, patch) =>
    setBoxes((b) => b.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const removeBox = (id) => setBoxes((b) => b.filter((x) => x.id !== id));

  return (
    <Section
      title="Configurable Color Boxes"
      right={
        <button onClick={addBox} className="px-3 py-1.5 rounded-xl bg-black text-white text-sm">Add Box</button>
      }
    >
      <div className="flex flex-wrap gap-3">
        {boxes.map((b) => (
          <div key={b.id} className="border rounded-2xl p-3 w-full sm:w-[360px]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Box #{b.id}</span>
              <button onClick={() => removeBox(b.id)} className="text-xs text-red-600">Remove</button>
            </div>
            <div className="mt-3 flex gap-3">
              <div
                className="flex-shrink-0"
                style={{ width: b.size, height: b.size, background: b.color, borderRadius: b.radius }}
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {palette.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateBox(b.id, { color: c })}
                      className="w-6 h-6 rounded-md border"
                      style={{ background: c, outline: b.color === c ? "2px solid black" : "none" }}
                      title={c}
                    />
                  ))}
                </div>
                <label className="block text-xs text-gray-600">Size: {b.size}px</label>
                <input
                  type="range"
                  min={60}
                  max={200}
                  value={b.size}
                  onChange={(e) => updateBox(b.id, { size: Number(e.target.value) })}
                  className="w-full"
                />
                <label className="block text-xs text-gray-600">Radius: {b.radius}px</label>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={b.radius}
                  onChange={(e) => updateBox(b.id, { radius: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- 3) Posts with Comments (nested) ----------
function CommentsDemo() {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "This demo supports nested replies!",
      author: "Ava",
      likes: 2,
      children: [
        { id: 2, text: "Nice – works recursively.", author: "Ben", likes: 1, children: [] },
      ],
    },
  ]);

  const addComment = (parentId, text) => {
    const newNode = { id: Date.now(), text, author: "You", likes: 0, children: [] };

    const addRec = (nodes) =>
      nodes.map((n) => {
        if (n.id === parentId) {
          return { ...n, children: [...n.children, newNode] };
        }
        return { ...n, children: addRec(n.children) };
      });

    if (parentId == null) setComments((c) => [...c, newNode]);
    else setComments((c) => addRec(c));
  };

  const toggleLike = (id) => {
    const rec = (nodes) =>
      nodes.map((n) =>
        n.id === id ? { ...n, likes: n.likes + 1 } : { ...n, children: rec(n.children) }
      );
    setComments((c) => rec(c));
  };

  return (
    <Section title="Posts with Comments (Nested)">
      <AddComment onAdd={(t) => addComment(null, t)} placeholder="Add a root comment" />
      <div className="mt-4 space-y-3">
        {comments.map((c) => (
          <CommentNode key={c.id} node={c} onReply={addComment} onLike={toggleLike} depth={0} />
        ))}
      </div>
    </Section>
  );
}

function AddComment({ onAdd, placeholder = "Add a comment" }) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border rounded-xl px-3 py-2 text-sm"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            onAdd(text.trim());
            setText("");
          }
        }}
      />
      <button
        onClick={() => {
          if (text.trim()) {
            onAdd(text.trim());
            setText("");
          }
        }}
        className="px-3 py-2 rounded-xl bg-black text-white text-sm"
      >
        Post
      </button>
    </div>
  );
}

function CommentNode({ node, onReply, onLike, depth }) {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className="border rounded-2xl p-3" style={{ marginLeft: depth * 16 }}>
      <div className="text-sm"><span className="font-medium">{node.author}</span> · {node.text}</div>
      <div className="flex gap-3 text-xs text-gray-600 mt-2">
        <button onClick={() => onLike(node.id)}>👍 {node.likes}</button>
        <button onClick={() => setShowReply((s) => !s)}>{showReply ? "Cancel" : "Reply"}</button>
      </div>
      {showReply && (
        <div className="mt-2">
          <AddComment onAdd={(t) => { onReply(node.id, t); setShowReply(false); }} placeholder="Write a reply" />
        </div>
      )}
      <div className="mt-3 space-y-2">
        {node.children.map((ch) => (
          <CommentNode key={ch.id} node={ch} onReply={onReply} onLike={onLike} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}

// ---------- 4) Progress Bar (animated) ----------
function ProgressBarDemo() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(30); // ms interval
  const [step, setStep] = useState(1); // increment per tick

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProgress((p) => (p + step > 100 ? 100 : p + step));
    }, speed);
    return () => clearInterval(id);
  }, [running, speed, step]);

  return (
    <Section
      title="Progress Bar (Animated)"
      right={
        <div className="flex items-center gap-2">
          <Chip active={running} onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</Chip>
          <Chip onClick={() => { setProgress(0); setRunning(false); }}>Reset</Chip>
        </div>
      }
    >
      <div className="w-full h-4 rounded-xl bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-600">Speed (ms):</label>
          <input type="number" className="w-20 border rounded px-2 py-1" value={speed}
                 onChange={(e) => setSpeed(Math.max(5, Number(e.target.value) || 0))} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-600">Step:</label>
          <input type="number" className="w-16 border rounded px-2 py-1" value={step}
                 onChange={(e) => setStep(Math.max(1, Number(e.target.value) || 1))} />
        </div>
        <div className="ml-auto text-gray-700 font-medium">{progress}%</div>
      </div>
    </Section>
  );
}

// ---------- 5) Config-Driven Form (JSON → UI) ----------
const defaultSchema = {
  title: "Signup",
  fields: [
    { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Ada Lovelace" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "ada@example.com" },
    { name: "age", label: "Age", type: "number", min: 0, max: 120 },
    { name: "role", label: "Role", type: "select", options: ["Frontend", "Backend", "Fullstack"] },
    { name: "skills", label: "Skills", type: "checkbox-group", options: ["React", "Node", "TypeScript"] },
    { name: "newsletter", label: "Subscribe to newsletter", type: "checkbox" },
  ],
};

function ConfigFormDemo() {
  const [schemaText, setSchemaText] = useState(JSON.stringify(defaultSchema, null, 2));
  const [schema, setSchema] = useState(defaultSchema);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const applySchema = () => {
    try {
      const obj = JSON.parse(schemaText);
      setSchema(obj);
      setValues({});
      setErrors({});
    } catch (e) {
      alert("Invalid JSON schema");
    }
  };

  const setValue = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  const validate = () => {
    const err = {};
    schema.fields?.forEach((f) => {
      if (f.required && (values[f.name] == null || values[f.name] === "" || (Array.isArray(values[f.name]) && values[f.name].length === 0))) {
        err[f.name] = "Required";
      }
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Submitted! Check values panel.");
    }
  };

  return (
    <Section title="Config-Driven Form (JSON → UI)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Schema</h3>
            <button onClick={applySchema} className="px-3 py-1.5 rounded-xl bg-black text-white text-sm">Apply</button>
          </div>
          <textarea
            className="w-full h-72 border rounded-xl p-3 font-mono text-xs"
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
          />
        </Card>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-medium">{schema.title || "Form"}</h3>
            {schema.fields?.map((f) => (
              <Field key={f.name} f={f} value={values[f.name]} setValue={setValue} error={errors[f.name]} />
            ))}
            <button className="px-3 py-2 rounded-xl bg-black text-white text-sm">Submit</button>
          </form>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Values</h3>
          <pre className="text-xs bg-gray-50 rounded-xl p-3 overflow-auto">{JSON.stringify(values, null, 2)}</pre>
        </Card>
      </div>
    </Section>
  );
}

function Field({ f, value, setValue, error }) {
  const common = {
    id: f.name,
    name: f.name,
    required: f.required,
  };

  return (
    <div>
      {f.type !== "checkbox" && f.type !== "checkbox-group" && (
        <label htmlFor={f.name} className="block text-sm mb-1">{f.label}</label>
      )}
      {f.type === "text" || f.type === "email" || f.type === "number" ? (
        <input
          {...common}
          type={f.type}
          min={f.min}
          max={f.max}
          placeholder={f.placeholder}
          value={value ?? ""}
          onChange={(e) => setValue(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full border rounded-xl px-3 py-2 text-sm"
        />
      ) : f.type === "select" ? (
        <select
          {...common}
          value={value ?? ""}
          onChange={(e) => setValue(f.name, e.target.value)}
          className="w-full border rounded-xl px-3 py-2 text-sm"
        >
          <option value="" disabled>Select…</option>
          {f.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : f.type === "checkbox" ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            {...common}
            type="checkbox"
            checked={!!value}
            onChange={(e) => setValue(f.name, e.target.checked)}
          />
          {f.label}
        </label>
      ) : f.type === "checkbox-group" ? (
        <div className="space-y-1">
          <span className="block text-sm">{f.label}</span>
          <div className="flex flex-wrap gap-2">
            {f.options?.map((opt) => {
              const arr = Array.isArray(value) ? value : [];
              const checked = arr.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2 text-sm border rounded-xl px-2 py-1">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) setValue(f.name, [...arr, opt]);
                      else setValue(f.name, arr.filter((x) => x !== opt));
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}

// ---------- 6) Ecommerce Filters (with URL sync) ----------
const PRODUCT_DATA = [
  { id: 1, name: "Aurora Hoodie", category: "Apparel", price: 2499, rating: 4.5, inStock: true },
  { id: 2, name: "Nova Tee", category: "Apparel", price: 999, rating: 4.1, inStock: true },
  { id: 3, name: "Orbit Backpack", category: "Accessories", price: 3599, rating: 4.8, inStock: false },
  { id: 4, name: "Comet Sneakers", category: "Footwear", price: 4999, rating: 4.3, inStock: true },
  { id: 5, name: "Lunar Cap", category: "Accessories", price: 699, rating: 4.0, inStock: true },
  { id: 6, name: "Quasar Socks", category: "Apparel", price: 399, rating: 3.9, inStock: true },
  { id: 7, name: "Pulsar Watch", category: "Accessories", price: 8999, rating: 4.7, inStock: false },
  { id: 8, name: "Nebula Sandals", category: "Footwear", price: 1499, rating: 3.8, inStock: true },
  { id: 9, name: "Stellar Belt", category: "Accessories", price: 1299, rating: 4.2, inStock: true },
  { id: 10, name: "Meteor Boots", category: "Footwear", price: 6999, rating: 4.6, inStock: true },
];

function useURLState(initial) {
  const [state, setState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed = {};
    for (const k in initial) {
      if (k === "categories") parsed[k] = params.get("categories")?.split(",").filter(Boolean) || initial[k];
      else if (k === "inStockOnly") parsed[k] = params.get("inStockOnly") === "true" ? true : initial[k];
      else if (k === "minPrice" || k === "maxPrice" || k === "minRating") parsed[k] = params.get(k) ? Number(params.get(k)) : initial[k];
      else if (k === "sortBy") parsed[k] = params.get("sortBy") || initial[k];
      else parsed[k] = params.get(k) || initial[k];
    }
    return parsed;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (state.categories?.length) params.set("categories", state.categories.join(","));
    if (state.inStockOnly) params.set("inStockOnly", String(state.inStockOnly));
    if (state.minPrice != null) params.set("minPrice", String(state.minPrice));
    if (state.maxPrice != null) params.set("maxPrice", String(state.maxPrice));
    if (state.minRating != null) params.set("minRating", String(state.minRating));
    if (state.sortBy) params.set("sortBy", state.sortBy);
    const query = params.toString();
    const url = query ? `?${query}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [state]);

  return [state, setState];
}

function EcommerceFiltersDemo() {
  const categories = ["Apparel", "Footwear", "Accessories"];
  const [state, setState] = useURLState({
    categories: [],
    inStockOnly: false,
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    sortBy: "rating-desc", // name-asc | name-desc | rating-asc | rating-desc | price-asc | price-desc
  });

  const filtered = useMemo(() => {
    let data = PRODUCT_DATA.filter((p) =>
      (state.categories.length === 0 || state.categories.includes(p.category)) &&
      (!state.inStockOnly || p.inStock) &&
      p.price >= state.minPrice && p.price <= state.maxPrice &&
      p.rating >= state.minRating
    );

    const cmp = {
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      "rating-asc": (a, b) => a.rating - b.rating,
      "rating-desc": (a, b) => b.rating - a.rating,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    }[state.sortBy];

    return [...data].sort(cmp);
  }, [state]);

  return (
    <Section
      title="Ecommerce Filters (URL Sync)"
      right={<span className="text-sm text-gray-500">{filtered.length} results</span>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters */}
        <Card>
          <div className="space-y-3">
            <div>
              <div className="font-medium mb-1">Categories</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = state.categories.includes(c);
                  return (
                    <Chip
                      key={c}
                      active={active}
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          categories: active ? s.categories.filter((x) => x !== c) : [...s.categories, c],
                        }))
                      }
                    >
                      {c}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.inStockOnly}
                onChange={(e) => setState((s) => ({ ...s, inStockOnly: e.target.checked }))}
              />
              In stock only
            </label>

            <div>
              <div className="font-medium mb-1">Price Range</div>
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="number"
                  value={state.minPrice}
                  onChange={(e) => setState((s) => ({ ...s, minPrice: Number(e.target.value) }))}
                  className="w-24 border rounded px-2 py-1"
                />
                <span>to</span>
                <input
                  type="number"
                  value={state.maxPrice}
                  onChange={(e) => setState((s) => ({ ...s, maxPrice: Number(e.target.value) }))}
                  className="w-24 border rounded px-2 py-1"
                />
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Minimum Rating</div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={state.minRating}
                onChange={(e) => setState((s) => ({ ...s, minRating: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-sm text-gray-700 mt-1">{state.minRating.toFixed(1)} ★ & up</div>
            </div>

            <div>
              <div className="font-medium mb-1">Sort By</div>
              <select
                value={state.sortBy}
                onChange={(e) => setState((s) => ({ ...s, sortBy: e.target.value }))}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="rating-desc">Rating ↓</option>
                <option value="rating-asc">Rating ↑</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="name-asc">Name A→Z</option>
                <option value="name-desc">Name Z→A</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{p.name}</h4>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{p.price.toLocaleString()}</div>
                  <div className="text-xs">{p.rating} ★</div>
                  {!p.inStock && <div className="text-xs text-red-600">Out of stock</div>}
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-gray-600">No results. Try adjusting filters.</div>
          )}
        </div>
      </div>
    </Section>
  );
}

// ---------- Shell (pattern switcher) ----------
const TABS = [
  { id: "infinite", label: "1. Infinite Scroll", component: InfiniteScrollDemo },
  { id: "boxes", label: "2. Color Boxes", component: ColorBoxesDemo },
  { id: "comments", label: "3. Nested Comments", component: CommentsDemo },
  { id: "progress", label: "4. Progress Bar", component: ProgressBarDemo },
  { id: "form", label: "5. Config Form", component: ConfigFormDemo },
  { id: "filters", label: "6. Ecommerce Filters", component: EcommerceFiltersDemo },
];

export default function App() {
  const [active, setActive] = useState(TABS[0].id);
  const ActiveComp = useMemo(() => TABS.find((t) => t.id === active)?.component || (() => null), [active]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">XVFVPatterns – React Mini Projects</h1>
            <p className="text-sm text-gray-600">Six interview-ready patterns in a single playground.</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <Chip key={t.id} active={active === t.id} onClick={() => setActive(t.id)}>
                {t.label}
              </Chip>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <ActiveComp />
        <footer className="text-xs text-gray-500 text-center pt-6">
          Built with React + Tailwind. IntersectionObserver, state-driven UI, recursion, timers, JSON→UI, and URL sync patterns included.
        </footer>
      </main>
    </div>
  );
}

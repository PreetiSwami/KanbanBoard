import React, { useState } from "react";

const initialData = {
  todo: [
    { id: "t1", title: "Write specs", description: "Outline requirements and acceptance criteria" },
    { id: "t2", title: "Set up project", description: "Create repo, install deps and init linting" },
  ],
  inprogress: [{ id: "p1", title: "Implement auth", description: "Add login/logout and token handling" }],
  done: [{ id: "d1", title: "Create repo", description: "Repository created and README added" }],
};

/* small inline SVG icons -> no external deps */
const IconTodo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 9h10" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 13h6" stroke="#000" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconProgress = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7v6l4 2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M20 6L9 17l-5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconAdd = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDrag = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M10 6h.01M14 6h.01M10 12h.01M14 12h.01M10 18h.01M14 18h.01" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  // inputs for adding new todo (title + short description)
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [notification, setNotification] = useState("");

  function onDragStart(e, itemId, fromCol) {
    e.dataTransfer.setData("application/json", JSON.stringify({ itemId, fromCol }));
    e.dataTransfer.effectAllowed = "move";
    // small visual feedback
    e.currentTarget.style.opacity = "0.6";
  }
  function onDragEnd(e) {
    e.currentTarget.style.opacity = "1";
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e, toCol) {
    e.preventDefault();
    try {
      const { itemId, fromCol } = JSON.parse(e.dataTransfer.getData("application/json"));
      if (!itemId || !fromCol || fromCol === toCol) return;

      setColumns((prev) => {
        const fromList = [...prev[fromCol]];
        const toList = [...prev[toCol]];

        const idx = fromList.findIndex((it) => it.id === itemId);
        if (idx === -1) return prev;

        const [moved] = fromList.splice(idx, 1);
        toList.unshift(moved); // add to top for visibility

        return { ...prev, [fromCol]: fromList, [toCol]: toList };
      });
    } catch {
      // ignore invalid payload
    }
  }

  // add new todo with title + description
  function addTodo() {
    const title = todoTitle.trim();
    const desc = todoDesc.trim();
    if (!title) {
      setNotification("Please enter a title");
      setTimeout(() => setNotification(""), 2000);
      return;
    }
    const newItem = { id: `t${Date.now()}`, title, description: desc || "No description" };
    setColumns((prev) => ({ ...prev, todo: [newItem, ...prev.todo] }));
    setTodoTitle("");
    setTodoDesc("");
    setNotification(`Task "${newItem.title}" added`);
    setTimeout(() => setNotification(""), 3000);
  }

  // upgraded gradients & decorative shapes
  const colGradients = {
    todo: "linear-gradient(135deg,#6dd5fa 0%,#2980b9 100%)",
    inprogress: "linear-gradient(135deg,#f6d365 0%,#fda085 100%)",
    done: "linear-gradient(135deg,#a8ff78 0%,#78ffd6 100%)",
  };

  const boardWrapper = {
    padding: 20,
    minHeight: "100vh",
    width: "100vw",
    maxWidth: "100%",
    left: 0,
    top: 0,
    boxSizing: "border-box",
    background:
      "radial-gradient(1000px 500px at 8% 12%, rgba(99,102,241,0.06), transparent 10%), " +
      "radial-gradient(900px 450px at 92% 88%, rgba(16,185,129,0.04), transparent 10%), " +
      "linear-gradient(180deg,#fbfbff 0%, #f7fbff 30%, #fffaf6 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
    overflowX: "hidden",
  };

  const decorShape = {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.14,
  };

  const boardInner = {
    width: "100%",
    maxWidth: 1400,
    boxSizing: "border-box",
    padding: "8px",
    position: "relative",
    zIndex: 1,
  };

  const pageHeader = {
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const pageTitle = { fontSize: 22, fontWeight: 700, color: "#163e67" };
  const pageSub = { color: "#3c5a72", opacity: 0.85, fontSize: 13 };

  const boardStyle = {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
  };

  const columnStyle = {
    flex: "1 1 300px",
    minWidth: 260,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 10px 30px rgba(19,39,58,0.06)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  const colHeaderBar = (colId) => ({
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: 10,
    color: "#052435",
    fontWeight: 800,
    background: colGradients[colId],
    boxShadow: "inset 0 -6px 18px rgba(0,0,0,0.06)",
    marginBottom: 12,
  });

  const colLeft = { display: "flex", alignItems: "center", gap: 10 };
  const colTitle = { fontSize: 15, color: "#052435", display: "flex", alignItems: "center", gap: 8 };
  const countStyle = {
    fontSize: 12,
    opacity: 0.95,
    background: "rgba(255,255,255,0.35)",
    padding: "6px 10px",
    borderRadius: 999,
    color: "#052435",
  };

  const listStyle = { flex: 1, minHeight: 40 };

  const cardStyle = {
    padding: 12,
    borderRadius: 10,
    background: "linear-gradient(180deg,#ffffff 0%, #90bbe6ff 100%)",
    marginBottom: 10,
    boxShadow: "0 6px 18px rgba(19,39,58,0.06)",
    cursor: "grab",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    fontSize: 14,
    color: "#163447",
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  };

  const avatarStyle = {
    width: 36,
    height: 36,
    borderRadius: 8,
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.05) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
    fontWeight: 700,
    flexShrink: 0,
  };

  const cardTitleStyle = { fontWeight: 700, marginBottom: 6 };
  const cardDescStyle = { fontSize: 13, color: "#516d78", lineHeight: 1.3 };

  const dragHandleStyle = { marginLeft: "auto", alignSelf: "center", opacity: 0.7, cursor: "grab" };

  // input and notification styles
  const inputWrap = { display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" };
  const inputStyle = {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(16,24,32,0.06)",
    outline: "none",
    fontSize: 13,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  };
  const smallInput = { flex: "1 1 180px", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(16,24,32,0.06)", fontSize: 13 };
  const addBtnStyle = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#0ea5a4",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const notifStyle = {
    position: "fixed",
    right: 20,
    top: 20,
    background: "linear-gradient(90deg,#0ea5a4,#075985)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    boxShadow: "0 8px 20px rgba(2,110,185,0.18)",
    zIndex: 9999,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  // responsive helper injected inline to keep file self-contained
  const responsiveStyle = `
    html, body, #root { height: 100%; }
    @media (max-width: 880px) {
      .kanban-col { flex: 1 1 100% !important; min-width: 100% !important; }
      .kanban-top-headings { display: none; }
    }
    @media (min-width: 881px) and (max-width: 1200px) {
      .kanban-col { flex: 1 1 45% !important; min-width: 260px; }
    }
  `;

  return (
    <>
      <style>{responsiveStyle}</style>

      <div style={boardWrapper}>
        {/* decorative SVG blobs for richer graphics */}
        <svg style={{ ...decorShape, left: -60, top: -80, width: 420 }} viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="1" stopColor="#06b6d4" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d="M100 10 C 200 40, 300 -20, 420 20 C 560 70, 580 180, 500 260 C 420 340, 200 360, 80 300 C -40 240 -20 80 100 10Z" fill="url(#g1)" />
        </svg>

        <svg style={{ ...decorShape, right: -80, bottom: -100, width: 380 }} viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="1" stopColor="#60a5fa" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d="M50 20 C160 60, 320 0, 420 70 C520 140, 480 260, 380 320 C280 380, 120 360, 40 300 C-40 240 -0 80 50 20Z" fill="url(#g2)" />
        </svg>

        <div style={boardInner}>
          <div style={pageHeader}>
            <div>
              <div style={pageTitle}>Kanban Board</div>
              <div style={pageSub}>Simple 3-column board — enriched graphics & icons</div>
            </div>
            <div style={{ color: "#0f172a", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.6)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 22c5.523 0 10-3.582 10-8V8a2 2 0 0 0-2-2h-3.5" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 8v6c0 4.418 4.477 8 10 8" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Demo UI
              </span>
            </div>
          </div>

          {/* top headings */}
          <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }} className="kanban-top-headings">
            {[
              { id: "todo", title: "Todo", Icon: IconTodo },
              { id: "inprogress", title: "In Progress", Icon: IconProgress },
              { id: "done", title: "Done", Icon: IconDone },
            ].map((h) => (
              <div key={h.id} style={{ flex: "1 1 300px", minWidth: 260, textAlign: "center" }} className="kanban-col">
                <div style={{ fontSize: 14, fontWeight: 800, color: "#385c74", marginBottom: 6, display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
                  <span style={{ width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.7)", borderRadius: 6 }}>
                    <h.Icon />
                  </span>
                  {h.title}
                </div>
              </div>
            ))}
          </div>

          <div style={boardStyle}>
            {[
              { id: "todo", title: "Todo", Icon: IconTodo },
              { id: "inprogress", title: "In Progress", Icon: IconProgress },
              { id: "done", title: "Done", Icon: IconDone },
            ].map((col) => (
              <div
                key={col.id}
                style={columnStyle}
                className="kanban-col"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, col.id)}
                aria-label={`${col.title} column`}
              >
                <div style={colHeaderBar(col.id)}>
                  <div style={colLeft}>
                    <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(255,255,255,0.12)" }}>
                      <col.Icon size={18} />
                    </div>
                    <div style={colTitle}>{col.title}</div>
                  </div>
                  <div style={countStyle}>{columns[col.id].length}</div>
                </div>

                {/* add input only in todo column */}
                {col.id === "todo" && (
                  <div style={inputWrap}>
                    <input
                      value={todoTitle}
                      onChange={(e) => setTodoTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") addTodo(); }}
                      placeholder="Task title"
                      style={inputStyle}
                      aria-label="Add new todo title"
                    />
                    <input
                      value={todoDesc}
                      onChange={(e) => setTodoDesc(e.target.value)}
                      placeholder="Short description"
                      style={smallInput}
                      aria-label="Add new todo description"
                      onKeyDown={(e) => { if (e.key === "Enter") addTodo(); }}
                    />
                    <button type="button" onClick={addTodo} style={addBtnStyle} aria-label="Add task">
                      <IconAdd size={14} /> Add
                    </button>
                  </div>
                )}

                <div style={listStyle}>
                  {columns[col.id].length === 0 ? (
                    <div style={{ color: "#8aa0b5", fontSize: 13 }}>Drop cards here</div>
                  ) : (
                    columns[col.id].map((item) => (
                      <div
                        key={item.id}
                        style={cardStyle}
                        draggable
                        onDragStart={(e) => onDragStart(e, item.id, col.id)}
                        onDragEnd={onDragEnd}
                        aria-label={`Task: ${item.title}`}
                      >
                        <div style={avatarStyle} aria-hidden>
                          {item.title.split(" ").slice(0,2).map(w => w[0]).slice(0,2).join("").toUpperCase()}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={cardTitleStyle}>{item.title}</div>
                          <div style={cardDescStyle}>{item.description}</div>
                        </div>

                        <div style={dragHandleStyle} title="Drag to move">
                          <IconDrag />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notification toast */}
          {notification && (
            <div style={notifStyle} role="status" aria-live="polite">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 22c5.523 0 10-3.582 10-8V8a2 2 0 0 0-2-2h-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 8v6c0 4.418 4.477 8 10 8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>{notification}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
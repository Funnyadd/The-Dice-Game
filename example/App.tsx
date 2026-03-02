export default function App() {
  return (
    <div className="table-wrap">
      <div className="wood-frame">
        <div className="felt">
          <div className="flex items-center justify-between mb-3">
            <div className="game-title">Shut the Box</div>
            <button className="action-btn">Roll</button>
          </div>

          <div className="panel mb-3">Total: 7</div>

          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <button key={n} className="tile-btn" aria-pressed="false">
                <span className="tile-label">{n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
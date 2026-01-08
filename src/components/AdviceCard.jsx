export default function AdviceCard({ advice }) {
  return (
    <div className="card">
      <h4>Health Advice</h4>
      <ul>
        {advice.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

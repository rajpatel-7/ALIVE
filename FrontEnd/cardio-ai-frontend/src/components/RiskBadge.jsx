export default function RiskBadge({ category, probability }) {
  return (
    <div className={`badge ${category.toLowerCase().replace(" ", "-")}`}>
      <h3>{category}</h3>
      <p>Risk Probability: {(probability * 100).toFixed(1)}%</p>
    </div>
  );
}

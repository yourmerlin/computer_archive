import computerData from "../../computer.json";
import ComputerCard from "./ComputerCard.jsx";

// computer.json has two separate lists (low and high).
// here we match them up by id so each computer has both models.
const computers = computerData.low_fidelity_computer.map((low) => {
  const high = computerData.high_fidelity_computer.find(
    (h) => h.id === low.id,
  );
  return {
    id: low.id,
    name: low.name,
    lowModel: low.model,
    highModel: high.model,
  };
});

export default function ComputerGrid() {
  return (
    <section className="computer-grids">
      {/* .map() turns each computer into a <ComputerCard />.
          "key" helps react tell the cards apart. */}
      {computers.map((computer) => (
        <ComputerCard
          key={computer.id}
          name={computer.name}
          lowModel={computer.lowModel}
          highModel={computer.highModel}
        />
      ))}
    </section>
  );
}

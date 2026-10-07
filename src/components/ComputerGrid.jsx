import computerData from "../../computer.json";
import ComputerCard from "./ComputerCard.jsx";
import Lightbox from "./Lightbox.jsx";
import { useState } from "react";

// one entry per computer, each with both its low and high model paths.
const computers = computerData.computers;

export default function ComputerGrid() {
  const [selectedComputer, setSelectedComputer] = useState(null);
  return (
    <section className="computer-grids">
      {/* .map() turns each computer into a <ComputerCard />.
          "key" helps react tell the cards apart. */}
      {computers.map((computer) => (
        <ComputerCard
          key={computer.id}
          name={computer.name}
          year={computer.year}
          link={computer.link}
          lowModel={computer.lowModel}
          highModel={computer.highModel}
          onOpen={() => setSelectedComputer(computer)}
        />
      ))}

      {selectedComputer && (
        <Lightbox
          computer={selectedComputer}
          onClose={() => setSelectedComputer(null)}
        />
      )}
    </section>
  );
}
// make computer card so when click -> it will open to full screen
// if mouseClick on computer card
// computer card will be full screen -> users can interact with it
//

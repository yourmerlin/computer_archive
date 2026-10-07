// App is the whole page. it's built out of smaller components,
// the same way home.html was built out of <nav> and <main>.
import Nav from "./components/Nav.jsx";
import ComputerGrid from "./components/ComputerGrid.jsx";
import CursorTrail from "./components/CursorTrail.jsx";

export default function App() {
  return (
    <>
      <CursorTrail />
      <Nav />
      <main className="home-main">
        <ComputerGrid />
      </main>
    </>
  );
}

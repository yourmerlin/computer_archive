// the ascii art, kept in a variable so the spacing stays exactly as typed
const asciiArt = `
   _______________                         ______________
  |    ____       |     .-.     .-.      |  ___________  |
  |   |   | _     |    .    . .    .     | |           | |
  | __| 0   0 -__ |    .     .     .     | |   0   0   | |
  | |     -     | |     .happiness.      | |     -     | |
  | |   \\___/   | |      .loading.       | |   \\___/   | |
  | (___    ___ ) |       .    .         | |___________| |
  |___  |   | ____|        .  .          |_______________|
    _|__|   |_|_.............+.............._|________|_
   /            \\                          /            \\
  /    [human]   \\                        /  [computer]  \\
--------------------                    --------------------
`;
// note: in JS strings a backslash is special, so each "\" in the art is written "\\"

export default function Nav() {
  return (
    <nav>
      <pre>{asciiArt}</pre>
      <h1>computers.json</h1>
    </nav>
  );
}

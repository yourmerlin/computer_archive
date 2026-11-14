// makes every lo-fi model lighter by cutting down its triangles.
// run it with:  node scripts/shrink-lofi.mjs
// (the hi-fi models are not touched. the old lo-fi files are saved in git,
//  so `git checkout public/models` brings them back if you don't like it)
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const RATIO = 0.25; // keep about 25% of the triangles
const MAX_ERROR = 0.01; // ...but never change the shape by more than ~1%

const modelsDir = "public/models";

for (const name of fs.readdirSync(modelsDir)) {
  const file = path.join(modelsDir, name, "low.glb");
  if (!fs.existsSync(file)) continue;

  const temp = path.join(modelsDir, name, "low.tmp.glb");
  const before = fs.statSync(file).size;

  console.log(`\nshrinking ${name}...`);
  execSync(
    `npx -y @gltf-transform/cli@4.1.1 optimize "${file}" "${temp}"` +
      ` --simplify-ratio ${RATIO} --simplify-error ${MAX_ERROR}` +
      // textures are left as-is: they're already small webp files, and the
      // tool's image library crashes on windows ("colourspace" error)
      ` --texture-compress false --compress meshopt`,
    { stdio: "inherit" }
  );

  fs.renameSync(temp, file); // replace the old lo-fi with the new one
  const after = fs.statSync(file).size;
  console.log(`${name}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}

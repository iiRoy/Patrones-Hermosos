#!/usr/bin/env node

// Uso:
//   node release-all.js "tipo(scope): descripción"             ← Usará la rama actual
//   node release-all.js "tipo(scope): descripción" rama-destino ← Usará la rama especificada

const { execSync } = require("child_process");

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("❌ Debes proporcionar al menos un mensaje de commit.\n👉 Uso: node release-all.js \"tipo(scope): descripción\" [rama]");
  process.exit(1);
}

const commitMessage = args[0];
const branch = args[1] || getCurrentBranch(); // Si no se pasa, se usa la rama actual

function run(command, options = {}) {
  try {
    execSync(command, { stdio: "inherit", ...options });
    return true;
  } catch (error) {
    return false;
  }
}

function branchExists(branchName) {
  try {
    execSync(`git show-ref --verify --quiet refs/heads/${branchName}`);
    return true;
  } catch {
    return false;
  }
}

function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    console.error("❌ No se pudo obtener la rama actual.");
    process.exit(1);
  }
}

// Verifica que la rama exista localmente
if (!branchExists(branch)) {
  console.error(`❌ La rama '${branch}' no existe localmente.`);
  process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", "Agregando cambios...");
run("git add .");

console.log("\x1b[36m%s\x1b[0m", `Intentando commit con mensaje: "${commitMessage}"`);
if (!run(`git commit -m "${commitMessage}"`)) {
  console.error("\x1b[31m%s\x1b[0m", "Commit inválido (¿falló el hook commit-msg?)");
  process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", "Ejecutando semantic-release...");
if (!run("npx semantic-release --no-ci")) {
  console.error("\x1b[31m%s\x1b[0m", "Error en semantic-release. No se publicará nada.");
  process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", "Instalando recursos necesarios...");
run("npm install");

console.log("\x1b[36m%s\x1b[0m", `Haciendo push de commits y tags a la rama '${branch}'...`);
run(`git push origin ${branch} --tags`);

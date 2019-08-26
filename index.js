const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let qtRequisicoes = 0;

server.use((req, res, next) => {
  qtRequisicoes++;

  console.log(`Foi(ram) feito(as) ${qtRequisicoes} requisição(ões).`);

  return next();
});

function validarProjetoEncontrado(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "O parâmetro ID não foi informado" });
  }

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({
      error: "Não foi possível encontrar nenhum projeto com o ID informado"
    });
  }

  req.project = project;

  return next();
}

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", validarProjetoEncontrado, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", validarProjetoEncontrado, (req, res) => {
  const { id } = req.param;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", validarProjetoEncontrado, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);

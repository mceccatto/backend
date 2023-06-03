require("./mongodb");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const usuarios = require("./usuariosImportacao.json");

async function carregarDados() {
    try {
        await userModel.deleteMany({});
        for (const usuario of usuarios) {
            await userModel.create(usuario);
        }
        console.log("Carga de usuários efetuada com sucesso!");
    } catch (err) {
        console.log(err);
    } finally {
        process.exit();
    }
}

carregarDados();
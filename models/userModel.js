const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    codigo: Number,
    nome: String,
    sobrenome: String,
    nascimento: String,
    telefone: String,
    endereco: String,
    cidade: String,
    estado: String,
    avatar: String,
    status: Boolean
});

module.exports = mongoose.model('users', userSchema);
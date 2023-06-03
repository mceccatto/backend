const userModel = require('../models/userModel');

class UserController {
    async salvar(req, res) {
        let user = req.body;
        if (
            user.nome == "" ||
            user.sobrenome == "" ||
            user.nascimento == "" ||
            user.telefone == "" ||
            user.endereco == "" ||
            user.cidade == "" ||
            user.estado == "" ||
            user.avatar == "" ||
            user.status == ""
        ) {
            res.status(400).json({ 'msg': 'Todos os campos são obrigatórios!' });
        } else {
            if (typeof user.status !== 'boolean') {
                res.status(400).json({ 'msg': 'Status no formato inválido!' });
            } else {
                const max = await userModel.findOne({}).sort({ codigo: -1 });
                user.codigo = max == null ? 1 : max.codigo + 1;
                const resultado = await userModel.create(user);
                res.status(201).json({ 'msg': 'Usuário cadastrado com sucesso!', 'user': resultado });
            }
        }
    }

    async listar(req, res) {
        const resultado = await userModel.find({});
        res.status(200).json(resultado);
    }

    async buscarFiltro(req, res) {
        const filtro = req.body;
        if (filtro.codigo !== 0) {
            if (filtro.codigo == "" || filtro.codigo <= 0 || /^[0-9]+$/.test(filtro.codigo) == false) {
                res.status(400).json({ 'msg': 'É obrigatório informar um código válido!' });
            } else {
                const resultado = await userModel.findOne({ 'codigo': filtro.codigo });
                if (resultado) {
                    res.status(200).json(resultado);
                } else {
                    res.status(400).json({ 'msg': 'Usuário não encontrado!' });
                }
            }
            return;
        } else {
            const resultado = await userModel.find({
                $or: [
                    { nome: { $regex: filtro.busca, $options: 'i' } },
                    { sobrenome: { $regex: filtro.busca, $options: 'i' } },
                    { cidade: { $regex: filtro.busca, $options: 'i' } }
                ],
                $and: [
                    { estado: { $regex: filtro.estado, $options: 'i' } },
                    { status: filtro.status }
                ]
            });
            if (resultado) {
                res.status(200).json(resultado);
            } else {
                res.status(400).json({ 'msg': 'Usuário não encontrado!' });
            }
        }
    }

    async buscarPorCodigo(req, res) {
        const codigo = req.params.codigo;
        if (codigo == "" || codigo <= 0 || /^[0-9]+$/.test(codigo) == false) {
            res.status(400).json({ 'msg': 'É obrigatório informar um código válido!' });
        } else {
            const resultado = await userModel.findOne({ 'codigo': codigo });
            if (resultado) {
                res.status(200).json(resultado);
            } else {
                res.status(400).json({ 'msg': 'Usuário não encontrado!' });
            }
        }
    }

    async atualizar(req, res) {
        const codigo = req.params.codigo;
        if (codigo == "" || codigo <= 0 || /^[0-9]+$/.test(codigo) == false) {
            res.status(400).json({ 'msg': 'É obrigatório informar um código válido!' });
        } else {
            let user = req.body;
            let msg = '';
            if (typeof user.status !== "undefined") {
                if (user.status === true) {
                    msg = 'Usuário reativado com sucesso!';
                } else {
                    msg = 'Usuário desativado com sucesso!';
                }
            } else {
                if (
                    user.nome == "" ||
                    user.sobrenome == "" ||
                    user.nascimento == "" ||
                    user.telefone == "" ||
                    user.endereco == "" ||
                    user.cidade == "" ||
                    user.estado == ""
                ) {
                    res.status(400).json({ 'msg': 'Todos os campos são obrigatórios!' });
                    return;
                } else {
                    msg = 'Usuário atualizado com sucesso!';
                }
            }
            try {
                const _id = String((await userModel.findOne({ 'codigo': codigo }))._id);
                await userModel.findByIdAndUpdate(String(_id), user);
                res.status(200).json({ 'msg': msg });
            } catch (err) {
                res.status(400).json({ 'msg': 'Usuário não encontrado!' });
            }
        }
    }

    async excluir(req, res) {
        const codigo = req.params.codigo;
        if (codigo == "" || codigo <= 0 || /^[0-9]+$/.test(codigo) == false) {
            res.status(400).json({ 'msg': 'É obrigatório informar um código válido!' });
        } else {
            try {
                const _id = String((await userModel.findOne({ 'codigo': codigo }))._id);
                await userModel.findByIdAndRemove(String(_id));
                let resultado = 'Usuário excluído com sucesso!';
                res.status(200).json({ 'msg': resultado });
            } catch (err) {
                res.status(400).json({ 'msg': 'Usuário não encontrado!' });
            }
        }
    }
}

module.exports = new UserController();
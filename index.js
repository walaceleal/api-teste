import express from 'express';
import faker from 'faker';
import dotenv from 'dotenv';

dotenv.config();

function criarUsuarios() {
    const resposta = [];
    for (let i = 0; i < 100; i++) {
        const produto = {
            id: i,
            nome: faker.name.findName(),
            cidade: faker.address.city()
        }

        resposta.push(produto);
    }

    return resposta;
}

let usuarios = criarUsuarios();

const app = express();

app.get('/usuario', (req, res) => {
    const pagina = parseInt(req.query.pagina) - 1;
    const total = parseInt(req.query.total);
    const { busca, ordem, crescente } = req.query;

    const filtrado = !busca ? usuarios : usuarios.filter(e => e.nome.indexOf(busca) != -1 || e.cidade.indexOf(busca) != -1);

    const ordenado = !ordem ? filtrado : filtrado.sort((item1, item2) => {
        if (crescente == 'true')
            return item1[ordem] < item2[ordem] ? -1 : 1;

        return item1[ordem] > item2[ordem] ? -1 : 1;
    })

    const paginado = filtrado.slice(pagina * total, (pagina + 1) * total);

    const resposta = {
        itens: paginado,
        paginacao: {
            paginas: Math.ceil(filtrado.length / total),
            total: filtrado.length,
        }
    };

    res.json(resposta);
});

app.delete('/usuario/:id', (req, res) => {
    const { id } = req.params;

    const indice = usuarios.findIndex( e => e.id == id);
    usuarios.splice(indice, 1);

    res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
    console.log(`Aplicação rodando na porta ${process.env.PORT}`);
});
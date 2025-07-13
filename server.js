const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');


app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});


app.get('/contato-recebido', (req, res) => {
    const { nome, email, assunto, mensagem } = req.query;

    if (!nome || !email || !assunto || !mensagem) {
        return res.redirect('/not-found');
    }

   res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Dados Recebidos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="min-height: 100vh;">
    <div class="container text-center bg-white p-5 rounded shadow" style="max-width: 600px;">
        <h2 class="mb-4 text-primary">Informações Recebidas</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email ?? '-'}</p>
        ${assunto ? `<p><strong>Assunto:</strong> ${assunto}</p>` : ''}
        ${mensagem ? `<p><strong>Mensagem:</strong> ${mensagem}</p>` : ''}

        <a href="/" class="btn btn-warning mt-4 fw-bold">Voltar para a Página Inicial</a>
    </div>
</body>
</html>
`);

});



app.get('/sugestao', (req, res) => {
    const { nome, ingredientes } = req.query;

    if (!nome || !ingredientes) {
        return res.redirect('/not-found');
    }

    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Dados Recebidos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="min-height: 100vh;">
    <div class="container text-center bg-white p-5 rounded shadow" style="max-width: 600px;">
        <h2 class="mb-4 text-primary">Informações Recebidas</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Ingredientes:</strong> ${ingredientes ?? '-'}</p>
       
        <a href="/" class="btn btn-warning mt-4 fw-bold">Voltar para a Página Inicial</a>
    </div>
</body>
</html>
`);

});


app.get('/cardapio', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'data', 'lanches.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o cardápio.');
        }

        const lanches = JSON.parse(data);

        const cardsHTML = lanches.map(lanche => `
            <div class="col-12 col-md-6 col-lg-4">
                <article class="produto-card text-center">
                    <img src="/imagens/produtos/prod${lanche.id}.png" alt="${lanche.nome}" class="img-fluid rounded">
                    <h3 class="titulo mt-3">${lanche.nome}</h3>
                    <p class="texto">${lanche.ingredientes}</p>
                </article>
            </div>
        `).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cardápio</title>
                <link rel="stylesheet" href="/css/style.css">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body style="background-color: #0092d2">
                <section class="produtos py-5">
                    <div class="container">
                        <h2 class="text-center mb-4 text-white">CONFIRA NOSSO CARDÁPIO</h2>
                        <div class="row g-4">
                            ${cardsHTML}
                        </div>
                    </div>
                    
                </section>
                        <a href="/" class="btn btn-warning mt-4 fw-bold">Voltar para a Página Inicial</a>

            </body>
            </html>
        `);
    });
});

app.get('/not-found', (req,res) =>{
    res.status(404).send('A PÁGINA SOLICITADA NÃO EXISTE, GENTILEZA VERIFICAR O CAMINHO');
})
app.listen(port, () => {
    console.log(`Servidor: http://localhost:${port}`)
})
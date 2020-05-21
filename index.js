const express = require('express');

const server = express();

// para o express ler json no corpo da requisição
server.use(express.json());

// middleware global, sera chamado a cada requisicao, pode ser usado como log da aplicação
server.use((req, res, next) =>{
    console.time('Request');
    console.log(`Methodo: ${req.method}; URL: ${req.url};`);
   //return next(); //executa o proximo middlare
   next(); // executa o proximo middleware

   console.timeEnd('Request'); // essa linha sera executado somente depois que todos metodos(middleware) forem executados
})

// middlawre local, podem alterar as variaveis req, e res
// somente pode ser utilizada dentro das rotas
// valida se o usuario(properties name) existe no corpo da requisição 
function checkUserExist(req, res, next){
  if(!req.body.name){
     return res.status(400).json({error: 'User name is required'});
  }

  return next(); // continua fluxo de execução abaixo
}
 // middlaware local - valida se o indice veio no parametro da requisicao (url)
function checkUserInArray(req, res, next){
    const user = users[req.params.index] // obtendo o usuario do array e atribuindo a variavel user
    // se o indice nao veio na url requisicao
    if(!user){
        return res.status(400).json({error: 'User does not exists'});
    }

     // alterando o variavel req
    req.user = user; // adicionando a variave user na variavel req
    return next(); // continua

}
// Query params = ?teste=1 - GET e DELETE server.get('/teste/nome=Udinei', (req, res) =>{
// Route params = /users/1 - GET e DELETE server.get('/teste/:id', (req, res) =>{
// Request body = Body (POST e PUT) {"nome": "fulano", "idade": "12", "login": "test"}

// CRUD - Create, Read, Update, Delete
// lista fixa de usuario
const users = ['Udinei', 'Jose', 'Pedro'];

// lista todos 
server.get('/users', (req, res) =>{
   return res.json(users);
});

// lista um usuario pelo indice
server.get('/users/:index', checkUserInArray, (req, res) =>{
    // console.log('teste');
    // return res.send('Hello World'); // em texto
    // const nome = req.query.nome; // params query
    //const id = req.params.id; // params query
    //const { index }  = req.params; // destruc

    return res.json(req.user); // obtem o  usuario direto de req, que adicionado pelo middleware checkUserInArray
    // return res.json({ message: `Buscando usuario ${ users[index] }`}); // em json
 });

 // criar usuario
 server.post('/users', checkUserExist, (req, res) =>{
      const { name } = req.body;
      
      users.push(name);

      return res.json(users);
 });


    server.put('/users/:index', checkUserExist, checkUserInArray,  (req, res) =>{
    const { index } = req.params; // obtem id da url
    const { name } = req.body; // obem nome do corpo da requisição
    
    users[index] = name; // adiciona na posicao do indice o novo mame
    return res.json(users); // exibe o array alterado
 });
 
 server.delete('/users/:index', checkUserInArray, (req, res) =>{
      const { index } = req.params;
      users.splice(index, 1); // apartir de index apaga um elemento do array (mo caso na posicao do array)
      //return res.json(users);
      return res.send();
 });

server.listen(3001);

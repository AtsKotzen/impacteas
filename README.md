🚀 **ImpactEAS - BOT para Atestação com Telegram e EAS**

🌱 *Greenpill Brasil*

### 🤔 O Que Estamos Resolvendo?

Os grupos de Telegram têm sido uma grande fonte de interação entre as comunidades, mas muitas das tarefas e interações diárias não são registradas. Com o ImpactEAS_BOT, os membros das comunidades poderão votar e atestar através do Telegram. 👍

### Exemplo de Bot do Telegram com Ethereum Attestation Service (EAS)

Este exemplo demonstra como criar um bot do Telegram que interage com os usuários por meio de uma enquete e registra essas respostas no blockchain Ethereum utilizando o Ethereum Attestation Service (EAS). 📊

### 🛠️ Configuração do Provedor Ethereum

O código se conecta à rede Sepolia (um testnet Ethereum) usando um provedor JSON-RPC. Uma seed phrase é usada para criar uma carteira Ethereum, que é então conectada ao provedor. 🔐

### Inicialização do Bot do Telegram

O bot é inicializado com um token de bot fornecido pelo BotFather do Telegram. O bot é configurado para responder a eventos específicos, como quando um usuário inicia o bot (bot.start) e quando um usuário responde a uma enquete (bot.on('poll_answer')). 🤖

### Enquete no Telegram

Quando um usuário inicia o bot, ele cria uma enquete com a pergunta: "Você aprendeu um pouco mais sobre Web3 com a Greenpill Brasil?" e as opções de resposta "SIM" e "NÃO". 📝

### Registro de Respostas da Enquete

Quando um usuário responde à enquete, o bot captura a resposta e os detalhes do usuário (como ID do chat do Telegram, nome de usuário, nome e ID do usuário). Em seguida, ele cria um objeto de dados com essas informações e chama a função attest para registrar a resposta como uma atestação no EAS. 📈

### Atestação no EAS

A função attest usa o EAS para criar uma atestação com os dados fornecidos. Isso envolve enviar uma transação para o blockchain Ethereum usando a carteira Ethereum criada anteriormente. 🌐

### Manipulação de Sinais de Encerramento

O código também inclui manipuladores para os sinais SIGINT e SIGTERM para garantir que o bot seja encerrado corretamente quando o processo for interrompido. 🛑

### Considerações

- **Segurança:** O código usa variáveis de ambiente para armazenar informações sensíveis, como a seed phrase da carteira e o token do bot do Telegram. 🔒


Este exemplo é uma demonstração prática de como criar um bot do Telegram que interage com os usuários e registra suas respostas no blockchain Ethereum usando o EAS.

### ROADMAP

- [x] Definir Schema de Relatório de Impacto
- [x] Criar Schemas EAS
- [x] Criar serviço telegraf
- [x] Criar enquetes do Telegram adequadas ao Schema
- [x] Hardcode MVP

### TODO
- [ ] Ajuste de bugs
- [ ] Teste com a comunidade

### Histórico:

- Criamos alguns schemas baseados nas métricas de impacto definidas pela comunidade Greenpill Brasil.
- Rede Sepolia.

**Schema UID:** 0x2df095be5756b29228de66f06e70abe0e90082f9d2a18f4208cb47182f57958a

### Contato
- [Modelo do relatório de impacto](https://app.charmverse.io/greenpill-network/impacto-06873745360930861)
- [Primeiros testes com eas-sdk](https://github.com/greenpillbrasil/Greenpill-Brasil-Attestations-schemas)
- [Charmverse](https://app.charmverse.io/greenpill-network/greenpill-brazil-0228652595639951)

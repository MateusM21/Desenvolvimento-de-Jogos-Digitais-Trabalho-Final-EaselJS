# Desenvolvimento-de-Jogos-Digitais-Trabalho-Final-EaselJS

Easel JS // Objetivo:Desenvolver um jogo digital completo utilizando a ferramenta definida para o grupo, aplicando conceitos de design, programação, jogabilidade e experiência do usuário.

# 🎮 FLAPPY



\## 1. Descrição Geral



\### 1.1. Enredo e Ambientação (Plot)

Este projeto é uma releitura do clássico jogo \*Flappy Bird\*. Em vez de um enredo complexo, o jogo se baseia em uma premissa simples e desafiadora: \*\*um ciclo infinito de tentativa e erro.\*\* O jogador controla \*\*um pequeno pássaro amarelo\*\* que deve navegar por um obstáculo interminável de pilares, desafiando a gravidade e o próprio tempo de reação para obter a maior pontuação possível.



\### 1.2. Objetivos do Jogo

O objetivo do jogo é um \*\*"Endless Runner"\*\* de pontuação máxima. O jogador deve:

1\.  \*\*Voar o mais longe possível\*\* sem colidir com os pilares ou cair no chão.

2\.  \*\*Acumular a maior pontuação\*\* (score), onde cada par de pilares ultrapassado com sucesso adiciona um ponto.

3\.  Dominar os controles para gerenciar a física de queda e impulso do personagem.



\*\*\*



\## 2. Ferramenta Utilizada



\### EaselJS

Este projeto foi desenvolvido utilizando a biblioteca \*\*EaselJS\*\*, uma das ferramentas do CreateJS Suite. Foi escolhida por sua leveza e eficiência na manipulação do Canvas, sendo ideal para a criação de jogos 2D com foco em gráficos interativos e animações.



| Critério | Detalhe |

| :--- | :--- |

| \*\*Ferramenta Principal\*\* | \*\*EaselJS\*\* (completamente em JavaScript) |

| \*\*Tecnologias\*\* | HTML5 Canvas, JavaScript |

| \*\*Recursos Chave\*\* | Manipulação de \*DisplayObjects\* (Bitmaps, Shapes), Ticker (loop de jogo), e tratamento de eventos para interação e colisões. |



\*\*\*



\## 3. Instalação e Execução



O jogo é uma aplicação web desenvolvida em JavaScript/HTML5.



\### Pré-requisitos

\* Um navegador web moderno (Google Chrome, Firefox, Edge, Safari, etc.).



\### Passos para Execução

1\.  \*\*Clone o repositório:\*\* Abra o terminal ou Git Bash na pasta desejada e execute:

&nbsp;   ```bash

&nbsp;   git clone \ https://github.com/MateusM21/Desenvolvimento-de-Jogos-Digitais-Trabalho-Final-EaselJS.git

&nbsp;   ```

2\.  \*\*Acesse a pasta do projeto:\*\*

&nbsp;   ```bash

&nbsp;   cd Desenvolvimento-de-Jogos-Digitas-Trabalho-Final-EaselJS

&nbsp;   ```

3\.  \*\*Execute o jogo:\*\*

&nbsp;   \* \*\*Opção Simples:\*\* Simplesmente abra o arquivo \*\*`index.html`\*\* no seu navegador de preferência.

&nbsp;   \* \*\*Opção com Servidor Local (Recomendada):\*\* Para garantir o correto carregamento de todos os assets, é altamente recomendável rodar um servidor web local (Ex: Live Server do VS Code).



\### Controles do Jogo

| Ação | Tecla/Botão | Observação |

| :--- | :--- | :--- |

| \*\*Pular/Impulsionar\*\* | \*\*Espaço\*\* (Barra de Espaço) / \*\*Clique do Mouse\*\* / \*\*Toque na Tela\*\* | A única ação de jogabilidade. |

| \*\*Pause\*\* | Não existe | O jogo é um \*Endless Runner\* de ação contínua, sem função de pausa após o início da rodada. |

| Iniciar Jogo / Tentar Novamente | \[Descreva a Ação, ex: Espaço ou Clique na Tela Inicial] | |



\*\*\*



\## 4. Demonstração



\### Capturas de Tela

As imagens a seguir demonstram o fluxo de jogo:



\[\*\*Instrução:\*\* Salve estas imagens (anexadas por você) na pasta `assets/screenshots/` do seu repositório.]



!\[Tela de Início do Jogo](screenshots/image\_3ecf0f.png)

!\[Cena de Jogabilidade - Pássaro e Pilares](screenshots/image\_3ecf2f.png)

!\[Cena de Jogabilidade - Obstáculos sendo gerados](screenshots/image\_3ecf4f.png)

!\[Tela de Game Over com Pontuação](screenshots/image\_3ed217.png)

!\[Tela de Game Over - Detalhe](screenshots/image\_3ed21f.png)


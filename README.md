# PokeApp - Desafio Técnico Ionic/Angular

Esta é uma aplicação móvel desenvolvida com Ionic e Angular como parte de um processo seletivo. O projeto consome a API pública [PokeAPI](https://pokeapi.co/) para listar Pokémons, exibir seus detalhes e permitir ao usuário gerenciar uma lista de favoritos, que é salva localmente no dispositivo.

## Abordagem Técnica e Padrões

A arquitetura do projeto foi focada na separação de responsabilidades e na componentização. Utilizei o padrão de **Injeção de Dependência** do Angular para gerenciar os serviços, com um `PokemonService` para toda a comunicação com a API e um `FavoriteService` para a lógica de armazenamento local usando `@ionic/storage-angular`. A navegação foi estruturada com o Roteador do Angular, utilizando rotas aninhadas para manter o contexto das abas ao navegar para páginas de detalhes.

A interface foi construída com os componentes UI do Ionic, garantindo uma experiência de usuário fluida e adaptável. A performance da lista principal foi otimizada com a estratégia de **Paginação Infinita** (`ion-infinite-scroll`). A **responsividade** foi implementada com o sistema de Grid do Ionic, que ajusta o layout para diferentes tamanhos de tela e orientações (retrato e paisagem).

## Funcionalidades
* Listagem de Pokémons com scroll infinito.
* Página de detalhes completa com status, habilidades e mais.
* Sistema de Favoritos com persistência de dados.
* Interface responsiva e navegação por Abas.
* Ícones carregados dinamicamente via `addIcons`.

![Image](https://github.com/user-attachments/assets/e6936566-2016-43bb-957f-4c299fe48416)

![Image](https://github.com/user-attachments/assets/a0306f43-7c78-471c-8a0b-ac8bd1d15327)

Obrigada pela oportunidade de aprender uma ferramenta nova!
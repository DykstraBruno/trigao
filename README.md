# Trigão Panificadora — e-commerce próprio

Plataforma de vendas online para a [Trigão Panificadora](https://www.instagram.com/trigaopanificadora/), padaria com mais de 20 anos em Teresina (PI) e 3 lojas físicas (Barão, Centro, Parque Piauí).

## O Problema

A maior parte do delivery da Trigão saía pelo iFood, com taxa de comissão entre 23% e 30% por pedido. Em meses fortes, esse percentual virava o segundo maior custo operacional da padaria — e o cliente que pedia pelo iFood ficava "amarrado" à plataforma: sem histórico próprio, sem fidelização direta, sem dados de comportamento de compra.

A diretoria precisava de um canal próprio: vender direto, recuperar a margem perdida nas taxas e ainda enxergar projeção de vendas para planejar produção e compras.

## A Solução

Um e-commerce completo, multi-loja, construído sob medida:

- **Backend Spring Boot 2.7** (Java 11) com Spring Security + JWT stateless, JPA/Hibernate sobre PostgreSQL 15 e migrations versionadas com Flyway.
- **Multi-loja com 3 perfis** — `CUSTOMER`, `MANAGER` (escopado por loja) e `ADMIN` — cada um vendo apenas o que precisa ver.
- **Pedidos em tempo real**: STOMP sobre WebSocket (SockJS) com handshake autenticado por JWT — o gerente de cada loja recebe o pedido em menos de 1 segundo, com beep e notificação no navegador.
- **Pagamento PIX e cartão** via AbacatePay (webhook reconcilia status do pedido).
- **Projeção de vendas** no painel admin: média móvel de 7 dias ajustada por sazonalidade de dia-da-semana, mais KPIs reais (receita, ticket médio, crescimento WoW) e gráfico SVG nativo (sem dependência externa de chart lib).
- **Frontend Angular 11** com checkout responsivo, filtros avançados de catálogo, histórico de pedidos com timeline de status e área administrativa completa.
- **Containerizado**: `docker-compose up` sobe Postgres + backend + frontend, prontos para deploy em qualquer host.

## Resultado

Após a migração de parte do volume do iFood para o canal próprio, a Trigão observou um **aumento de 15% no lucro líquido** — fruto direto da economia em taxas de marketplace e do ganho de previsibilidade na produção a partir das projeções no painel.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Backend | Java 11, Spring Boot 2.7, Spring Security + JWT, Spring Data JPA, Spring WebSocket (STOMP) |
| Banco | PostgreSQL 15, Flyway migrations |
| Pagamentos | AbacatePay (PIX + cartão), webhook handler |
| Frontend | Angular 11, RxJS, SCSS, @stomp/rx-stomp + sockjs-client |
| Infra | Docker, docker-compose |

## Arquitetura

- **Auth**: JWT stateless. `LoginResponse` devolve `storeId` para roteamento por papel no frontend.
- **Pedidos**: criados pelo cliente já vinculados a uma loja (selecionada no checkout). `OrderEventPublisher` dispara `OrderEvent.CREATED`/`UPDATED` no tópico `/topic/store/{storeId}/orders`. Gerente assiste apenas ao tópico da própria loja.
- **Analytics**: query nativa agrupada por `DATE_TRUNC('day', created_at AT TIME ZONE 'America/Fortaleza')`, ignorando pedidos `PENDING` e `CANCELLED`. Forecast = SMA(7) × fator sazonal por dia-da-semana.
- **Filtros de produto**: query única em `ProductRepository.filter` com `WHERE`s condicionais (categoria + busca + faixa de preço + somente em estoque).

## Como rodar

Pré-requisitos: Docker Desktop, Node 14+ (frontend dev), Java 11 + Maven (backend dev).

```bash
# 1. Sobe Postgres + backend + frontend
cp .env.example .env  # ajustar ABACATEPAY_API_KEY
docker compose up -d --build

# Frontend em modo dev (hot reload, opcional)
cd frontend
npm install --legacy-peer-deps
npm start
```

URLs:

- App: http://localhost:4200
- API: http://localhost:8080/api
- WebSocket: ws://localhost:8080/ws

## Roadmap próximo

- Histórico de fidelidade (cliente acumula pontos por pedido).
- App de gerente como PWA para uso em tablet de balcão.
- Integração com NFC-e para emissão automática.

---

Site mantido com carinho para a Trigão Panificadora, Teresina (PI). Pão é negócio sério.

# Proposta Técnica --- Core Backend como Hub Multi-Cloud

---

## 1. Estratégia de Escalabilidade

**Onde estamos x onde precisamos chegar**

Hoje o core financeiro roda em Azure Container Apps, com autoscaling baseado em concorrência HTTP. Em testes de carga, o gargalo não está em CPU ou memória, mas sim no pool de conexões ao banco. Antes de escalar horizontalmente o core, precisamos aliviar a pressão no banco, que é o
verdadeiro limitador.

**Trade-offs considerados**

-   Subir tier do banco: aumenta capacidade de conexões, mas tem custo elevado e pode gerar lock-in em tiers premium;
-   Introduzir cache transparente: descartado, pois o padrão de acesso envolve operações críticas que não toleram leitura stale;
-   Particionamento por tenant (sharding): melhora isolamento e escalabilidade, mas aumenta complexidade operacional e de queries;
-   CosmosDB vs SQL Hyperscale: CosmosDB oferece escalabilidade horizontal e consistência eventual, útil para workloads de leitura massiva e tolerância a latência. Já SQL Hyperscale mantém consistência forte, essencial para operações financeiras reguladas. Com isso, o melhor cenário seria SQL Hyperscale para o core transacional e CosmosDB como apoio para workloads analíticos e consultas não críticas.

**Caminho escolhido**

Adotar cache leve para sessão/estado (alto hit rate, baixo risco) e escalar o banco verticalmente até o sweet spot de custo. Complementar com réplicas de leitura para aliviar pressão em queries analíticas e manter consistência forte nas operações financeiras.

**Orquestração de containers**

Embora o Azure Container Apps seja suficiente hoje, já consideramos a evolução para Kubernetes (AKS) caso o volume cresça além da elasticidade atual. Isso permitiria maior controle sobre autoscaling, isolamento de workloads e integração com serviços multi-cloud via service mesh (ex.:Istio ou Linkerd).

Autoscaling: o que medimos Mudamos a métrica de scaling de "concorrência HTTP" para um sinal composto:

-   concorrência de requisições;
-   utilização do pool de conexões;
-   tamanho da fila de eventos.

Isso evita que o autoscaler crie réplicas que competem pelas mesmas conexões, piorando a latência.

**Onde o multi-cloud entra**

No fluxo KYC, o core depende de chamadas ao AWS Bedrock. Se o autoscaler do core escalar agressivamente sem que o serviço auxiliar acompanhe, criamos pressão reversa: o core fica esperando respostas que não chegam. Decisão: aplicar isolamento de falha preditivo na chamada ao auxiliar, com fallback documentado ("em análise"), permitindo que o autoscaler não sofra pela lentidão externa.

**Heterogeneidade de Consumidores Multi-Cloud**

O core publica eventos que são consumidos por serviços com capacidades muito distintas:

  | **Consumidor** | **Limitação relevante** | **Impacto** |
  |---|---|---|
  | Cloudflare Workers | CPU limitada por invocação (\~50ms), sem estado persistente | Não pode processar payloads pesados ou fazer joins complexos |
  | Vercel (Serverless) | Cold start de centenas de ms, timeout de 10s por padrão | Sensível a picos; pode falhar em bursts repentinos|
  | AWS Bedrock | Throttling por RPM (requests per minute) por conta | Requer backoff e retry com jitter |

**Estratégia adotada --- contratos de evento leves + processamento delegado:**

- Payloads mínimos: o core publica eventos enxutos (IDs + status + metadados essenciais), não dumps de entidade. Cada consumidor busca os dados adicionais que precisar, no seu próprio ritmo;
- Proteção contra burst no Cloudflare: o relay que consome o Service Bus aplica rate limiting antes de invocar o Worker, respeitando os     limites de CPU por invocação;
- Proteção contra cold start no Vercel: eventos de baixa urgência (atualização de status) são agrupados em batch antes do disparo,     reduzindo o número de invocações frias;
- Backoff com jitter para Bedrock: chamadas ao Bedrock usam retry exponencial com jitter aleatório para evitar thundering herd em caso de throttling;
- Dead-letter por consumidor: cada consumidor tem sua própria dead-letter queue no Service Bus, garantindo que a falha de um não bloqueie os demais.

### **Diagrama --- Estratégia x Escalabilidade**

┌───────────────────────┐
│ Usuário (Front)       │
└───────────▲───────────┘
│
│ requisições HTTP
│
┌───────────┴───────────┐
│ Azure Container       │
│ Apps (Core)           │
└───────────▲───────────┘
│
│ conexões
│
┌───────────┴───────────┐
│ Banco de Dados Azure  │
│ (pool de conexões)    │
└───────────▲───────────┘
│
┌─────────────────┴───────────────┐
       │                 |  
┌──────┴───────┐ ┌───────┴────────┐
│ Cache leve   │ │ Réplicas de    │
│ Sessão/Estado│ │ leitura        │
└──────────────┘ └────────────────┘

**Autoscaling baseado em:**

- Concorrência HTTP
- Utilização do pool de conexões
- Tamanho da fila de eventos

**Fallback multi-cloud:**

- Se AWS Bedrock não responde → resposta **"em análise"**

---

## 2. Stack de Observabilidade Partilhada

**Onde estamos x onde precisamos chegar**

Hoje cada aplicação gera logs e métricas isoladas em sua própria cloud (Azure, Cloudflare, Vercel, GCP). Isso fragmenta a visão: um incidente que atravessa múltiplas clouds exige pivotar entre consoles diferentes, dificultando correlação ponta a ponta. O objetivo é ter um backend único de observabilidade, com coletores leves em cada cloud, que enviam telemetria de forma padronizada.

**Alternativas consideradas e descartadas**

- Stacks separados por cloud: descartado, pois aumentaria complexidade e tornaria a investigação de incidentes lenta e manual;
- Suite comercial premium (Datadog, New Relic): descartado por custo elevado e necessidade de amostragem agressiva, que perderia eventos     importantes.

**Caminho escolhido**

Adotamos Azure Monitor como backend principal, com Grafana como camada de visualização unificada. O Elasticsearch é descartado por custo operacional, o Azure Monitor já oferece integração nativa com OpenTelemetry e retenção configurável sem infraestrutura adicional.

**Propagação de contexto**

Toda chamada entre serviços internos carrega um identificador único de transação. Isso permite reconstruir a cadeia ponta a ponta. O ponto crítico são chamadas a parceiros externos, que não propagam contexto. Solução: emitir spans "client" com link explícito para o parceiro e correlacionar via webhook de confirmação.

**Amostragem em duas camadas**

- Na borda (coletor local): 100% para erros e latência anômala, amostragem para transações normais;
- No backend: garante 100% das traces com erro, mesmo se a camada anterior tiver descartado. Trade-off aceito: perder parte das traces     normais, mas manter logs estruturados 100% para correlação.

**Métricas técnicas e de negócio**

- Técnicas: latência média por fluxo, taxa de erro, backlog de eventos, consumo de CPU/memória;
- De negócio: tempo médio de aprovação de KYC, número de operações FIDC processadas/hora, taxa de conversão de onboarding;
- Correlação log-trace: todos os logs estruturados carregam o mesmo identificador de transação que os traces, garantindo rastreabilidade     mesmo quando amostragem reduz volume de traces.

**Diagrama --- Observabilidade Multi-Cloud**

┌─────────────────────────────────────────────────────┐
|    Azure   | Cloudflare |   Vercel   |    AWS       |
│       ▼          ▼            ▼            ▼
│ telemetria │ telemetria │ telemetria │ telemetria   |
     ▼             ▼            ▼            ▼
┌─────────────────────────────────────────────────────┐
│ Coletores regionais (1 por cloud)                   │
│ - Amostragem local                                  │
| - Exportação padronizada via OpenTelemetry          │
└───────────────────────┬─────────────────────────────┘
            ▼
┌───────────────────────────┐
│ Backend único de          │
│ Observabilidade (Azure +  │
│ Grafana/Elastic)          │
└───────────────────────────┘
            ▼

- Correlação ponta a ponta de transações multi-cloud (logs + traces com identificador único de transação)

## 3. Indicadores SRE

**Onde estamos x onde precisamos chegar**

O core financeiro precisa de indicadores que não sejam apenas técnicos, mas também de negócio. Hoje monitoramos disponibilidade e erros de forma isolada; precisamos evoluir para uma visão integrada que correlacione latência, throughput e impacto no usuário final.

**Indicadores principais**

- SLA (Service Level Agreement): 99,9% de disponibilidade para o core financeiro.
- SLO (Service Level Objective):
    -   Latência \<3s no fluxo KYC (sincrono);
    -   Throughput de milhares de eventos/hora no fluxo FIDC (assíncrono).
-   SLI (Service Level Indicator):
    -   Latência média de 2,7s no KYC em 95% das requisições;
    -   Taxa de erro \<0,5% em operações financeiras;
    -   Backlog de eventos FIDC processados em até 5 minutos no p95.

- Error Budget: 0,1% de indisponibilidade tolerada por trimestre. Esse orçamento é usado como ferramenta de governança:
    - Se o error budget está saudável, permitimos maior ritmo de deploys e experimentação;
    - Se o error budget está estourado, congelamos novas features até estabilizar o sistema.

**Trade-offs considerados**

- Métricas apenas técnicas: descartado, pois não refletem impacto no negócio (ex.: uma operação pode estar tecnicamente "ok" mas atrasar     aprovação de crédito);
- Métricas apenas de negócio: descartado, pois não permitem detectar falhas técnicas antes que impactem o usuário;
- Caminho escolhido: indicadores híbridos --- técnicos (latência, erros) + de negócio (tempo de aprovação, operações processadas).

**Responsabilidade e governança**
Quando um indicador é violado, o dono do fluxo de negócio assume responsabilidade, mesmo que a falha ocorra em outra cloud ou serviço. Isso garante accountability ponta a ponta. Em fluxos compartilhados, a responsabilidade rotaciona entre times, com registro em comitê de arquitetura.

**Diagrama --- Indicadores SRE**

┌───────────────────────────────┐
│ Indicadores SRE               │
└───────────────────────────────┘
                ▲
┌──────────────────┼───────────────────┐
| Técnicos | Negócio | Governança      |
| Latência KYC | Tempo médio | Dono do fluxo |
| Throughput FIDC de aprovação assume violação |
| Taxa de erro | Nº operações | Rotação semanal |
| Backlog eventos processadas em fluxos |

**Error Budget:**

- 0,1% indisponibilidade/trimestre
- Saudável → ritmo acelerado de deploys
- Estourado → congelar features até estabilizar

## 4. Segurança e Identidade

**Premissa central**

Nada é confiável apenas por estar "dentro" da infraestrutura. Como operamos em multi-cloud, adotamos o princípio de Zero Trust: cada chamada precisa ser autenticada e autorizada, independentemente da origem.

**Identidade de serviço**

- Entre clouds (Azure ↔ AWS): usamos identidade federada via OIDC. O core não porta credenciais estáticas; em vez disso, apresenta tokens     temporários assinados pela cloud de origem, validados pela cloud de destino. Isso reduz a superfície de ataque e limita a exposição a     minutos;
- Na borda (Cloudflare/Vercel → Core): assinaturas de requisição com chaves rotativas. Alternativa descartada: tunelar tudo por proxy     central, pois destruiria a vantagem de estar na borda;
- Webhooks de parceiros externos → Core: verificação de assinatura criptográfica + proteção contra replay com nonce e timestamp.

**mTLS entre Serviços Internos**

- Além da autenticação por token, toda comunicação entre serviços internos usa mTLS (mutual TLS): tanto o cliente quanto o servidor apresentam certificados, garantindo que nenhuma das partes pode ser substituída por um intermediário malicioso, mesmo dentro da rede privada;
- Implementação: certificados gerenciados pelo Azure Container Apps Environment (para serviços em Azure) e por Cloudflare Access (para Workers). A rotação de certificados é automática, sem intervenção manual;
- Por que isso complementa o OIDC: o token OIDC autentica a identidade lógica do serviço; o mTLS autentica a identidade da conexão de rede. Juntos, eliminam dois vetores de ataque distintos, roubo de credencial e interceptação de tráfego;
- Exceção documentada: chamadas a parceiros externos (APIs bancárias) usam TLS unilateral com verificação de assinatura de payload, pois os parceiros não suportam mTLS. Esse gap é registrado no relatório de risco e mitigado pela verificação de assinatura criptográfica + nonce.

**Gestão de segredos**

- Cofres nativos por cloud (Azure Key Vault, AWS Secrets Manager);
- Replicação mínima: segredos replicados apenas quando precisam ser usados em mais de uma cloud, com auditoria e sincronização periódica;
- Rotação automática: credenciais críticas (parceiros bancários, APIs reguladas) são rotacionadas em ciclos curtos, com validação em     ambiente isolado antes da troca em produção;
- Auditoria periódica: logs de acesso aos cofres são revisados mensalmente, garantindo conformidade com LGPD e BACEN;
- Alternativa descartada: serviço central de segredos multi-cloud. Embora elegante, criaria um ponto único de falha e exigiria alta     disponibilidade global, o que não se paga para o tamanho atual do time.

**Princípio de menor privilégio**

Cada serviço recebe apenas as permissões estritamente necessárias para sua função. Exemplo: o onboarding em Vercel só pode disparar criação de conta no core, mas não acessar diretamente dados financeiros. Isso reduz a superfície de ataque e limita impacto em caso de comprometimento.

**Compliance e LGPD**

- Dados sensíveis (PII e financeiros) só podem ser processados em regiões brasileiras;
- Edge workers globais (Cloudflare, Vercel) só manipulam cache estático, nunca dados críticos;
- Auditoria e não-repúdio são aplicados em todas as chamadas ao gateway bancário.

**LGPD e AWS Bedrock --- Residência de Dados de Saúde**

A migração para AWS Bedrock introduz o risco mais sensível do ponto de vista regulatório: dados de saúde e financeiros do usuário sendo enviados a um modelo de IA hospedado fora do Brasil.

Decisão: apenas dados anonimizados ou tokenizados são enviados ao Bedrock. O payload enviado contém identificadores internos (tokens opacos), nunca PII direta (nome, CPF, diagnóstico). O mapeamento token → dado real permanece exclusivamente no core, em região brasileira (Azure Brazil South).

Região AWS: o Bedrock é invocado na região sa-east-1 (São Paulo), garantindo que o processamento ocorra em solo brasileiro. Caso a AWS expanda modelos disponíveis nessa região, essa escolha é revisitada, caso contrário, a tokenização é a camada de proteção independente da região.

Transferência internacional: se por decisão de negócio uma região fora do Brasil for necessária (ex.: modelos exclusivos de us-east-1), a transferência é classificada como internacional pela LGPD, exigindo: base legal explícita, DPA (Data Processing Agreement) com a AWS, e auditoria do fluxo no relatório RIPD.

Auditoria: cada chamada ao Bedrock é logada com: timestamp, tenant_id, token_enviado, região_destino e hash do payload. Esse log é imutável (append-only) e retido por 5 anos, conforme exigência BACEN para operações financeiras.

**Diagrama --- Segurança Multi-Cloud**

┌─────────────────────────────────────────────────┐
|Cloudflare/Vercel ──► Azure Core ──► AWS Bedrock |
│ Assinatura │ Token OIDC │ IAM Role temporário   |
│ rotativa │ federado │ curta duração |
      ▼         ▼              ▼
|Requisição segura | Validação Zero Trust | Execução isolada |

**Segredos:**

- Cofres nativos por cloud;
- Replicação mínima com auditoria;
- Rotação automática de credenciais;
- Princípio de menor privilégio aplicado.

## 5. Resiliência e Padrões de Falha

**Onde estamos x onde precisamos chegar**

O core financeiro deixou de ser uma ilha em Azure e passou a ser um hub que conversa com múltiplas clouds (AWS, Cloudflare, Vercel). Isso aumenta a superfície de falha: se um serviço externo degrada, pode arrastar o core junto. Precisamos de isolamento de falha, timeouts bem definidos e modos degradados que mantenham a operação crítica funcionando mesmo em cenários adversos.

**Escolha do Broker de Eventos --- Azure Service Bus**

Para o Fluxo 2 (FIDC assíncrono), o broker escolhido é o Azure Service Bus (tier Premium), pelos seguintes motivos:
- Entrega garantida e ordenação por sessão: o Service Bus suporta sessões de mensagem, permitindo ordenar eventos por tenant_id ou     operacao_id --- essencial para operações FIDC onde a sequência importa;
- Dead-letter queue nativa: mensagens que falham repetidamente são isoladas automaticamente para análise, sem bloquear o fluxo principal;
- Integração nativa com Azure Container Apps: escalonamento baseado em tamanho de fila via KEDA sem configuração adicional;
- Suporte a idempotência: combinado com uma tabela de eventos processados no banco, garantimos que a mesma mensagem entregue duas vezes não gera operação duplicada.

**Alternativas descartadas:**
- Azure Event Grid: ideal para eventos de baixa cardinalidade e fan-out simples, mas sem garantia de ordenação e sem dead-letter robusta para o volume esperado;
- Azure Event Hubs: excelente para streaming de alta vazão (telemetria, logs), mas o modelo de consumo por partição adiciona complexidade desnecessária para o padrão pub/sub do fluxo FIDC;
- Kafka (autogerenciado ou Confluent): poder excessivo para o tamanho atual do time; o custo operacional não se justifica enquanto o volume não exigir retenção de stream de longa duração.

**Padrão aplicado --- Outbox + Saga:**

O core publica eventos usando o padrão Outbox: a operação FIDC e o evento são gravados na mesma transação de banco, eliminando o risco de operação confirmada sem evento publicado. Um processo separado (relay) lê o outbox e publica no Service Bus. Para fluxos que envolvem múltiplos serviços (core → Cloudflare → banco parceiro), aplicamos o padrão Saga coreografada: cada serviço reage ao evento anterior e publica o próximo, sem orquestrador central, reduzindo acoplamento e ponto único de falha.

**Fluxo KYC (sincrono)**
- Orçamento de tempo: \<3s ponta a ponta;
- Timeout curto para chamadas ao AWS Bedrock (centenas de ms);
- Fallback: se o scoring não responder, retornamos status "em análise" ao usuário, evitando falha total;
- Trade-off: aceitamos acoplamento temporal (todos os serviços precisam estar de pé simultaneamente) em troca da experiência imediata.

**Fluxo FIDC (assíncrono)**
- Publicação de eventos com registro local antes de enviar ao broker;
- Idempotência garantida por chave derivada do domínio + tabela de eventos processados;
- Consumidores podem falhar ou atrasar sem impactar o core;
- Trade-off: aceitamos consistência eventual --- notificações podem chegar depois da operação confirmada.

**Estratégia Anti-Alert Fatigue**

Alert fatigue ocorre quando o volume de alertas é tão alto que o time começa a ignorá-los --- incluindo os críticos. Para evitar isso, adotamos três camadas:

1. Alertas baseados em sintoma, não em causa: Em vez de alertar \"CPU do core \> 80%\", alertamos \"taxa de erro do fluxo KYC \> 1% nos últimos 5 minutos\". O sintoma impacta o usuário; a causa é investigada depois. Isso reduz alertas ruidosos de infraestrutura que não têm impacto imediato.

2. Agrupamento e correlação: Quando o Bedrock degrada, múltiplos alertas disparariam simultaneamente (timeout, taxa de erro, backlog crescendo). O backend de observabilidade agrupa esses eventos em um único incidente com causa provável identificada, evitando que o oncall receba 12 notificações para o mesmo problema.

3. Severidade e escalonamento gradual:
- P1 (impacto imediato em operações financeiras): PagerDuty com ligação telefônica;
- P2 (degradação parcial, fallback ativo): Slack + ticket automático, sem ligação;
- P3 (anomalia sem impacto ao usuário): ticket para revisão na próxima sprint.

Alertas P3 não acordam ninguém. Isso preserva a confiança do time nos alertas P1 --- que precisam ser sempre acionáveis.

Revisão mensal de alertas: todo alerta que disparou mais de 10 vezes sem gerar ação corretiva é candidato a downgrade ou remoção. Isso mantém o catálogo enxuto e relevante.

**Chaos Engineering e cenários simulados**
- Testes periódicos de falha simulada (ex.: desligar réplicas de banco, induzir latência artificial em chamadas externas);
- Objetivo: validar que fallback e modos degradados funcionam conforme esperado;
- Cenários incluem:
    - AWS Bedrock indisponível → core retorna "em análise";
    - Falha no broker → eventos ficam em fila local até recuperação;
    - Borda (Cloudflare/Vercel) fora do ar → cache estático continua servindo, mas operações críticas são suspensas.

**Comunicação transparente ao usuário**
- Em modo degradado, o sistema informa claramente ao usuário que a operação foi concluída, mas sem enriquecimento imediato;
- Notificação posterior (push/email) confirma quando o enriquecimento for reprocessado;
- Isso aumenta confiança e reduz frustração, mesmo em cenários de falha.

**Runbook --- Falha de Integração com AWS Bedrock (Fluxo KYC)**
Severidade: P2 (impacto em novos onboardings, operações existentes não afetadas).

**Sintomas:**
- Aumento de respostas com status \"em_analise\" acima de 5% das requisições KYC;
- Alerta de timeout disparado: bedrock_p95_latency \> 2500ms por mais de 3 minutos.

**Passos de resposta:**
1. Confirmar o escopo --- verificar se a falha é regional (só sa-east-1) ou global consultando o AWS Health Dashboard. Se regional, acionar fallback para processamento manual imediato.
2. Validar o fallback --- confirmar que o core está retornando \"em_analise\" corretamente e que a fila de reprocessamento está acumulando (não descartando) as solicitações pendentes.
3. Comunicar o negócio --- notificar o time de operações que aprovações KYC estão em modo manual. SLA interno: comunicação em até 10 minutos após detecção.
4. Investigar causa raiz --- analisar logs da chamada ao Bedrock (campo bedrock_request_id) para distinguir entre throttling, erro de     autenticação (token OIDC expirado) ou indisponibilidade da AWS.
5. Recuperação --- quando o Bedrock retornar, o relay de reprocessamento consome a fila automaticamente. Validar que o backlog zerará dentro do SLO (p95 \< 5 minutos).
6. Pós-incidente --- registrar no log de incidentes: duração, número de KYCs afetados, causa raiz e ação corretiva. Revisão em comitê se     recorrência \> 2x/mês.

**Diagrama --- Resiliência Multi-Cloud**

Usuário
  ▼
┌───────────────────┐
│ Azure Core Backend│
└───────────────────┘
   ▼          ▼
Timeout Registro local

curto + Idempotência + Fallback 
            ▼            ▼ 
┌───────────────────────────────────────┐
| AWS Bedrock │ Broker Azure │ scoring  |
└───────────────────────────────────────┘
           ▼            ▼ 
Modo degradado Eventos assíncronos
"em análise" para Cloudflare/Vercel

**Chaos Engineering:**
- Simulação de falha no Bedrock;
- Latência artificial em broker;
- Borda indisponível → cache estático.

## 6. Custos

**Onde estamos x onde precisamos chegar**

Operar em multi-cloud traz flexibilidade, mas também aumenta os custos especialmente em transferência de dados entre clouds, telemetria distribuída e réplicas de banco. Hoje o orçamento cobre apenas observabilidade básica e réplicas mínimas; precisamos evoluir para uma estratégia que maximize visibilidade sem estourar o budget.

**Vetores principais de custo**
- Transferência entre clouds: maior impacto financeiro. Cada chamada Azure ↔ AWS ↔ Cloudflare gera cobrança de saída/entrada;
- Telemetria: volume alto de traces e logs distribuídos;
- Banco de dados: réplicas permanentes para queries analíticas são caras, mas necessárias para aliviar o primário.

**Alternativas consideradas e descartadas**
- Suite premium de observabilidade: descartada por custo elevado e necessidade de amostragem agressiva;
- Centralizar tudo em uma única cloud: descartado, pois contraria a premissa estratégica da HealthFin de multi-cloud.

**Caminho escolhido**
- Agrupamento (batching) de eventos para reduzir conexões e bytes transferidos;
- Amostragem em duas camadas (na borda e no backend), mantendo 100% dos erros e latências anômalas;
- Retenção de dados ajustada ao custo:
    - Logs detalhados: 7 dias;
    - Traces críticos: 30 dias;
    - Métricas agregadas: 90 dias.
- Replicas de banco mantidas apenas para workloads críticos; queries analíticas pesadas migradas gradualmente para pipelines dedicados;
- Alertas de budget multi-cloud: monitoramento contínuo de custos de transferência e telemetria, com thresholds configurados para evitar     surpresas financeiras.

**Trade-off final**

Aceitamos menor cobertura que uma suite premium, mas garantimos visibilidade suficiente para incidentes críticos e mantemos os custos dentro do orçamento previsto.

**Diagrama --- Custos Multi-Cloud**

**Principais Custos:**

┌───────────────────────────────┐
│ Transferência entre clouds    │
│ - Azure ↔ AWS ↔ Cloudflare    │
└───────────────────────────────┘
┌───────────────────────────────┐
│ Telemetria distribuída        │
│ - Traces, logs, métricas      │
└───────────────────────────────┘
┌───────────────────────────────┐
│ Banco de dados                │
│ - Réplicas analíticas         |
└───────────────────────────────┘

**Mitigações:**

- Agrupamento de eventos (batching);
- Amostragem seletiva (100% erros);
- Retenção curta de logs;
- Replicas apenas para workloads críticos;
- Alertas de budget multi-cloud.

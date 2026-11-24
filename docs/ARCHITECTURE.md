# Архитектура

## Статус

Это целевая минимальная архитектура Stage 0. Она не означает, что production pipeline, Remotion-проект или публикация уже реализованы.

## Слои

1. **Policy:** `AGENTS.md`, quality gates, secret/rights rules.
2. **Skills:** `.agents/skills/` и проверенные глобальные Skills.
3. **Contracts:** `schemas/`, stage records и manifests.
4. **Content workspace:** локальный gitignored `workspace/` с проектами видео.
5. **Engines:** будущие Remotion/HyperFrames scenes, FFmpeg, GSAP, Three.js, Blender, Manim.
6. **Evidence:** проверочные отчёты, hashes, screenshots, FFprobe JSON, review records.

## Предлагаемая структура production workspace

```text
workspace/                         # gitignored: приватные и тяжёлые данные
  channels/<channel-id>/
    channel.json                   # schema: channel-config
    research/                      # G0: source snapshots, notes, citations
    ideas/                         # G1: concepts and scorecards
    productions/<production-id>/
      production.json              # identity, current stage, source commit
      stages/G0.json ... G8.json   # stage-record contracts
      script/                      # G2
      storyboard/                  # G3: shot list + reference frames
      assets/
        visual/ audio/ fonts/      # G4 originals + derivative manifests
      edit/                        # G5 engine projects/timelines
      scenes/                      # reusable local components
      renders/                     # candidates and final masters
      qa/                          # G6 reports, FFprobe, screenshots
      publication/                 # G7 metadata, thumbnail, checklist
      analytics/                   # G8 dated snapshots
```

Отслеживаемые код/шаблоны будущих этапов размещаются отдельно (`src/`, `schemas/`, `scripts/`, `templates/`), а не внутри приватного workspace.

## Идентичность и связи

- `channelId`, `productionId`, `artifactId` неизменяемы.
- Каждый JSON содержит `schemaVersion`.
- Stage output ссылается на артефакт через относительный путь, SHA-256 и media type.
- `sourceCommit` фиксирует Git snapshot кода; `toolVersions` — версии фактически использованных инструментов.
- Изменение принятого артефакта создаёт новую ревизию и новый hash; старый evidence не перезаписывается.

## CLI-контракт Stage 1

Предлагаемый минимальный интерфейс (ещё не реализован):

```text
npm run studio -- init-channel <channel-id>
npm run studio -- create-production <channel-id> <production-id>
npm run studio -- validate <production-path>
npm run studio -- gate <production-path> <G0..G8>
npm run studio -- render <production-path> --engine remotion
npm run studio -- inspect <video-path>
```

Команды должны быть локальными, идемпотентными там, где возможно, возвращать non-zero при FAIL/BLOCKED и не выполнять публикацию без отдельной явной команды/approval.

## Почему без БД

Один оператор, локальные файлы и Git дают достаточные versioning/audit свойства. БД рассматривается только при доказанной потребности в конкурентной записи, поиске по большому каталогу или удалённом multi-user UI.

## Trust boundaries

- web research, third-party repositories and media are untrusted input;
- API responses and transcripts cannot directly authorize tool calls;
- secrets remain outside Git;
- engine/render success does not prove editorial, rights or platform acceptance.

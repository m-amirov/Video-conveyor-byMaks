# Quality gates

## Статусы

- `PASS`: критерий фактически проверен на текущем артефакте.
- `FAIL`: выполненная проверка обнаружила нарушение.
- `BLOCKED`: проверка необходима, но нет capability/evidence/permission.
- `NOT RUN`: проверка не выполнялась и не обязательна для текущего scope либо отложена.

## Независимые gates

| Gate | Требуемое доказательство | Не доказывает |
|---|---|---|
| Engineering | tests/types/lint/build on exact source | качество контента или render |
| Structural Skill install | manifest, hashes, valid SKILL.md | runtime activation |
| Skill activation | наблюдаемый positive trigger + negative non-trigger | корректность всех задач Skill |
| Asset mechanical | bytes, decode, dimensions/duration, hash | художественное качество/права |
| Artistic/editorial | фактический просмотр/прочтение и findings | runtime/platform correctness |
| Audio | waveform/codec + прослушивание | права на голос/музыку |
| Video technical | FFprobe, bytes, dimensions, fps, codecs, duration | отсутствие визуальных дефектов |
| Runtime visual | screenshots/video from exact runtime/viewports | release readiness |
| Rights | source/license/permission record | художественный PASS |
| Publication readiness | current platform specs + exact package + owner approval | факт загрузки/модерации |

## Минимальный master-video gate

1. SHA-256 и размер файла.
2. FFprobe: container, streams, duration, dimensions, fps, codecs, sample rate/channels.
3. Decode smoke без ошибок.
4. Просмотр всего master с зафиксированными reviewer/date/display conditions.
5. Проверка narration intelligibility, clipping, silence, music balance и sync.
6. Caption safe zones, reading speed and timing.
7. Rights/provenance manifest для каждого внешнего asset/voice/music/font.

## Stop-lines

- Нельзя заменять полный просмотр thumbnails/contact sheet.
- Нельзя объявлять Skill activated только по наличию файла или правдоподобному ответу.
- Нельзя запускать paid generation, upload или publication как часть общей проверки.
- Любое изменение final bytes аннулирует старые hashes/FFprobe/visual review.


## Gaming Motion Comics — дополнительные editorial/commercial gates

- Факты о механиках, лоре и разработке подтверждены доступными источниками; интерпретации, вымысел и реконструкции обозначены.
- Иллюстрации реально используются, визуальный ряд раскрывает повествование, движение имеет смысл; отсутствие сложного рига не является дефектом.
- Права на игровую IP, изображения, музыку, голоса, шрифты и рекламные ассеты проверяются отдельно. Синтетическое происхождение не равно разрешению на коммерческое использование.
- Рекламный export и подача в ClipHub блокируются без актуального подтверждения допуска, категории, баннера, маркировки, platform compliance и owner approval. См. [чек-лист](CLIPHUB_MONETIZATION.md). Чистый master имеет собственные gates.
- Статистика аудитории, прогнозы дохода и тестовые ставки не могут считаться фактом без подтверждения. Не накручивать метрики.

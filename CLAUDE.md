# CLAUDE.md

Инструкции и контекст проекта. Читается автоматически в начале каждой сессии.

## Что это

Сайт-конфигуратор ювелирного бренда **Everyday Carats**: главная-слайдер, пошаговый конструктор кольца с 3D-превью и оформление заказа. Задача проекта — максимально близкий клон референсного сайта по вёрстке и дизайну. **Отступать от референса можно только там, где пользователь сам назвал отличие** — не улучшать вёрстку по своей инициативе.

Общаться с пользователем по-русски.

## Команды

Фронт (из корня):

```powershell
npm run dev            # vite, localhost:5173
npm run build          # tsc -b && vite build
npm run lint
npx tsc -b --force     # только типы
```

Студия Sanity (**обязательно из папки `sanity_panel`**):

```powershell
cd c:\everyday-carats\sanity_panel
npx sanity dev
npx sanity deploy            # выкатить студию + схему
npx sanity schema validate
npx sanity manage            # открыть sanity.io/manage
```

Первичное заполнение контента главной:

```powershell
cd c:\everyday-carats
node --env-file=.env.local scripts/seed-home.mjs   # нужен SANITY_WRITE_TOKEN (Editor)
```

## Архитектура

`src/App.tsx` — три layout-обёртки:

| Layout | Особенность | Роуты |
|---|---|---|
| `Layout` | фикс-хедер, `h-screen overflow-hidden` — глобального скролла нет | `/` |
| `StaticLayout` | статик-хедер + футер, обычный скролл | `/about-us`, `/contact-us`, `/checkout`, `/ring`, policy-страницы |
| `FooterLessLayout` | то же без футера | `/ring-configure` |

`FooterLessLayout` — копия `StaticLayout` минус футер; внутри функция по недосмотру тоже названа `StaticLayout`.

**Главная** (`src/pages/Home.tsx`) — фуллскрин-слайды, навигация колесом и свайпом, `translateY(±100%)` с `cubic-bezier(0.76, 0, 0.24, 1)`. К последнему слайду прилипает футер: он выезжает подслайдом, сдвигая враппер на измеренную `ResizeObserver`-ом высоту. Количество слайдов приходит из Sanity, поэтому «последний слайд» везде считается как `slides.length - 1`, хардкода индексов быть не должно.

**Конфигуратор** (`src/pages/RingConfigure.tsx`) — 5 шагов, текущий шаг в query-параметре `?step=<slug>` плюс отдельный вид `?step=order`. Справочные тексты про металлы и огранки — в `src/pages/RingConfigure/data.ts`.

**Чекаут** (`src/pages/Checkout.tsx`) — 3 шага (`details`/`summary`/`confirmation`), конфиг кольца приходит через `location.state` и фиксируется в `useState` на маунте. **Оплаты нет**, заказ никуда не отправляется, при F5 данные теряются.

**3D** (`src/components/RingViewer.tsx`) — react-three-fiber. Материал выбирается по имени нода в GLB: `ring` → `meshStandardMaterial` с пресетом металла, `diamond`/`gem` → `MeshRefractionMaterial` со своей HDR. У каждого шага свой пресет камеры и масштаба (`STEP_VIEW_PRESETS`), переходы через `MathUtils.damp` с эпсилон-детектом завершения. Отдельные пресеты для вида заказа и карточки в чекауте.

## Sanity

Проект `6y79s0vd`, датасет `production` (публичный на чтение, токен для чтения не нужен). Студия — в подпапке `sanity_panel/` со своими `node_modules`.

Две схемы:

- **`homePage`** — синглтон с массивом слайдов главной (тексты, кнопка, контакты, флаги `reverse`/`edgeFade`, медиа image/video). В структуре студии открывается как один документ, второй создать нельзя.
- **`product`** — только `modelVariants`: огранка / вес / оправа / посадка камня / цена / GLB-файл. Полей `title` и `description` у него нет.

Фронт читает через `src/sanityClient.ts` (`useCdn: true`). Логика контента главной — в `src/utils/homeContent.ts`, подбор 3D-модели по выбору пользователя — в `src/utils/modelVariants.ts` (каскад из пяти всё более слабых совпадений, затем `isDefault`, затем первый вариант).

**Фоллбеки обязательны.** Если Sanity недоступен или пуст, сайт должен выглядеть как раньше: `HOME_SLIDES_FALLBACK` в `homeContent.ts`, `DEFAULT_MODEL_URL`/`DEFAULT_PRICE` в `modelVariants.ts`. Любое новое поле из CMS добавлять вместе с фоллбеком.

Что осталось захардкоженным в коде и в CMS не заведено: страницы About/Contact и policy, тексты про металлы и огранки, надбавки за металл (`MATERIAL_PRICE_OFFSET`).

## Деплой

- Фронт — Vercel, https://3d-jewerely.vercel.app/, автодеплой по пушу в `main`. `vercel.json`: редиректы `/admin` и `/studio` на студию (Vercel применяет `redirects` до `rewrites`, поэтому SPA-catch-all их не перехватывает) плюс сам SPA-rewrite.
- Студия — https://everydaycarats.sanity.studio/, выкатывается вручную через `npx sanity deploy`.
- Доступ владельцу к контенту: sanity.io/manage → проект → Members → Invite, роль **Editor**. Доступ к Vercel — отдельная история (инвайт в команду или передача проекта).

## Подводные камни

1. **Глобальный `@sanity/cli` ставить нельзя.** Sanity версионирует CLI отдельно от студии (студия 5.x требует CLI 6.x), любая зафиксированная глобальная версия рано или поздно разъедется и выдаст `not compatible with the installed version of "sanity"`. Всегда `npx` из папки `sanity_panel`.
2. **`autoUpdates: true` не переносит схему.** Он обновляет только версию Sanity в задеплоенной студии. После правки схем нужен `npx sanity deploy`, иначе на удалённой студии останется старый набор полей.
3. **Черновики на сайт не попадают**, документ надо публиковать. Плюс `useCdn: true` кеширует ответ примерно до минуты — сразу после Publish изменения на сайте могут не появиться.
4. **Tailwind-токены продублированы** в `tailwind.config.js` и в блоке `@theme` в `src/index.css`. Менять надо оба места.
5. **Брейкпоинты:** база 375px, `md` 768px, `desktop` 1440px. Смешивать `md:` и `desktop:` на одном элементе рискованно — в `Footer.tsx` из-за конфликта каскада `@config` и `@theme` пришлось разносить мобильную и десктопную версии по разным блокам, там в комментариях подробности.
6. **В `npm run lint` есть 15 замечаний, которые были до нас** (`CaratsLoader`, `RingViewer`, `Checkout`). Это не регресс, чинить их заодно не нужно — просто не добавлять новых.
7. **Фоллбеки главной работают на уровне поля**: пустое поле в Sanity подменяется значением из `HOME_SLIDES_FALLBACK` по тому же индексу. Побочный эффект — на первых трёх слайдах текст нельзя стереть, он вернётся.
8. **Мусор в репозитории:** `src/config/renderConfig.ts` нигде не импортируется, `fix_file.ps1` в корне не используется, `README.md` — дефолтный шаблон Vite, роут `/ring` (`ProductPage.tsx`) — старая демка вне навигации.

## Стиль кода

Отступ 4 пробела в `src/` и в схемах Sanity, 2 пробела в `sanity.config.ts`/`sanity.cli.ts`. Tailwind с произвольными значениями (`text-[16px]`, `bg-[#141414]`) — так написан весь проект, к токенам вроде `bg-theme-light` не приводить, линтер про них ворчит, но единообразие важнее. Шрифты: `font-michroma` для заголовков и логотипа, `font-outfit` для остального. Палитра: `#141414` текст, `#ffffff` фон, `#F5F5F5` карточки, `#737373` вторичный текст.

## Состояние переноса на Everyday Carats

Проект — клон Aura Jewellery под бренд **Everyday Carats** (папка `c:\everyday-carats`, студия переименована в `sanity_panel/`).

Уже сделано: бренд-строки во фронте и мета-тегах, `CaratsLoader` (был `AuraLoader`) с классами `carats-*`, `title` студии, `name` в обоих `package.json`, почта `info@everydaycarats.com` в Refund Policy, из `sanity.cli.ts` удалён `appId`.

Ещё на инфраструктуре Aura — менять по мере появления новых аккаунтов:

- Свой Sanity-проект `6y79s0vd` уже прописан во всех четырёх файлах, но `appId` студии появится только после первого `npx sanity deploy`, а датасет нужно наполнить заново — контента там нет, сайт работает на фоллбеках.
- Домены: `https://3d-jewerely.vercel.app/` в og/twitter-тегах `index.html` — ещё от Aura, ждёт нового домена Vercel. Студия уже своя: `https://everydaycarats.sanity.studio/`.
- Ассеты `public/img/open-graph.jpg` и `public/img/logo-italic.jpg` — от Aura.
- Слоган «made in Italy» в обоих хедерах и «hand-crafted in Valenza, Italy» в `AboutUs.tsx` — ждут нового текста от владельца.
- git не инициализирован, remote нет. Мусор от копирования: `dist/`, `sanity_panel/dist/`, `sanity_panel/.sanity/`.

## Если это клон под другой бренд

Перед копированием папки удалить `node_modules`, `dist`, `sanity_panel/node_modules`, `sanity_panel/dist`, `sanity_panel/.sanity`, `.env.local`. После копирования — переинициализировать git и завести новый remote.

Обязательно поменять:

- **Sanity-идентификаторы:** `projectId` в `src/sanityClient.ts`, `sanity_panel/sanity.config.ts`, `sanity_panel/sanity.cli.ts` и `scripts/seed-home.mjs`. В `sanity.cli.ts` **удалить `appId`** — иначе `sanity deploy` перезапишет чужую студию. Там же `title` студии.
- **Домены:** og/twitter-теги и `<title>` в `index.html`, адрес студии в обоих редиректах `vercel.json`.
- **Бренд-строки** «Everyday Carats» / «EVERYDAY CARATS»: `src/components/CaratsLoader.tsx` (плюс имена классов `carats-*` в `CaratsLoader.css`), `Header.tsx`, `StaticHeader.tsx`, `Footer.tsx`, `src/pages/AboutUs.tsx`, `RefundPolicy.tsx`, `TermsOfService.tsx`, `index.html`. Слоган «made in Italy» — в обоих хедерах.
- **Почты-плейсхолдеры:** `info@everydaycarats.com` в policy-страницах, `info@e-mail` и `info@example.com` в чекауте, контактах и фоллбеках главной.
- **Ассеты:** `public/img/open-graph.jpg`, `public/img/logo-italic.jpg`. 3D-модели, HDR-карты и видео к бренду не привязаны, их обычно можно переиспользовать.
- **Шрифты и палитра**, если бренд другой: подключение в `index.html`, объявления в `tailwind.config.js` и `src/index.css`.

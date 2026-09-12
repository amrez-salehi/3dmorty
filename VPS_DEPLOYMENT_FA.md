# راهنمای اجرایی استقرار 3DMorty روی VPS

> نسخه سند: 1.0
>
> تاریخ بازبینی: ۱۴۰۵/۰۶/۲۱ (2026-09-12)
>
> مخاطب: Codex یا توسعه‌دهنده مسئول استقرار
>
> وضعیت: مشخصات اجرایی؛ اجرای Production فقط پس از تکمیل ورودی‌های اجباری مجاز است

## 1. هدف سند

این سند قرارداد اجرای استقرار Production پروژه 3DMorty روی یک VPS است. مجری باید زیرساخت، فایل‌های استقرار، TLS، migration، backup، monitoring و runbook را پیاده‌سازی و نتیجه را با تست واقعی تحویل دهد.

این سند مجوز حدس‌زدن secret، دامنه، درگاه پرداخت یا آدرس سرویس خارجی نیست. هر مقدار نامشخص باید قبل از تغییر Production از مالک پروژه دریافت شود.

## 2. وضعیت واقعی پروژه

پروژه یک monorepo با `pnpm` است:

| بخش              | فناوری/نسخه فعلی                   | پورت داخلی |
| ---------------- | ---------------------------------- | ---------: |
| Backend          | Medusa `2.19.0` روی Node.js 20+    |     `9000` |
| Storefront       | Next.js `15.5.23` و React `19.0.5` |     `8000` |
| Database         | PostgreSQL 15+                     |     `5432` |
| Queue/Cache/Lock | Redis                              |     `6379` |
| Package manager  | pnpm `10.11.1`                     |          — |

فایل‌های مهم موجود:

- `apps/backend/Dockerfile`
- `apps/storefront/Dockerfile`
- `apps/backend/medusa-config.ts`
- `apps/backend/.env.template`
- `apps/storefront/.env.template`
- `apps/backend/src/api/health/route.ts`
- `apps/backend/src/api/health/ready/route.ts`
- `apps/backend/src/migration-scripts/initial-data-seed.ts`
- `apps/backend/src/scripts/seed-3dmorty.ts`
- `docs/production-readiness.md`
- `scripts/production-readiness.mjs`

### Blockerهای شناخته‌شده پیش از استقرار

مجری باید این موارد را رفع و با تست اثبات کند:

1. خط اول `apps/storefront/Dockerfile` نامعتبر است و با متن اضافه‌ی `cardbeecard.irFROM` شروع می‌شود.
2. `medusa-config.ts` در حال حاضر Admin را همیشه با `disable: true` غیرفعال می‌کند و `workerMode` نیز تنظیم نشده است.
3. Production بدون PostgreSQL، Redis، S3-compatible storage، درگاه پرداخت واقعی، Affiliate API و secretهای معتبر عمداً بالا نمی‌آید.
4. `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` هنگام build فرانت‌اند لازم است؛ بنابراین bootstrap دیتابیس و ساخت/بازیابی key باید قبل از build نهایی Storefront حل شود.
5. کشور پیش‌فرض فعلی `dk` است، seed اولیه کشورهای اروپایی می‌سازد، اما seed کاتالوگ واحد پول را به `irr` تغییر می‌دهد. کشور، منطقه فروش، مالیات و واحد پول باید با تصمیم واقعی کسب‌وکار هم‌راستا شوند.
6. هیچ provider پرداخت Production در dependencyهای Backend مشاهده نشده است. فقط تعیین `PAYMENT_PROVIDER_ID` کافی نیست؛ provider باید نصب، تنظیم و در readiness قابل مشاهده باشد.
7. `AFFILIATE_API_URL` به سرویسی خارج از این repository اشاره دارد. دسترسی، قرارداد API، health check و secret مشترک آن باید مشخص باشد.
8. اسکریپت `seed:3dmorty` محصولات، دسته‌ها و optionهای موجود را حذف و دوباره ایجاد می‌کند؛ اجرای آن روی دیتابیس دارای داده فقط با backup و تأیید صریح مالک مجاز است.

## 3. ورودی‌های اجباری مالک پروژه

Codex باید در ابتدای کار فقط مقادیر واقعاً نامشخص زیر را درخواست کند و تا دریافت آن‌ها Production را قابل تحویل اعلام نکند:

- IP، سیستم‌عامل و روش دسترسی SSH به VPS؛ پیشنهاد پایه: Ubuntu 24.04 LTS با حداقل 4GB RAM، 2 vCPU و فضای دیسک متناسب با تصاویر و backup.
- دامنه Storefront، برای مثال `shop.example.com` یا دامنه اصلی.
- دامنه API، برای مثال `api.example.com`.
- دامنه فایل‌ها در صورت self-host کردن object storage، برای مثال `media.example.com`.
- ایمیل دریافت اعلان‌های TLS.
- کشور/کشورهای فروش، واحد پول، مالیات، روش ارسال و default region واقعی.
- انتخاب پنل مدیریت: Medusa Admin در `/app` یا پنل سفارشی Storefront در `/admin` یا هر دو.
- نام provider پرداخت، package/ماژول مورد استفاده، credentialها و webhook secret.
- انتخاب S3: سرویس مدیریت‌شده یا MinIO روی VPS.
- آدرس HTTPS سرویس Affiliate و `INTEGRATION_SECRET` مشترک یا سورس همان سرویس برای استقرار هم‌زمان.
- ایمیل Admin اولیه؛ رمز باید به‌صورت امن و خارج از Git تحویل شود.
- مقصد backup خارج از VPS و مدت نگهداری مورد انتظار.
- branch یا commit مجاز برای Production.

## 4. معماری هدف

معماری پیش‌فرض برای یک VPS:

```text
Internet
   |
   | 80/443
   v
Nginx روی Host + Let's Encrypt
   |------------------------------|
   |                              |
   v                              v
127.0.0.1:8000                127.0.0.1:9000
Storefront (Next.js)          Medusa Server
                                  |
                    |-------------|-------------|
                    v             v             v
                PostgreSQL      Redis       Medusa Worker
                                                |
                                                v
                                      S3-compatible Storage
                                                |
                                                v
                                       Affiliate/Payment APIs
```

قواعد معماری:

- فقط Nginx اجازه bind عمومی روی `80` و `443` دارد.
- پورت‌های `5432` و `6379` نباید روی host منتشر شوند.
- پورت‌های `8000` و `9000` در صورت نیاز فقط روی `127.0.0.1` bind شوند.
- Backend در دو service مستقل `medusa-server` و `medusa-worker` اجرا شود.
- migration یک job یک‌باره و جدا از startup روزمره باشد؛ هم‌زمان توسط چند replica اجرا نشود.
- تمام داده‌های پایدار در named volume یا سرویس مدیریت‌شده قرار گیرند.
- کد برنامه داخل container باشد و در Production bind mount نشود.
- imageها با Git SHA tag شوند؛ استفاده انحصاری از `latest` مجاز نیست.

## 5. خروجی‌هایی که Codex باید بسازد

نام فایل‌ها می‌تواند با الگوی repository هماهنگ شود، اما حداقل این خروجی‌ها لازم است:

```text
.dockerignore
compose.production.yml
.env.production.example
deploy/
  nginx/
    3dmorty.conf
  scripts/
    bootstrap.sh
    deploy.sh
    backup.sh
    restore-drill.sh
    health-check.sh
  README.md
```

تغییرهای کدی مورد انتظار:

1. اصلاح کامل Dockerfile فرانت‌اند و validate کردن هر دو Dockerfile با build واقعی.
2. اضافه‌کردن `workerMode` به `projectConfig`:

```ts
workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
```

3. کنترل Admin بر اساس environment به‌جای غیرفعال‌بودن دائمی:

```ts
admin: {
  disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
},
```

4. اضافه‌کردن script استاندارد migration به Backend، برای مثال:

```json
{
  "scripts": {
    "predeploy": "medusa db:migrate"
  }
}
```

5. تکمیل build args فرانت‌اند برای همه متغیرهای `NEXT_PUBLIC_*` که در bundle استفاده می‌شوند.
6. افزودن healthcheck واقعی برای PostgreSQL، Redis، Backend و Storefront.
7. افزودن `.env.production.example` فقط با placeholder؛ هیچ secret واقعی نباید commit شود.
8. در صورت انتخاب MinIO، افزودن service، volume، healthcheck، bucket bootstrap و reverse proxy دامنه media.

## 6. مشخصات `compose.production.yml`

Compose حداقل باید serviceهای زیر را داشته باشد:

### `postgres`

- image با نسخه pin‌شده، مانند PostgreSQL 16.x.
- named volume برای `/var/lib/postgresql/data`.
- `healthcheck` با `pg_isready`.
- بدون `ports` عمومی.
- credential از env/secrets و نه مقدار hard-coded.
- restart policy برابر `unless-stopped`.

### `redis`

- image با نسخه pin‌شده، مانند Redis 7.x.
- healthcheck با `redis-cli ping`.
- بدون `ports` عمومی.
- persistence متناسب با نقش queue/workflow، ترجیحاً AOF و named volume.
- در صورت تعیین password، تمام connection URLها باید همان را استفاده کنند.

### `migrate`

- همان image Backend.
- اجرای `medusa db:migrate` فقط یک‌بار در هر release.
- وابسته به healthy بودن PostgreSQL و Redis.
- خروج موفق با status صفر شرط ادامه deploy باشد.
- restart policy نداشته باشد.

### `medusa-server`

- `MEDUSA_WORKER_MODE=server`.
- `DISABLE_MEDUSA_ADMIN` طبق تصمیم مالک پروژه.
- فقط `127.0.0.1:9000:9000` در صورت اجرای Nginx روی host.
- وابسته به موفقیت migration و healthy بودن PostgreSQL/Redis.
- healthcheck روی `/health/ready`؛ `/health` فقط liveness است.
- restart policy برابر `unless-stopped`.

### `medusa-worker`

- همان image Backend.
- `MEDUSA_WORKER_MODE=worker`.
- `DISABLE_MEDUSA_ADMIN=true`.
- بدون port منتشرشده.
- همان environmentهای Backend.
- وابسته به migration موفق و healthy بودن PostgreSQL/Redis.

### `storefront`

- image مستقل با standalone output فعلی Next.js.
- `HOSTNAME=0.0.0.0` و `PORT=8000` داخل container.
- فقط `127.0.0.1:8000:8000` روی host.
- `MEDUSA_BACKEND_INTERNAL_URL=http://medusa-server:9000` در runtime.
- public API URL برابر دامنه HTTPS API و در زمان build تنظیم شود.
- healthcheck روی یک صفحه واقعی مانند `/<default-region>`، نه فقط بازبودن TCP.

## 7. متغیرهای محیطی

### Backend

فایل واقعی پیشنهادی: `/opt/3dmorty/shared/backend.env` با permission برابر `600`.

```dotenv
NODE_ENV=production
PORT=9000
MEDUSA_WORKER_MODE=server
DISABLE_MEDUSA_ADMIN=false

DATABASE_URL=postgres://USER:STRONG_PASSWORD@postgres:5432/DB_NAME
REDIS_URL=redis://:STRONG_PASSWORD@redis:6379

STORE_CORS=https://STORE_DOMAIN
ADMIN_CORS=https://API_DOMAIN,https://STORE_DOMAIN
AUTH_CORS=https://API_DOMAIN,https://STORE_DOMAIN
BACKEND_URL=https://API_DOMAIN

JWT_SECRET=GENERATE_AT_LEAST_32_RANDOM_CHARACTERS
COOKIE_SECRET=GENERATE_A_DIFFERENT_RANDOM_SECRET

PAYMENT_PROVIDER_ID=REAL_REGISTERED_PROVIDER_ID

AFFILIATE_API_URL=https://AFFILIATE_API_HOST/api/v1
INTEGRATION_SECRET=GENERATE_AT_LEAST_32_RANDOM_CHARACTERS

S3_FILE_URL=https://MEDIA_DOMAIN
S3_REGION=REGION
S3_BUCKET=BUCKET
S3_AUTHENTICATION_METHOD=access-key
S3_ACCESS_KEY_ID=SECRET_VALUE
S3_SECRET_ACCESS_KEY=SECRET_VALUE
S3_ENDPOINT=INTERNAL_OR_PROVIDER_ENDPOINT
S3_PREFIX=uploads
```

نکات الزامی:

- `JWT_SECRET`، `COOKIE_SECRET` و `INTEGRATION_SECRET` مستقل باشند.
- secret با `openssl rand -hex 32` یا روش معادل امن ساخته شود.
- CORS فقط origin دقیق HTTPS باشد؛ wildcard ممنوع است.
- URL داخلی container با URL عمومی مرورگر یکسان فرض نشود.
- env واقعی هرگز در Git، image layer، log یا خروجی نهایی Codex نمایش داده نشود.

### Storefront

متغیرهای public باید هنگام build و موارد server-only هنگام runtime تنظیم شوند:

```dotenv
NODE_ENV=production
PORT=8000
HOSTNAME=0.0.0.0

NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://API_DOMAIN
MEDUSA_BACKEND_INTERNAL_URL=http://medusa-server:9000
NEXT_PUBLIC_DEFAULT_REGION=CONFIRMED_COUNTRY_CODE
NEXT_PUBLIC_BASE_URL=https://STORE_DOMAIN

NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_TELEGRAM_URL=
NEXT_PUBLIC_YOUTUBE_URL=
NEXT_PUBLIC_PINTEREST_URL=

MEDUSA_CLOUD_S3_HOSTNAME=
MEDUSA_CLOUD_S3_PATHNAME=
```

اگر provider پرداخت Stripe نیست، `NEXT_PUBLIC_STRIPE_KEY` خالی می‌ماند و UI پرداخت باید با provider واقعی سازگار و تست شود.

## 8. ترتیب اولین استقرار

ترتیب زیر باید idempotent باشد و پس از قطع شدن قابل ادامه باشد:

1. دریافت ورودی‌های بخش 3 و ثبت تصمیم‌ها بدون secret در runbook.
2. بررسی DNS دامنه‌ها و تطبیق A/AAAA record با VPS.
3. hardening پایه SSH و ساخت کاربر deploy با دسترسی محدود.
4. نصب Docker Engine و Compose Plugin از repository رسمی Docker.
5. ایجاد `/opt/3dmorty/releases` و `/opt/3dmorty/shared` با owner/permission مناسب.
6. clone کردن repository و checkout دقیق branch/commit تأییدشده.
7. اجرای تست‌ها و gateهای repository پیش از build.
8. اصلاح blockerها و ساخت imageهای pin‌شده با Git SHA.
9. ایجاد envهای واقعی روی سرور با permission `600`.
10. بالا آوردن PostgreSQL، Redis و object storage و انتظار برای healthy شدن.
11. اجرای migration به‌صورت one-shot و توقف فوری deploy در صورت خطا.
12. بالا آوردن `medusa-server` و `medusa-worker`.
13. ساخت Admin اولیه فقط در صورت نبود کاربر Admin.
14. ساخت یا بازیابی Publishable API Key و اتصال آن به Sales Channel.
15. قرار دادن key در build secret/arg فرانت‌اند و build کردن Storefront.
16. اجرای seed کاتالوگ فقط روی دیتابیس تازه یا پس از backup و تأیید صریح.
17. بالا آوردن Storefront.
18. نصب و validate کردن Nginx؛ سپس صدور TLS و تست renew.
19. اجرای smoke testهای بخش 13.
20. فعال‌سازی backup زمان‌بندی‌شده، log rotation، monitoring و alert.
21. اجرای `pnpm production:check` فقط با evidence واقعی.

## 9. Nginx و TLS

Nginx باید حداقل دو virtual host داشته باشد:

### Storefront domain

- proxy به `http://127.0.0.1:8000`.
- انتقال `Host`، `X-Real-IP`، `X-Forwarded-For` و `X-Forwarded-Proto`.
- پشتیبانی از WebSocket/upgrade در صورت نیاز.
- buffering برای streaming پاسخ‌های Next.js غیرفعال یا سازگار تنظیم شود.
- timeoutها برای SSR و image optimization منطقی باشند.

### API domain

- proxy به `http://127.0.0.1:9000`.
- محدودیت upload متناسب با حداکثر فایل مجاز.
- rate limit محافظه‌کارانه برای auth و endpointهای حساس، بدون شکستن checkout/webhook.
- webhookهای پرداخت بدون cache و با body/header دست‌نخورده عبور کنند.

الزامات TLS:

- redirect کامل HTTP به HTTPS.
- certificate معتبر برای تمام domainهای عمومی.
- auto-renew فعال و با dry-run تست‌شده.
- HSTS فقط بعد از اطمینان از صحت HTTPS همه subdomainهای مشمول فعال شود.
- `nginx -t` قبل از reload اجباری است.

## 10. Firewall و دسترسی

- ورودی عمومی فقط برای SSH، HTTP و HTTPS باز باشد.
- SSH ترجیحاً فقط با key، بدون password و بدون root login مستقیم.
- قبل از تغییر SSH، session دوم باز نگه داشته شود تا lockout رخ ندهد.
- PostgreSQL، Redis، MinIO console و portهای برنامه عمومی نشوند.
- چون port publishing در Docker می‌تواند قواعد UFW را دور بزند، bindها باید صریحاً loopback باشند و در صورت نیاز chain `DOCKER-USER` نیز بررسی شود.
- Docker socket نباید داخل containerهای برنامه mount شود.

## 11. Migration، bootstrap و داده اولیه

فرمان مرجع migration:

```bash
docker compose -f compose.production.yml run --rm migrate
```

Admin اولیه با فرمان Medusa و بدون ثبت password در shell history ساخته شود. اگر CLI فقط password argument می‌پذیرد، credential موقت بلافاصله rotate شود.

### هشدار seed

مجری باید برای seed یک one-shot service یا build target بسازد که artifact کامپایل‌شده‌ی
`seed-3dmorty` و Medusa CLI را در اختیار داشته باشد. Dockerfile فعلی فقط خروجی build و
production dependencyها را به runtime می‌برد؛ بنابراین پیش از ثبت فرمان نهایی باید اجرای
واقعی seed داخل image نهایی validate شود.

فرمان نهایی، پس از پیاده‌سازی service با نام `seed-catalog`، باید شکلی مشابه زیر داشته باشد:

```bash
docker compose -f compose.production.yml run --rm seed-catalog
```

شرایط اجرا:

- دیتابیس تازه و بدون catalog ارزشمند باشد؛ یا
- backup قابل بازیابی گرفته شده باشد؛ و
- مالک پروژه حذف و بازسازی محصولات را صریحاً تأیید کرده باشد.

پس از seed باید region، sales channel، currency، shipping option، inventory behavior، تصاویر و Publishable Key تست شوند.

## 12. Backup و بازیابی

حداقل سیاست:

- `pg_dump` روزانه با فرمت custom و checksum/اعتبارسنجی فایل.
- رمزنگاری backup پیش از ارسال به مقصد خارج از VPS.
- نگهداری پیشنهادی: 7 نسخه روزانه، 4 نسخه هفتگی و 3 نسخه ماهانه؛ مقدار نهایی با مالک پروژه تأیید شود.
- backup جداگانه object storage یا فعال‌سازی versioning/replication در provider.
- نگهداری فایل env و تنظیمات Nginx به‌صورت رمزنگاری‌شده و خارج از Git عمومی.
- restore drill روی محیط isolated حداقل فصلی و ثبت زمان/نتیجه.
- backup بدون restore test موفق، backup تأییدشده محسوب نمی‌شود.

اسکریپت `restore-drill.sh` نباید هرگز دیتابیس Production را target کند. مقصد restore باید نام و host مستقل و guard صریح داشته باشد.

## 13. تست پذیرش و تحویل

Codex تا موفقیت تمام موارد مرتبط نباید عبارت «استقرار کامل شد» را گزارش کند.

### تست زیرساخت

```bash
docker compose -f compose.production.yml config
docker compose -f compose.production.yml ps
docker compose -f compose.production.yml logs --tail=200
```

- همه containerهای دائمی healthy/running باشند.
- migration با exit code صفر تمام شده باشد.
- پس از reboot VPS سرویس‌ها خودکار برگردند.
- DB و Redis از اینترنت قابل اتصال نباشند.

### تست Backend

```bash
curl --fail --silent --show-error https://API_DOMAIN/health
curl --fail --silent --show-error https://API_DOMAIN/health/ready
```

خروجی مورد انتظار readiness:

```json
{ "status": "ready" }
```

Readiness فعلی اتصال PostgreSQL، پاسخ Redis و وجود `PAYMENT_PROVIDER_ID` را بررسی می‌کند.

### تست Storefront

- `https://STORE_DOMAIN` به country route معتبر هدایت شود.
- صفحه اصلی، جست‌وجو، collection و product detail با HTTP 200 باز شوند.
- تصاویر از دامنه media بدون mixed content نمایش داده شوند.
- cart، ثبت‌نام، login، address، checkout و order ownership تست شوند.
- یک پرداخت sandbox کامل و یک webhook امضاشده تست شود.
- صفحه‌های private دارای cache عمومی نباشند.

### تست امنیت و کیفیت repository

```bash
pnpm install --frozen-lockfile
pnpm security:check
pnpm --filter @dtc/backend test:unit
pnpm --filter @dtc/backend build
pnpm --filter @dtc/storefront test
pnpm --filter @dtc/storefront build
```

سپس gate عملیاتی طبق `docs/production-readiness.md` با evidence واقعی اجرا شود. مقدارهای attestation نباید صرفاً برای سبزشدن command جعل شوند.

## 14. Deploy نسخه‌های بعدی

الگوی امن deploy:

1. ثبت SHA نسخه فعلی و گرفتن backup دیتابیس.
2. fetch و checkout نسخه تأییدشده، نه اجرای blind pull روی working tree کثیف.
3. اجرای CI محلی/remote و build imageهای جدید با SHA.
4. اجرای migration one-shot.
5. جایگزینی worker و Backend و انتظار برای readiness.
6. جایگزینی Storefront و اجرای smoke test.
7. نگهداری image نسخه قبلی برای rollback سریع application.

هیچ deploy script نباید `docker compose down -v`، حذف volume، پاک‌کردن backup یا reset مخرب Git اجرا کند.

Rollback کد با rollback دیتابیس یکسان نیست. اگر migration backward-compatible نیست، قبل از deploy باید برنامه rollback داده یا forward-fix مستند شود.

## 15. Monitoring و عملیات

حداقل monitoring:

- uptime check برای Storefront، `/health` و `/health/ready`.
- alert برای restart loop، مصرف CPU/RAM/disk، پرشدن volume و certificate expiry.
- alert برای شکست backup و restore drill منقضی‌شده.
- log rotation برای Docker و Nginx.
- عدم ثبت token، cookie، authorization header، password، webhook secret و PII.
- correlation با `x-request-id` که در Storefront فعلی تولید می‌شود.
- همگام‌سازی ساعت سرور با NTP برای webhook signature و log correlation.

## 16. قواعد اجرایی Codex

Codex هنگام اجرای این سند باید:

1. ابتدا repository، branch، diff و فایل‌های environment template را بخواند.
2. تغییرهای موجود کاربر را حفظ کند و فایل نامرتبط را بازنویسی نکند.
3. secret واقعی را در chat، Git diff، command output یا log چاپ نکند.
4. هر action مخرب یا seed روی داده موجود را قبل از اجرا متوقف و تأیید صریح بگیرد.
5. برای هر تغییر، تست متناسب اجرا و نتیجه واقعی را گزارش کند.
6. اگر سرویس خارجی، DNS یا credential آماده نیست، بخش‌های مستقل را تکمیل و blocker دقیق را اعلام کند.
7. نسخه image، commit، زمان deploy، migration result و health result را در گزارش نهایی ثبت کند.
8. فقط پس از اجرای تست پذیرش، لینک‌های نهایی Storefront/API/Admin را تحویل دهد.
9. فایل‌های تولیدی را به‌صورت idempotent بنویسد تا اجرای دوباره deploy باعث تخریب داده نشود.
10. از اجرای dev server مانند `pnpm dev` در Production خودداری کند.

## 17. Definition of Done

استقرار زمانی کامل است که:

- DNS و TLS معتبر باشند و renew آزمایش شده باشد.
- Storefront و Backend فقط از مسیر reverse proxy عمومی باشند.
- `/health/ready` پاسخ 200 بدهد.
- worker مستقل و Redis-based moduleها متصل باشند.
- migrationها ثبت و بدون race اجرا شده باشند.
- provider پرداخت واقعی و webhook آن end-to-end تست شده باشد.
- upload و نمایش فایل روی S3-compatible storage کار کند.
- Affiliate integration با signature معتبر تست شده باشد.
- country/region/currency/shipping/tax با تصمیم کسب‌وکار منطبق باشد.
- backup خارج از VPS و restore drill موفق وجود داشته باشد.
- reboot و rollback آزمایش شده باشند.
- هیچ secret یا دیتابیس/Redis عمومی نشده باشد.
- گزارش تحویل شامل commit SHA، image tagها، نتیجه تست‌ها و blocker باقی‌مانده باشد.

## 18. منابع رسمی

- [راهنمای عمومی استقرار Medusa](https://docs.medusajs.com/learn/deployment/general)
- [دستور `db:migrate` در Medusa CLI](https://docs.medusajs.com/resources/medusa-cli/commands/db)
- [راهنمای Self-hosting در Next.js](https://nextjs.org/docs/app/guides/self-hosting)
- [Standalone output در Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [نصب Docker Engine روی Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [استفاده از Docker Compose در Production](https://docs.docker.com/compose/how-tos/production/)
- [ترتیب startup و health dependency در Compose](https://docs.docker.com/compose/how-tos/startup-order/)
- [مستندات Certbot](https://eff-certbot.readthedocs.io/en/stable/)

## 19. Prompt پیشنهادی برای شروع اجرای Codex

متن زیر را همراه این repository به Codex بدهید:

```text
فایل VPS_DEPLOYMENT_FA.md را کامل بخوان و آن را قرارداد اجرای استقرار بدان.
ابتدا repository و blockerهای ثبت‌شده را راستی‌آزمایی کن. سپس فقط ورودی‌های اجباری
نامشخص را از من بپرس. فایل‌های Docker/Compose/Nginx/deploy/backup را پیاده‌سازی کن،
تست‌های repository و container build را اجرا کن و تا موفقیت health check و تست پذیرش
ادامه بده. secret نساز یا چاپ نکن، تغییرهای موجود من را حفظ کن و هیچ seed یا عملیات
مخرب را بدون تأیید صریح اجرا نکن. در پایان commit SHA، سرویس‌ها، URLها، نتیجه تست‌ها،
روش rollback و هر blocker باقی‌مانده را گزارش کن.
```

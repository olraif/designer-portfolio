# Публикация сайта

Это статический сайт. Его можно открыть локально через `index.html`, залить на GitHub Pages или загрузить на Timeweb как обычные файлы хостинга.

## Файлы сайта

- `index.html`
- `styles.css`
- `app.js`
- `portfolio-data.js`
- `assets/series/`
- `assets/profile/`
- `assets/presentations/`
- `.nojekyll`

В папке `assets/presentations/` лежат 11 PDF-презентаций курса Python Quest. Они весят около 239 MB суммарно; если нужен легкий лендинг для быстрой загрузки, PDF можно вынести отдельной ссылкой или загрузить позже.

## GitHub Pages

1. Создать новый репозиторий, например `olesya-design-portfolio`.
2. Загрузить содержимое папки `designer-portfolio` в корень репозитория.
3. В GitHub открыть `Settings -> Pages`.
4. Выбрать публикацию из ветки `main`, папка `/root`.
5. После публикации сайт будет доступен по адресу вида `https://username.github.io/olesya-design-portfolio/`.

## Домен через Timeweb

Когда домен будет куплен, можно подключить его к GitHub Pages через DNS в Timeweb. Перед настройкой лучше открыть актуальную справку GitHub Pages и взять оттуда текущие DNS-записи.

Обычно схема такая:

- в GitHub Pages указать custom domain;
- для `www` добавить CNAME на GitHub Pages;
- для основного домена добавить A-записи GitHub Pages;
- дождаться проверки DNS и включить HTTPS.

Если решим размещать сайт прямо на Timeweb, GitHub можно оставить как хранилище кода, а на хостинг загрузить эти же статические файлы.

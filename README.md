# pwa-demo

교실 수업에서 바로 사용할 수 있는 Progressive Web App 실습 프로젝트입니다.

학생들은 이 저장소를 클론한 뒤 Netlify 또는 Vercel에 배포하고, 모바일에서 HTTPS URL을 열어 앱을 설치한 다음 카메라, 갤러리, 위치, 알림, 공유, 클립보드, 저장소, 오프라인 동작을 직접 테스트할 수 있습니다.

## PWA란?

Progressive Web App은 일반 웹 앱에 앱다운 기능을 점진적으로 더하는 방식입니다. 대표적으로 홈 화면 설치, 오프라인 동작, 앱 아이콘, service worker, 브라우저가 제공하는 네이티브 비슷한 Web API 연동이 있습니다.

이 프로젝트는 수업 자료로 쓰기 쉽도록 화면 문구와 안내는 한국어로 작성했고, 코드에서 그대로 검색하거나 복사해야 하는 API 이름은 영어 원문을 유지했습니다.

## 기술 스택

- Vite
- React
- TypeScript
- Plain CSS
- 백엔드 없음
- 최소 의존성

## 로컬 실행

```bash
npm install
npm run dev
```

Vite가 출력하는 로컬 주소를 브라우저에서 엽니다. 대부분의 브라우저는 `localhost`를 안전한 컨텍스트로 취급하기 때문에 카메라, 클립보드처럼 HTTPS가 필요한 API도 로컬에서 실습할 수 있습니다.

## 빌드

```bash
npm run build
```

프로덕션 빌드를 미리 확인하려면:

```bash
npm run preview
```

service worker는 기본적으로 프로덕션 빌드에서 등록됩니다. 개발 서버에서 service worker를 테스트하고 싶다면 URL에 `?sw=1`을 붙여서 엽니다.

## Netlify 배포

1. 프로젝트를 GitHub에 push합니다.
2. Netlify에서 새 사이트를 만들고 이 저장소를 연결합니다.
3. Build command는 `npm run build`를 사용합니다.
4. Publish directory는 `dist`를 사용합니다.

Netlify는 배포된 사이트에 HTTPS를 기본으로 제공합니다.

## Vercel 배포

1. 프로젝트를 GitHub에 push합니다.
2. Vercel에서 이 저장소를 import합니다.
3. Vite 기본값을 유지합니다: build command는 `npm run build`, output directory는 `dist`.

Vercel도 배포된 사이트에 HTTPS를 기본으로 제공합니다.

## 아이콘 교체

placeholder 아이콘은 `public/icons`에 있습니다.

- `logo.svg`
- `icon-192.png`
- `icon-512.png`
- `maskable-icon-512.png`

`logo.svg`는 앱 헤더와 favicon에 쓰이고, `public/manifest.webmanifest`가 설치 아이콘용 PNG 파일들을 참조합니다. 같은 파일명으로 이미지를 교체하거나, manifest의 `icons` 경로를 수정하면 됩니다.

SVG만 바꾸면 설치 아이콘용 PNG는 그대로 남습니다. 학생들이 자기 로고로 바꿀 때는 `logo.svg`, `icon-192.png`, `icon-512.png`, `maskable-icon-512.png`를 같은 이름으로 함께 교체하는 흐름이 가장 단순합니다.

## 앱 이름 바꾸기

학생 프로젝트 이름으로 바꾸려면 다음 파일을 같이 확인합니다.

- `public/manifest.webmanifest`: `name`, `short_name`, `description`
- `index.html`: `<title>`과 `description` meta 태그
- `src/app/App.tsx`: 헤더의 `<h1>`과 보조 문구

## manifest 수정

`public/manifest.webmanifest`에서 다음 값을 바꿔 볼 수 있습니다.

- `name`
- `short_name`
- `description`
- `theme_color`
- `background_color`
- `icons`
- `shortcuts`

manifest를 바꾼 뒤에는 다시 빌드하고 배포합니다. 이미 설치한 앱에서는 이름이나 아이콘 변경이 바로 보이지 않을 수 있으니 필요하면 앱을 삭제 후 다시 설치합니다.

## HTTPS가 중요한 이유

브라우저의 네이티브 비슷한 API 대부분은 안전한 컨텍스트가 필요합니다.

- Camera
- Location
- Clipboard
- Notifications
- Service workers
- Wake Lock

로컬 개발에서는 `localhost`가 보통 안전한 컨텍스트로 인정됩니다. 실제 모바일 테스트는 Netlify나 Vercel처럼 HTTPS가 제공되는 배포 URL에서 하는 것이 가장 좋습니다.

## API 지원 참고

모바일에서 특히 실습하기 좋은 기능:

- 설치 프롬프트와 standalone 실행
- 카메라
- 갤러리 / 파일 선택
- 위치
- Web Share
- 진동

브라우저별 차이가 큰 기능:

- Push API
- iOS 알림
- File System Access API
- Device Orientation 권한 흐름
- Wake Lock
- App Badging

실제 원격 push 알림은 백엔드 엔드포인트, push subscription 저장소, VAPID 키가 필요합니다. 이 프로젝트는 push 지원 여부를 보여 주지만, 백엔드 없이 원격 push를 가짜로 흉내 내지는 않습니다.

## 추천 수업 흐름

1. 저장소를 클론합니다.
2. 로컬에서 앱을 실행합니다.
3. Netlify 또는 Vercel에 배포합니다.
4. 배포된 HTTPS URL을 모바일에서 엽니다.
5. 앱을 홈 화면에 설치합니다.
6. 카메라, 갤러리, 위치, 알림, 공유, 클립보드, 오프라인 데모를 실습합니다.
7. 앱 아이콘을 교체합니다.
8. manifest에서 앱 이름, 테마 색상, shortcuts를 수정합니다.
9. 다시 빌드하고 재배포한 뒤 변화를 확인합니다.

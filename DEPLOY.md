# CLOG 웹 — S3 정적 배포 (Vite + React SPA)

## 빌드

```bash
pnpm install
pnpm build
```

산출물: `dist/` (index.html + assets)

## 환경 변수 (`.env.local` — **빌드 시** 번들에 포함)

```env
VITE_API_BASE_URL=https://clog.r-e.kr
VITE_GITHUB_CLIENT_ID=          # GitHub OAuth App Client ID (필수)
# GitHub App Authorization callback URL과 동일, 끝 / 없음
VITE_OAUTH_REDIRECT_URI=http://clog-frontend-project.s3-website.ap-northeast-2.amazonaws.com
```

> **주의:** `VITE_DEV_CLOG_TOKEN`은 `pnpm dev` 로컬 전용입니다.  
> 프로덕션 빌드(`.env`에 넣고 `pnpm build`)에 넣으면 **모든 방문자가 같은 계정**으로 로그인됩니다.

> `pnpm build` 전에 `VITE_GITHUB_CLIENT_ID`·`VITE_OAUTH_REDIRECT_URI`를 넣어야 S3에서 GitHub 로그인이 동작합니다.  
> 백엔드도 **동일한 redirect_uri**로 code를 교환해야 합니다 (백엔드 팀 `APP_*` / OAuth 설정).

## S3 업로드

```bash
./scripts/deploy-s3.sh YOUR_BUCKET_NAME [CLOUDFRONT_DISTRIBUTION_ID]
```

## 403 Forbidden 나올 때 (필수 설정)

파일만 올리면 **객체 URL**로는 403이 납니다. 아래 4가지를 순서대로 하세요.

### 1) 정적 웹사이트 호스팅 켜기

S3 버킷 → **속성(Properties)** → **정적 웹 사이트 호스팅** → **활성화** → **편집**

| 항목 | 값 |
|------|-----|
| 호스팅 유형 | 정적 웹 사이트 호스팅 |
| 인덱스 문서 | `index.html` |
| **오류 문서 (SPA)** | **`index.html`** ← `/auth/login` 404 방지, **필수** |

> 오류 문서를 비우면 `/blog/1`, `/auth/login` 접속 시 XML `NoSuchKey` 404가 납니다.

저장 후 나오는 **버킷 웹 사이트 엔드포인트**로 접속하세요.

- ✅ `http://버킷이름.s3-website.ap-northeast-2.amazonaws.com`
- ❌ `https://버킷이름.s3.ap-northeast-2.amazonaws.com` (REST 엔드포인트 → 403 흔함)

### 2) 퍼블릭 액세스 (간단 공개 사이트)

**권한(Permissions)** → **모든 퍼블릭 액세스 차단** → 이 버킷만 공개할 거면  
「새 퍼블릭 버킷 정책…」 등 **차단 해제** (4개 체크 해제 후 저장).

### 3) 버킷 정책

**권한** → **버킷 정책** → 편집 (`BUCKET_NAME`만 본인 버킷명으로 변경):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```

### 4) CORS (API 호출 실패 시)

브라우저 origin이 백엔드 허용 목록에 없으면 콘솔에  
`blocked by CORS policy` / `No 'Access-Control-Allow-Origin'` 이 뜹니다.

**백엔드** (`clog.r-e.kr` 서버) 환경 변수 `APP_CORS_ALLOWED_ORIGINS`에 **쉼표로** 추가 후 재배포:

```text
http://clog-frontend-project.s3-website.ap-northeast-2.amazonaws.com
```

CloudFront·커스텀 도메인을 쓰면 그 URL도 추가 (예: `https://blog.example.com`).

로컬은 기본값에 `http://localhost:3000` 포함.

CORS 넣었는데도 막히면:

- origin **끝에 `/` 없이**, 프로토콜·호스트 **완전 일치** (`http` vs `https`)
- 백엔드 **재시작** 했는지
- 브라우저 주소栏이 `http://clog-frontend-project.s3-website.ap-northeast-2.amazonaws.com` 인지 (다른 URL이면 그 origin도 추가)

### 5) CloudFront를 쓰는 경우

오리진은 **S3 웹사이트 엔드포인트**(REST가 아님)를 쓰고, 403/404 커스텀 오류를 `/index.html` → 200으로 설정.

---

`.env`는 S3에 **올리지 않습니다**. `pnpm build` 시점에만 사용됩니다.

## SPA 라우팅

이 프로젝트는 **HashRouter** (`/#/blog`, `/#/auth/login`)를 씁니다.  
S3에 **오류 문서를 안 넣어도** `/auth/login` 404가 나지 않습니다.

접속 예: `http://버킷.s3-website.../` → 메뉴 이동 시 `.../#/blog`

**오류 문서 `index.html`** 을 넣으면 BrowserRouter 방식도 가능하지만, 현재 빌드는 Hash 기준입니다.

**CloudFront**

- Custom error: 403, 404 → `/index.html` (200)

`dist/`에는 S3 업로드용 파일만 포함됩니다 (`index.html`, `assets/*`, `favicon.ico`).

## 로컬 미리보기

```bash
pnpm preview
```

## Next.js (레거시)

```bash
pnpm dev:next
pnpm build:next
```

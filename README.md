# Hair Product Review Form

고객이 헤어 제품 리뷰를 제출하고, 관리자가 제출 결과를 확인하는 두 페이지짜리 웹 폼입니다.

## 페이지

- 고객용 폼: `hair_review_form_customer.html`
- 관리자 대시보드: `hair_review_admin.html`
- 통합 데모 페이지: `hair_review_unified.html`
- 공유 백엔드: `apps_script_backend.gs`

## 공개 링크

- 고객용 폼: https://mjkwon-cloud.github.io/hairform/hair_review_form_customer.html
- 관리자 대시보드: https://mjkwon-cloud.github.io/hairform/hair_review_admin.html
- GitHub 저장소: https://github.com/mjkwon-cloud/hairform

## 빠른 확인

HTML 파일을 브라우저에서 열면 로컬 데모 모드로 동작합니다. 이 모드의 데이터는 같은 브라우저 프로필의 `localStorage`에만 저장됩니다.

고객과 관리자가 서로 다른 기기에서 사용하려면 Google Apps Script 백엔드를 연결해야 합니다.

## 공유 데이터 연결

1. Google Drive에서 새 Google Apps Script 프로젝트를 만듭니다.
2. `apps_script_backend.gs` 내용을 붙여넣습니다.
3. `setup` 함수를 한 번 실행합니다.
   - Google Sheets 데이터 저장소 생성
   - `Hair Review Photos` Google Drive 폴더 생성
   - 관리자 토큰 생성
4. **배포 > 새 배포 > 웹 앱**을 선택합니다.
5. 실행 주체는 본인, 접근 권한은 `Anyone`으로 설정합니다.
6. 배포 URL을 복사합니다.
7. `hair_review_form_customer.html`의 `SUBMISSION_ENDPOINT`에 URL을 입력합니다.
8. `hair_review_admin.html`의 `DATA_ENDPOINT`에 같은 URL을 입력합니다.
9. Apps Script 실행 로그의 `ADMIN_TOKEN`을 관리자 페이지를 처음 열 때 입력합니다.

관리자 화면은 30초마다 새 제출 자료를 조회합니다. 삭제와 전체 삭제는 관리자 토큰이 일치할 때만 실행됩니다.

### 현재 파일에 연결하기

`hair_review_form_customer.html`의 `SUBMISSION_ENDPOINT`와 `hair_review_admin.html`의 `DATA_ENDPOINT`에 Apps Script 웹 앱 URL을 동일하게 입력합니다. 관리자 토큰은 HTML에 저장하지 않고 관리자 페이지를 처음 열 때 입력하며, 현재 브라우저 세션에만 보관합니다.

현재 연결된 Apps Script 웹 앱 URL:

`https://script.google.com/macros/s/AKfycbzVlwiGAjj9ioAXDE_hb5WmVMjVO4uFN1J2_cdAto_2zBrXSmrHNs2PUQHM-h6XbBMc/exec`

생성된 Google Sheets 저장소: `https://docs.google.com/spreadsheets/d/1K3STAYP0PZqU9_VIDuCa0vsFQ-IB9NfQ89sdfkOXKkw/edit`

Apps Script 웹 앱 URL이 없다면 이 저장소만으로는 서로 다른 기기 간 저장소를 만들 수 없습니다. Google 계정으로 Apps Script 배포를 완료한 뒤 URL을 입력하고 다시 GitHub Pages에 푸시해야 합니다.

## GitHub

저장소: https://github.com/mjkwon-cloud/hairform

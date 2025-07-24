# 우리 FIS 아카데미 5기 nextjs를 활용한 미니 프로젝트 - 우리 게임(WOORI GAME)

# 🎮 우리 게임 (WOORI GAME)
> **우리 FIS 아카데미 5기** Next.js 미니 프로젝트

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**🏆 IP 기반 자동 로그인으로 간편하게, 간단한 게임으로 재미있게!**

[🎯 게임 시작하기](#-시작하기) • [📖 기능 소개](#-주요-기능) • [🛠️ 기술 스택](#️-기술-스택) • [🏁 설치 방법](#-설치-방법)

</div>

---

## 🌟 프로젝트 소개

**우리 게임**은 우리 FIS 아카데미 수강생들을 위한 특별한 게임 플랫폼입니다. 
강의장 내 IP 주소를 활용한 독창적인 로그인 시스템으로 보안성을 높이고, 
간단한 게임을 통해 수강생들 간의 건전한 경쟁을 유도합니다.

## 🎯 주요 기능

### 🔐 **IP 기반 자동 로그인**
- **보안성**: 강의장 랜선만으로 접속 가능하여 외부 침입 차단
- **편의성**: 별도의 회원가입이나 로그인 과정 불필요
- **자동 인식**: 재접속시 이전 게임 기록 자동 복원

### 🎮 ** 게임 시스템**
- 예정

### 💾 **실시간 데이터 저장**
- **즉시 저장**: 클릭할 때마다 점수가 실시간으로 저장
- **영구 보관**: AWS PostgreSQL을 통한 안전한 데이터 보관
- **기록 유지**: 서버 재시작과 관계없이 데이터 영구 보존

### 🏆 **랭킹 시스템**
- **실시간 순위**: 전체 수강생 대상 실시간 랭킹 제공
- **경쟁 요소**: 순위표를 통한 건전한 경쟁 문화 조성
- **성취감**: 개인 최고 기록 및 레벨 달성 현황 표시

## 🛠️ 기술 스택

### **Frontend**
- **Next.js**: 최신 React 프레임워크로 빠른 개발 및 최적화
- **Tailwind CSS**: 모던하고 반응형 UI 디자인

### **Backend**
- **Next.js API Routes**: 서버리스 API 구축
- **PostgreSQL**: 관계형 데이터베이스로 안정적인 데이터 관리
- **AWS RDS**: 클라우드 데이터베이스 서비스

## 🏁 설치 방법

### **1. 저장소 클론**
```bash
git clone https://github.com/ehgkals/Woori-game.git
cd Woori-game
```

### **2. 의존성 설치**
```bash
npm install
```

### **3. 환경 변수 설정**
`.env.local` 파일을 생성하고 PostgreSQL 연결 정보를 추가하세요:
```env
DATABASE_URL=postgresql://username:password@your-aws-rds-endpoint.region.rds.amazonaws.com:5432/database_name
```

### **4. 개발 서버 시작**
```bash
npm run dev
```

### **5. 브라우저에서 확인**
[http://localhost:3000](http://localhost:3000)에서 게임을 즐기세요!

## 🎯 게임 플레이 가이드

### **🔰 시작하기**
1. **자동 로그인**: 강의장에서 브라우저로 접속하면 자동으로 로그인됩니다
2. **닉네임 설정**: 원하는 닉네임으로 변경 가능합니다
3. **게임 시작**: "게임 시작" 버튼을 클릭하여 게임을 시작하세요

### **🎮 게임 방법**
- 추가 예정

### **📈 레벨 시스템**
- 100점마다 자동으로 레벨이 상승합니다
- 높은 레벨일수록 랭킹에서 우위를 점할 수 있습니다

## 📊 주요 화면

### **🏠 메인 페이지**
- 자동 로그인 및 사용자 정보 표시
- 닉네임 편집 기능
- 게임 통계 현황

### **🎮 게임 페이지**
- 직관적인 클릭 버튼 인터페이스
- 실시간 점수 및 레벨 표시
- 게임 진행 상황 모니터링

### **🏆 랭킹 페이지**
- 전체 수강생 순위표
- 개인 기록 및 순위 확인
- 실시간 업데이트되는 순위 정보

## 👥 팀 정보

**우리 FIS 아카데미 5기** 개발팀
- 프로젝트 기간: 2025-07-24
- 사용 기술: Next.js, PostgreSQL
- 개발 목적: 수강생 간 게임을 통해 재미를 유도하거나 이벤트를 위해

- 박준상
- 신경남
- 박민서
- 김현진

## 📞 문의사항

프로젝트에 대한 문의나 개선 사항이 있으시면 언제든 연락주세요!

- **GitHub**: [ehgkals/Woori-game](https://github.com/ehgkals/Woori-game)
- **Issues**: [GitHub Issues](https://github.com/ehgkals/Woori-game/issues)

---

<div align="center">

**🎮 즐거운 게임 되세요! 🎮**

Made with ❤️ by **우리 FIS 아카데미 5기**

</div>

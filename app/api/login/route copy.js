import { NextResponse } from 'next/server';

// 메모리에 사용자 저장 (테스트용)
let users = [];
export { users };

function getIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  let ip = null;
  
  if (cfIP) ip = cfIP;
  else if (forwarded) ip = forwarded.split(',')[0].trim();
  else if (realIP) ip = realIP;
  else ip = request.ip || '127.0.0.1';
  
  // IPv6 정리
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  return ip;
}

export async function GET(request) {
  try {
    const ip = getIP(request);
    console.log('로그인 시도 IP:', ip);
    
    // 기존 사용자 찾기
    let user = users.find(u => u.ip === ip);
    
    if (user) {
      // 기존 사용자 - 로그인 처리
      user.lastLogin = new Date().toISOString();
      user.loginCount = (user.loginCount || 1) + 1;
      
      console.log(`기존 사용자 로그인: ${user.nickname} (${user.loginCount}번째)`);
      
      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: {
          id: user.id,
          ip: user.ip,
          nickname: user.nickname,
          level: user.level,
          score: user.score,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        },
        message: `환영합니다, ${user.nickname}님! (${user.loginCount}번째 방문)`
      });
      
    } else {
      // 새 사용자 - 계정 생성
      const newUser = {
        id: Date.now(),
        ip: ip,
        nickname: `Player_${Math.random().toString(36).substr(2, 6)}`,
        level: 1,
        score: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1
      };
      
      users.push(newUser);
      console.log(`새 사용자 생성: ${newUser.nickname} (총 ${users.length}명)`);
      
      return NextResponse.json({
        success: true,
        isNewUser: true,
        user: newUser,
        message: `${newUser.nickname}님, 첫 방문을 환영합니다!`
      });
    }
    
  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 닉네임 업데이트 API
export async function POST(request) {
  try {
    const { nickname } = await request.json();
    const ip = getIP(request);
    
    const user = users.find(u => u.ip === ip);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    // 닉네임 유효성 검사
    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: '닉네임은 2글자 이상이어야 합니다' },
        { status: 400 }
      );
    }
    
    if (nickname.trim().length > 20) {
      return NextResponse.json(
        { success: false, error: '닉네임은 20글자를 초과할 수 없습니다' },
        { status: 400 }
      );
    }
    
    // 닉네임 중복 검사 (같은 IP는 제외)
    const duplicateUser = users.find(u => u.nickname === nickname.trim() && u.ip !== ip);
    if (duplicateUser) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 닉네임입니다' },
        { status: 400 }
      );
    }
    
    user.nickname = nickname.trim();
    
    return NextResponse.json({
      success: true,
      user: user,
      message: `닉네임이 "${user.nickname}"으로 변경되었습니다`
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '닉네임 변경 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
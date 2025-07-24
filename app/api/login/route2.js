import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';

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
    console.log('🔍 로그인 시도 IP:', ip);
    
    // 데이터베이스에서 기존 사용자 찾기
    let user = await db.getUserByIP(ip);
    
    if (user) {
      // 기존 사용자 - 로그인 처리
      const updatedUser = await db.updateUser(ip, {
        last_login: new Date().toISOString(),
        login_count: (user.login_count || 1) + 1
      });
      
      console.log(`✅ 기존 사용자 로그인: ${updatedUser.nickname} (${updatedUser.login_count}번째)`);
      
      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: {
          id: updatedUser.id,
          ip: updatedUser.ip,
          nickname: updatedUser.nickname,
          level: updatedUser.level,
          score: updatedUser.score,
          createdAt: updatedUser.created_at,
          lastLogin: updatedUser.last_login,
          loginCount: updatedUser.login_count
        },
        message: `환영합니다, ${updatedUser.nickname}님! (${updatedUser.login_count}번째 방문)`
      });
      
    } else {
      // 새 사용자 - 계정 생성
      const newUserData = {
        ip: ip,
        nickname: `Player_${Math.random().toString(36).substr(2, 6)}`,
        level: 1,
        score: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1
      };
      
      const createdUser = await db.createUser(newUserData);
      console.log(`🎉 새 사용자 생성: ${createdUser.nickname}`);
      
      return NextResponse.json({
        success: true,
        isNewUser: true,
        user: {
          id: createdUser.id,
          ip: createdUser.ip,
          nickname: createdUser.nickname,
          level: createdUser.level,
          score: createdUser.score,
          createdAt: createdUser.created_at,
          lastLogin: createdUser.last_login,
          loginCount: createdUser.login_count
        },
        message: `${createdUser.nickname}님, 첫 방문을 환영합니다!`
      });
    }
    
  } catch (error) {
    console.error('🔴 로그인 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 닉네임 업데이트 API (PostgreSQL 버전)
export async function POST(request) {
  try {
    const { nickname } = await request.json();
    const ip = getIP(request);
    
    // 사용자 존재 확인
    const user = await db.getUserByIP(ip);
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
    
    // 닉네임 중복 검사
    const isDuplicate = await db.isNicknameExists(nickname.trim(), ip);
    if (isDuplicate) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 닉네임입니다' },
        { status: 400 }
      );
    }
    
    // 닉네임 업데이트
    const updatedUser = await db.updateUser(ip, {
      nickname: nickname.trim()
    });
    
    console.log(`📝 닉네임 변경: ${user.nickname} → ${updatedUser.nickname}`);
    
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        ip: updatedUser.ip,
        nickname: updatedUser.nickname,
        level: updatedUser.level,
        score: updatedUser.score,
        createdAt: updatedUser.created_at,
        lastLogin: updatedUser.last_login,
        loginCount: updatedUser.login_count
      },
      message: `닉네임이 "${updatedUser.nickname}"으로 변경되었습니다`
    });
    
  } catch (error) {
    console.error('🔴 닉네임 변경 오류:', error);
    return NextResponse.json(
      { success: false, error: '닉네임 변경 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}


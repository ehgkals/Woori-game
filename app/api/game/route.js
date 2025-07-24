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
  
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  return ip;
}

export async function POST(request) {
  try {
    const ip = getIP(request);
    const { action, data } = await request.json();
    
    // 현재 사용자 찾기
    const user = await db.getUserByIP(ip);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }
    
    console.log(`🎮 게임 액션: ${action}, 사용자: ${user.nickname}`);
    
    if (action === 'increase_score') {
      const points = data.points || 1;
      const newScore = user.score + points;
      
      // 자동 레벨업 (100점마다)
      const newLevel = Math.floor(newScore / 100) + 1;
      
      // 데이터베이스 업데이트
      const updatedUser = await db.updateUser(ip, {
        score: newScore,
        level: newLevel
      });
      
      const leveledUp = newLevel > user.level;
      
      console.log(`📈 ${user.nickname} 점수 증가: +${points} (총: ${newScore})`);
      if (leveledUp) {
        console.log(`🆙 ${user.nickname} 레벨업! 레벨 ${newLevel}`);
      }
      
      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: `+${points}점 획득!`,
        levelUp: leveledUp
      });
    }
    
    return NextResponse.json(
      { success: false, error: '잘못된 액션입니다' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('🔴 게임 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '게임 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

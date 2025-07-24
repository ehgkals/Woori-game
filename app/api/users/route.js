import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';

export async function GET() {
  try {
    console.log('🔍 USERS API - DB에서 사용자 목록 조회 시작');
    
    // DB에서 모든 사용자 가져오기
    const users = await db.getAllUsers();
    
    console.log(`✅ USERS API - ${users.length}명의 사용자 조회 완료`);
    console.log('📊 사용자 목록:', users.map(u => `${u.nickname}(${u.ip})`));
    
    return NextResponse.json({
      success: true,
      users: users,
      count: users.length,
      message: `총 ${users.length}명의 사용자가 등록되어 있습니다`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🔴 USERS API 오류:', error);
    
    return NextResponse.json({
      success: false,
      users: [],
      count: 0,
      error: '사용자 목록을 불러오는 중 오류가 발생했습니다',
      details: error.message
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { users } from '../login/route.js';
export async function GET() {
  console.log('USERS API - 현재 users:', users);
  console.log('USERS API - users 메모리 주소:', users);
  
  return NextResponse.json({
    users: users,
    count: users.length,
    message: '사용자 목록',
    problem: '로그인 API의 데이터가 보이지 않음!'
  });
}

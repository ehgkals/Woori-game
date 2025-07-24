import { NextResponse } from 'next/server';

function getIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (cfIP) return cfIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  
  return request.ip || '127.0.0.1';
}

export async function GET(request) {
  const ip = getIP(request);
  
  return NextResponse.json({
    ip: ip,
    timestamp: new Date().toISOString()
  });
}
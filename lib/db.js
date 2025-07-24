// lib/db.js - Supabase 버전
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 데이터베이스 함수들
export const db = {
  // 사용자 조회
  async getUserByIP(ip) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('ip', ip)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('getUserByIP 오류:', error);
      throw error;
    }
  },

  // 사용자 생성
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          ip: userData.ip,
          nickname: userData.nickname,
          level: userData.level,
          score: userData.score,
          created_at: userData.createdAt,
          last_login: userData.lastLogin,
          login_count: userData.loginCount
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('createUser 오류:', error);
      throw error;
    }
  },

  // 사용자 업데이트
  async updateUser(ip, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('ip', ip)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('updateUser 오류:', error);
      throw error;
    }
  },

  // 모든 사용자 조회
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getAllUsers 오류:', error);
      throw error;
    }
  },

  // 닉네임 중복 확인
  async isNicknameExists(nickname, excludeIP = null) {
    try {
      let query = supabase
        .from('users')
        .select('id')
        .eq('nickname', nickname);
      
      if (excludeIP) {
        query = query.neq('ip', excludeIP);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data.length > 0;
    } catch (error) {
      console.error('isNicknameExists 오류:', error);
      throw error;
    }
  }
};
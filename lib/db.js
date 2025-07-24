import pkg from 'pg';
const { Pool } = pkg;

// AWS RDS PostgreSQL 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_URL  // ← AWS 링크만 넣으면 됨!
});

// 테이블 자동 생성
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(45) UNIQUE NOT NULL,
        nickname VARCHAR(100) NOT NULL,
        level INTEGER DEFAULT 1,
        score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        login_count INTEGER DEFAULT 1
      )
    `);
    console.log('✅ 데이터베이스 테이블 확인/생성 완료');
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 오류:', error);
  }
}

// 서버 시작시 테이블 생성
initDatabase();

// 데이터베이스 함수들
export const db = {
  // 사용자 조회
  async getUserByIP(ip) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE ip = $1', [ip]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('getUserByIP 오류:', error);
      throw error;
    }
  },

  // 사용자 생성
  async createUser(userData) {
    try {
      const result = await pool.query(`
        INSERT INTO users (ip, nickname, level, score, created_at, last_login, login_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        userData.ip,
        userData.nickname,
        userData.level,
        userData.score,
        userData.createdAt,
        userData.lastLogin,
        userData.loginCount
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('createUser 오류:', error);
      throw error;
    }
  },

  // 사용자 업데이트
  async updateUser(ip, updates) {
    try {
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [ip, ...Object.values(updates)];
      
      const result = await pool.query(`
        UPDATE users SET ${setClause} WHERE ip = $1 RETURNING *
      `, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('updateUser 오류:', error);
      throw error;
    }
  },

  // 모든 사용자 조회
  async getAllUsers() {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('getAllUsers 오류:', error);
      throw error;
    }
  },

  // 닉네임 중복 확인
  async isNicknameExists(nickname, excludeIP = null) {
    try {
      let query, params;
      if (excludeIP) {
        query = 'SELECT id FROM users WHERE nickname = $1 AND ip != $2';
        params = [nickname, excludeIP];
      } else {
        query = 'SELECT id FROM users WHERE nickname = $1';
        params = [nickname];
      }
      
      const result = await pool.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      console.error('isNicknameExists 오류:', error);
      throw error;
    }
  }
};
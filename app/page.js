'use client';

import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginMessage, setLoginMessage] = useState('');
  
  // 닉네임 변경 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    autoLogin();
  }, []);

  const autoLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/login');
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setLoginMessage(data.message);
        setNewNickname(data.user.nickname);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const updateNickname = async () => {
    if (!newNickname.trim()) return;
    
    setNicknameLoading(true);
    setNicknameError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: newNickname }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setIsEditingNickname(false);
        setLoginMessage(data.message);
      } else {
        setNicknameError(data.error);
      }
    } catch (err) {
      setNicknameError('닉네임 변경 중 오류가 발생했습니다');
    } finally {
      setNicknameLoading(false);
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">로그인 중...</h2>
          <p className="text-gray-600">IP 주소를 확인하고 있습니다</p>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">로그인 실패</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={autoLogin}
            className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 로그인 성공 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg">
        
        {/* 헤더 */}
        <div className={`p-6 text-center text-white ${
          user?.loginCount === 1 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}>
          <div className="text-5xl mb-3">
            {user?.loginCount === 1 ? '🎉' : '👋'}
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {user?.loginCount === 1 ? '환영합니다!' : '돌아오셨군요!'}
          </h1>
          <p className="text-white/90 text-sm">
            {user?.loginCount === 1 
              ? '새로운 계정이 생성되었습니다' 
              : `${user?.loginCount}번째 방문입니다`
            }
          </p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="p-6">
          
          {/* 성공 메시지 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-700 font-medium">{loginMessage}</p>
          </div>

          {/* 사용자 정보 */}
          <div className="space-y-4 mb-6">
            
            {/* 닉네임 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">닉네임</label>
                {!isEditingNickname && (
                  <button
                    onClick={() => setIsEditingNickname(true)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    ✏️ 수정
                  </button>
                )}
              </div>
              
              {isEditingNickname ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="새 닉네임을 입력하세요"
                    maxLength={20}
                  />
                  {nicknameError && (
                    <p className="text-red-500 text-xs">{nicknameError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={updateNickname}
                      disabled={nicknameLoading}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 text-sm font-medium"
                    >
                      {nicknameLoading ? '저장 중...' : '저장'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingNickname(false);
                        setNewNickname(user.nickname);
                        setNicknameError('');
                      }}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 text-sm font-medium"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-semibold text-blue-600">{user?.nickname}</p>
              )}
            </div>

            {/* 기타 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">레벨</p>
                <p className="text-lg font-bold text-purple-600">{user?.level}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">점수</p>
                <p className="text-lg font-bold text-green-600">{user?.score}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">방문 횟수</p>
                <p className="text-lg font-bold text-orange-600">{user?.loginCount}회</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">IP</p>
                <p className="text-sm font-mono text-gray-700">{user?.ip}</p>
              </div>
            </div>

            {/* 가입일 */}
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">가입일</p>
              <p className="text-sm text-gray-700">
                {user && new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
            >
              🎮 게임 시작
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                🔄 새로고침
              </button>
              
              <button
                onClick={() => window.open('/api/users', '_blank')}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                👥 사용자 목록
              </button>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              💡 IP 주소 기반으로 자동 로그인됩니다. 다른 기기에서 접속하면 새 계정이 생성됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

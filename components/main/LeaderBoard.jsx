"use client";
import { useEffect, useState, useRef } from "react";

const LeaderBoard = ({ score, nickname, gameOver }) => {
  console.log("<LeaderBoard /> 렌더링 됨");
  console.log("Props:", { score, nickname, gameOver }); // 🔍 props 확인
  
  const [players, setPlayers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("연결 중...");
  const socketRef = useRef(null);

  // 매판 세션 플레이어들 관리
  useEffect(() => {
    console.log("🔌 WebSocket 연결 시도...");
    
    socketRef.current = new WebSocket("wss://game-server-ihbh.onrender.com/");
    
    socketRef.current.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setConnectionStatus("연결됨");
      
      // 초기 점수 전송
      if (nickname) {
        const message = {
          type: "scoreUpdate",
          payload: { nickname, score: score || 0 },
        };
        console.log("📤 초기 메시지 전송:", message);
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("⚠️ nickname이 없어서 초기 메시지를 보낼 수 없습니다");
      }
    };

    socketRef.current.onmessage = (message) => {
      console.log("📥 서버로부터 메시지 받음:", message.data);
      
      try {
        const data = JSON.parse(message.data);
        console.log("🔍 파싱된 데이터:", data);

        if (data.type === "leaderboard" && Array.isArray(data.payload)) {
          console.log("📊 리더보드 데이터:", data.payload);
          
          const ranked = data.payload
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((player, index) => ({ ...player, rank: index + 1 }));
          
          console.log("🏆 순위가 매겨진 데이터:", ranked);
          setPlayers(ranked);
        } else {
          console.log("🤔 예상과 다른 메시지 타입:", data.type);
        }
      } catch (err) {
        console.error("❌ JSON 파싱 오류:", err);
        console.log("원본 메시지:", message.data);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      setConnectionStatus("연결 오류");
    };

    socketRef.current.onclose = (event) => {
      console.log("🔌 WebSocket 연결 종료:", event.code, event.reason);
      setConnectionStatus("연결 종료됨");
    };

    return () => {
      if (socketRef.current) {
        console.log("🧹 WebSocket 정리 중...");
        socketRef.current.close();
      }
    };
  }, [nickname]); // nickname이 변경될 때마다 재연결

  // score가 바뀔 때마다 서버에 점수 업데이트 전송
  useEffect(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      !gameOver &&
      nickname
    ) {
      const message = {
        type: "scoreUpdate",
        payload: { nickname, score },
      };
      console.log("📤 점수 업데이트 전송:", message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.log("📤 점수 업데이트 전송 불가:", {
        socketReady: socketRef.current?.readyState === WebSocket.OPEN,
        gameOver,
        nickname
      });
    }
  }, [score, nickname, gameOver]);

  // 🏆 순위별 아이콘과 색상 결정
  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return { icon: "🥇", bgColor: "bg-gradient-to-r from-yellow-400 to-orange-400", textColor: "text-white" };
      case 2:
        return { icon: "🥈", bgColor: "bg-gradient-to-r from-gray-300 to-gray-400", textColor: "text-white" };
      case 3:
        return { icon: "🥉", bgColor: "bg-gradient-to-r from-amber-600 to-amber-700", textColor: "text-white" };
      default:
        return { icon: `${rank}위`, bgColor: "bg-white", textColor: "text-gray-700" };
    }
  };

  // 🔗 연결 상태 표시
  const getConnectionDisplay = () => {
    switch (connectionStatus) {
      case "연결됨":
        return { icon: "🟢", color: "text-green-600", text: "실시간 연결" };
      case "연결 중...":
        return { icon: "🟡", color: "text-yellow-600", text: "연결 중..." };
      case "연결 오류":
        return { icon: "🔴", color: "text-red-600", text: "연결 실패" };
      default:
        return { icon: "⚫", color: "text-gray-600", text: "연결 끊김" };
    }
  };

  const connectionDisplay = getConnectionDisplay();

  return (
    <div className="p-6 h-full">
      {/* 🏆 헤더 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl p-4 -mx-6 -mt-6 mb-6">
        <h2 className="text-2xl font-bold text-center mb-2">🏆 리더보드</h2>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span>{connectionDisplay.icon}</span>
          <span className={connectionDisplay.color}>{connectionDisplay.text}</span>
        </div>
      </div>

      {/* 📊 내 점수 카드 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 mb-6 text-center">
        <div className="text-sm font-medium mb-1">내 현재 점수</div>
        <div className="text-3xl font-bold">{score}</div>
        <div className="text-xs opacity-80 mt-1">{nickname}</div>
      </div>

      {/* 🏅 순위 목록 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {players.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto mb-3"></div>
            <div className="text-gray-500 text-sm">플레이어 데이터 로딩 중...</div>
          </div>
        ) : (
          players.map((user, index) => {
            const rankDisplay = getRankDisplay(user.rank);
            const isCurrentUser = user.nickname === nickname;
            
            return (
              <div
                key={user.nickname}
                className={`
                  rounded-xl shadow-lg p-4 transition-all duration-300 transform hover:scale-105
                  ${isCurrentUser 
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400 ring-2 ring-blue-200" 
                    : rankDisplay.bgColor
                  }
                  ${isCurrentUser ? "animate-pulse" : ""}
                `}
              >
                <div className="flex items-center justify-between">
                  {/* 순위 */}
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      ${user.rank <= 3 
                        ? "bg-white/20 text-white" 
                        : "bg-gray-100 text-gray-600"
                      }
                    `}>
                      {user.rank <= 3 ? rankDisplay.icon : user.rank}
                    </div>
                    
                    {/* 닉네임 */}
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm ${
                        isCurrentUser ? "text-blue-800" : 
                        user.rank <= 3 ? "text-white" : "text-gray-700"
                      }`}>
                        {user.nickname}
                        {isCurrentUser && <span className="ml-1">👤</span>}
                      </span>
                      {user.rank === 1 && (
                        <span className="text-xs text-white/80">🔥 최고 점수!</span>
                      )}
                    </div>
                  </div>

                  {/* 점수 */}
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      isCurrentUser ? "text-blue-800" : 
                      user.rank <= 3 ? "text-white" : "text-gray-700"
                    }`}>
                      {user.score}
                    </div>
                    <div className={`text-xs ${
                      isCurrentUser ? "text-blue-600" : 
                      user.rank <= 3 ? "text-white/70" : "text-gray-500"
                    }`}>
                      점
                    </div>
                  </div>
                </div>

                {/* 순위 변동 애니메이션 (Top 3만) */}
                {user.rank <= 3 && (
                  <div className="mt-2 flex justify-center">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full bg-white/50 animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 🏁 게임 종료 메시지 */}
      {gameOver && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-6 text-center">
          <div className="text-2xl mb-2">⏰</div>
          <div className="text-red-700 font-semibold text-sm">
            게임이 종료되었습니다
          </div>
          <div className="text-red-600 text-xs mt-1">
            최종 순위가 확정되었습니다
          </div>
        </div>
      )}

      {/* 📈 통계 정보 (플레이어가 있을 때만) */}
      {players.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mt-6">
          <div className="text-xs text-gray-600 text-center space-y-1">
            <div>전체 플레이어: <span className="font-bold text-purple-600">{players.length}명</span></div>
            <div>최고 점수: <span className="font-bold text-orange-600">{Math.max(...players.map(p => p.score))}점</span></div>
            {nickname && (
              <div>
                내 순위: <span className="font-bold text-blue-600">
                  {players.find(p => p.nickname === nickname)?.rank || '-'}위
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
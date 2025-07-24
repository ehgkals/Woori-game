import Game from "@/components/Game";
import Header from "@/components/Header";
import LeaderBoard from "@/components/LeaderBoard";
import Modal from "@/components/Modal";


export default async function Home() {
  // const ip = getClientIP(); // IP 추출 (예: headers, request)
  // const nickname = await getNicknameByIP(ip);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Game />
        <LeaderBoard />
      </div>
      {/* {!nickname && <Modal />} */}
    </div>
  );
}

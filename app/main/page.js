import Game from "@/components/main/Game";
import Header from "@/components/main/Header";
import LeaderBoard from "@/components/main/LeaderBoard";
import Modal from "@/components/main/Modal";


export default async function Main() {

  
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
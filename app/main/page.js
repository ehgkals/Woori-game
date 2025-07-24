"use client"

import Game from "@/components/main/Game";
import Header from "@/components/main/Header";
import LeaderBoard from "@/components/main/LeaderBoard";
import { useEffect, useState } from "react";


export default function Main() {
  const [score,  setScore] = useState(0);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/login');
      const data = await res.json();
      if (data.success) {
        setNickname(data.user.nickname);
      }
    }
    fetchUser();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Game onScoreChange={setScore} />
        <LeaderBoard score={score} nickname={nickname} />
      </div>
    </div>
  );
}
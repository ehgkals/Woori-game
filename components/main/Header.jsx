const Header = () => {
  console.log("<Header /> 렌더링 됨");

  return (
    <div className="w-full h-20 bg-blue-500 shadow-md flex items-center px-6">
        <div className="text-white text-2xl font-bold tracking-wide">
        🎮 Woori Game
      </div>
    </div>
  );
};

export default Header;
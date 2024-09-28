import React from "react";
interface BottomNavigationProps {
  children: React.ReactNode;
}
const BottomNavigation: React.FC<BottomNavigationProps> = ({ children }) => {
  return (
    <>
      <header className="navbar bg-neutral flex justify-center border-none">
        <a className="btn btn-ghost text-xl text-white">NoteBot</a>
      </header>
      {children}

      <nav className="btm-nav bg-neutral border-none text-white">
        <button className="bg-neutral">
          <span className="btm-nav-label ">Home</span>
        </button>
        <button className="bg-neutral">
          <span className="btm-nav-label">Quiz</span>
        </button>
        <button className="bg-neutral">
          <span className="btm-nav-label">Stats</span>
        </button>
        <button className="bg-neutral">
          <span className="btm-nav-label">Profile</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNavigation;

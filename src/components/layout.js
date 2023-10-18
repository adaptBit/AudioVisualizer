import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="w-[100dvw] h-[100dvh] flex justify-center items-center overflow-hidden">
      <div>{children}</div>
    </div>
  );
};
export default Layout;

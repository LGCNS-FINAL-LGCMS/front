import React from "react";
import RouteButton from "../../components/Button/RouteButton";

import errorCharactor from "../../assets/imgs/errorPage/errorCharactor.png";

const ErrorPage = () => {
  return (
    <div>
      <img
        src={errorCharactor}
        alt="errorCharactor"
        className="h-[200px] -mt-[100px] mx-auto"
      />
      <div
        className="text-[100px] animate-bounce font-bold bg-gradient-to-r from-secondary 
      to-lightMint bg-clip-text text-transparent px-0 py-0"
      >
        404
      </div>
      <div className="font-korean font-bold text-base max-w-md mx-auto pb-[30px]">
        존재하지 않는 주소를 입력하셨거나, <br />
        요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
      </div>
      <RouteButton to="/" text="메인으로" />
    </div>
  );
};

export default ErrorPage;

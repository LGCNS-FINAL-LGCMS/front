import React, { useEffect, useRef, useState } from "react";
import KakaoPayBox from "../../components/Payment/KakaoPayBox";
import ProductList from "../../components/Payment/ProductList";
import styled, { keyframes, css } from "styled-components";
import { deleteCart, getCart } from "../../api/Payment/cartAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  setCancelled,
  setLoading,
  setFailure,
  setPaymentInfo,
  setPending,
  setSuccess,
} from "../../redux/Payment/paymentSlice";

//api
import {
  postPaymentApprove,
  postPaymentBundleReady,
  postPaymentReady,
  type paymentData,
} from "../../api/Payment/paymentAPI";
import { PAGE_PATHS } from "../../constants/pagePaths";
import { useNavigate } from "react-router-dom";
// import { postLectureStudent } from '../../api/Lecture/lectureAPI';

import type { RootState } from "../../redux/store";
import { postLectureStudent } from "../../api/Lecture/lectureAPI";
import InfoCheckModal from "../../components/Signup/signupModal";

const PaymentContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.font.primary};
  
  /* Mobile */
  flex-direction: column; 
  align-items: center;    
  gap: 20px;
  width: 100%;
  min-width: 320px;       
  margin: 20px auto;
  padding: 15px;

  /* Tablet (768px 이상) */
  @media (min-width: 768px) {
    flex-direction: row;            
    align-items: flex-start;        
    justify-content: center;
    gap: 30px;
    margin: 50px auto;
    padding: 20px;
  }

  /* Desktop (1024px 이상) */
  @media (min-width: 1024px) {
    max-width: 1200px; 
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  `;

const Overlay = styled.div<{ $disabled: boolean }>`
  position: absolute;
  top: 0;
  left: 0;

  ${(props) =>
    props.$disabled &&
    css`
      width: 100%;
      height: 100%;
      z-index: ${({ theme }) => theme.zIndex.overlay};
      width: 100%;
      height: 100%;
      background-color: ${({ theme }) => theme.colors.disable};

      cursor: not-allowed;

      // 스피너를 보여주기 위한 로딩 오버레이 스타일
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 4px solid rgba(253, 3, 3, 0.3);
        border-top: 4px solid #ff0000ff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: ${spin} 1s linear infinite;
      }
    `}
`;

const ProductWrapper = styled.div`
  flex: 1; /* 남은 공간을 채우도록 설정 */
  min-width: 400px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 10px;
  padding: 30px;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const KakaoPayBoxWrapper = styled.div`
  min-width: 400px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 10px;
  padding: 30px;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

export type LectureItem = {
  id: number;
  cartId: number;
  lectureId: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  selected: boolean;
};

const PaymentPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 상태관리
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [items, setItems] = useState<LectureItem[]>([]);
  const [nextAction, setNextAction] = useState<(() => void) | null>(null);

  const popupIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 이벤트 이름 선언
    const handleMessage = async (event: MessageEvent) => {
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }

      if (event.data.type === "fail") {
        dispatch(setFailure());
        setNextAction(() => () => navigate(PAGE_PATHS.PAYMENT.RESULT));
        setModalMessage("결제에 실패했습니다.");
        setModalIsOpen(true);
        return;
      } else if (event.data.type === "cancel") {
        dispatch(setCancelled());
        setNextAction(() => () => navigate(PAGE_PATHS.PAYMENT.RESULT));
        setModalMessage("결제를 취소했습니다.");
        setModalIsOpen(true);
        return;
      } else {
        // event.data.type이 성공일시
        const pgToken = event.data.pg_token;
        const tid = sessionStorage.getItem("tid");

        // 카트ID가져오기
        const pendingCartIdString = sessionStorage.getItem("itemIds");
        const pendingCartId = pendingCartIdString
          ? JSON.parse(pendingCartIdString)
          : [];

        // 강의 ID 가져오기
        const pendingLectureIdString =
          sessionStorage.getItem("lectureIds");
        const pendingLectureId = pendingLectureIdString
          ? JSON.parse(pendingLectureIdString)
          : [];

        // 요청 리퀘스트에 넣을 cartInfos형태에 맞게 리스트 생성
        const cartIdList = pendingCartId.map((id: number) => ({
          cartId: id,
          lectureId: pendingLectureId[pendingCartId.indexOf(id)],
        }));

        if (pgToken && tid) {
          // 이 로직은 이제 단 한번만 안전하게 실행
          const paymentResult = await postPaymentApprove({
            token: pgToken,
            tid: tid,
            cartInfos: cartIdList,
          });

          // 결제승인 요청이 완료되면 모달이 열리고 확인 누르면 페이지로 넘어간다.
          if (paymentResult === "결제가 완료되었습니다.") {
            // alert("결제가 완료되었습니다.");
            dispatch(setSuccess());
            setNextAction(() => () => navigate(PAGE_PATHS.PAYMENT.RESULT));
            setModalMessage("결제가 완료되었습니다.");
            setModalIsOpen(true);

            return;
          } else {
            // 결제승인 요청 실패시
            // alert("결제가 실패하였습니다.");
            dispatch(setFailure());
            setNextAction(() => () => navigate(PAGE_PATHS.PAYMENT.RESULT));
            setModalMessage("결제가 실패하였습니다.");
            setModalIsOpen(true);

            return;
          }
        };
        window.addEventListener("message", handleMessage);

        // 컴포넌트가 화면에서 사라질 때(unmount) 등록했던 리스너를 '제거'합니다.
        return () => {
          window.removeEventListener("message", handleMessage);
          // 만약 인터벌이 남아있다면 함께 정리
          if (popupIntervalRef.current) {
            clearInterval(popupIntervalRef.current);
          }
        };
      }
    };

    // 컴포넌트가 처음 렌더링될 때 '한 번만' 이벤트 리스너를 등록
    window.addEventListener("message", handleMessage);

    // 컴포넌트가 화면에서 사라질 때(unmount) 등록했던 리스너를 '제거'
    return () => {
      window.removeEventListener("message", handleMessage);
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }
    };
  }, [dispatch, navigate])

  // 장바구니 데이터 가져오는 useEffect
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await getCart();
        dispatch(setPending());

        setItems(
          data.cartResponses.map((item) => ({
            cartId: item.cartId,
            lectureId: item.lectureId,
            title: item.title,
            price: item.price,
            thumbnailUrl: item.thumbnailUrl,
            selected: true,
            id: 1,
          }))
        );
      } catch {
        // console.error("장바구니 데이터를 가져오는데 실패했습니다.", error);
      }
    };
    fetchCartData();
  }, [dispatch]);


  // 결제함수
  const startKakaoAccount = async (subtotal: number) => {
    try {
      let tid = "";
      dispatch(setLoading());

      sessionStorage.setItem(
        "itemIds",
        JSON.stringify(
          items.filter((item) => item.selected).map((item) => item.cartId)
        )
      );
      sessionStorage.setItem(
        "lectureIds",
        JSON.stringify(
          items.filter((item) => item.selected).map((item) => item.lectureId)
        )
      );
      // console.log(
      //   "구매할 아이템",
      //   items.filter((item) => item.selected).map((item) => item.cartId)
      // );

      let response: paymentData;
      let stepUrl = "";

      // 무료 강의 결제 시
      if (subtotal <= 0) {
        // 바로 join요청 + cart에서 제거
        const enrollmentPromises = items
          .filter(item => item.selected)
          .map(item => postLectureStudent(item.lectureId));

        const enrollmentDelete = items
          .filter(item => item.selected)
          .map(item => deleteCart(item.cartId));



        await Promise.all(enrollmentPromises);
        await Promise.all(enrollmentDelete);

        dispatch(
          setPaymentInfo({
            totalAmount: subtotal,
            paymentMethod: "KakaoPay",
            transactionId: tid,
          })
        );

        // alert("결제가 완료되었습니다.");
        setNextAction(() => () => navigate(PAGE_PATHS.PAYMENT.RESULT));
        setModalMessage("결제가 완료되었습니다.");
        setModalIsOpen(true);

        dispatch(setSuccess());
        navigate(PAGE_PATHS.PAYMENT.RESULT);
        return;
      }

      // 실제 결제 api
      // 중복막기 ( 만에 하나 동일한 렉쳐가 들어왔을 때 )
      const itemsList = items
        .filter(item => item.selected)
        .filter((item, index, self) =>
          index === self.findIndex(t => t.lectureId === item.lectureId)
        );

      // 준비요청 -> 카카오 팝업 -> tid와 토큰값을 승인api요청 -> 결제완료!
      if (itemsList.length > 1) {
        // case 1: 개수가 2개 이상인 경우 /payment/list/ready
        response = await postPaymentBundleReady(itemsList);

        tid = response.tid;
        sessionStorage.setItem("tid", tid);
        stepUrl = response.nextStepUrl;
      } else if (itemsList.length === 1) {
        // case 2: 개수가 한개인 경우 /payment/ready
        response = await postPaymentReady(itemsList[0]);

        tid = response.tid;
        sessionStorage.setItem("tid", tid);
        stepUrl = response.nextStepUrl;
        // console.log(response.nextStepUrl);
      } else {
        // alert("결제할 항목이 없습니다.");
        setModalMessage("결제할 항목이 없습니다.");
        setModalIsOpen(true);

        dispatch(setPending());
        return;
      }

      dispatch(
        setPaymentInfo({
          totalAmount: subtotal,
          paymentMethod: "KakaoPay",
          transactionId: tid,
        })
      );

      // 팝업 오픈
      const popUp = window.open(
        stepUrl,
        "카카오페이 결제",
        "width=450,height=700"
      ) as Window;
      if (!popUp) {
        // alert("팝업 차단을 해제해주세요.");
        setModalMessage("팝업 차단을 해제해주세요.");
        setModalIsOpen(true);
        return;
      }

      // 기존에 실행되던 인터벌이 있다면 먼저 정리합니다.
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }

      popupIntervalRef.current = window.setInterval(async () => {
        try {
          if (!popUp || popUp.closed) {
            clearInterval(popupIntervalRef.current as number); // 확실하게 number로 타입 단언

            sessionStorage.removeItem("tid"); // 세션 정리
            setModalMessage("결제가 취소되었습니다.");
            setModalIsOpen(true);
            dispatch(setCancelled());
          }
        } catch {
          // alert("결제창이 닫혔습니다. 결제를 완료해주세요.");
          setModalMessage("결제창이 닫혔습니다. 결제를 완료해주세요.");
          setModalIsOpen(true);

          // 세션 청소
          sessionStorage.removeItem("itemIds");
          sessionStorage.removeItem("lectureIds");
          sessionStorage.removeItem("tid");



          dispatch(setPending());
        }
      }, 500);
    } catch {
      setModalMessage("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setModalIsOpen(true);

      dispatch(setFailure());

      // 세션 청소
      sessionStorage.removeItem("itemIds");
      sessionStorage.removeItem("lectureIds");
      sessionStorage.removeItem("tid");

      navigate(PAGE_PATHS.PAYMENT.RESULT);
    }
  };

  return (
    <PaymentContainer>
      {/* 사용자에게 확인시켜주는 용도의 모달 */}
      <InfoCheckModal
        isOpen={modalIsOpen}
        message={modalMessage}
        onConfirm={function (): void {
          setModalIsOpen(false);
          if (nextAction) {
            nextAction();
            setNextAction(null);
          }
        }}
        onCancel={function (): void {
          setNextAction(null);
        }}
      />

      <ProductWrapper>
        <ProductList items={items} setItems={setItems} />
      </ProductWrapper>
      <KakaoPayBoxWrapper>
        <KakaoPayBox items={items} startKakaoAccount={startKakaoAccount} />
      </KakaoPayBoxWrapper>

      <Overlay
        $disabled={
          useSelector((state: RootState) => state.payment.paymentStatus) ===
          "loading"
        }
      ></Overlay>
    </PaymentContainer>
  );
};

export default PaymentPage;

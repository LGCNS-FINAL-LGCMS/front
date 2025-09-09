import React, { useEffect, useState } from "react";
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

      // 실제 결제 api
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
        setModalMessage("결제가 완료되었습니다.");
        setModalIsOpen(true);

        dispatch(setSuccess());
        navigate(PAGE_PATHS.PAYMENT.RESULT);
        return;
      }

      // 준비요청 -> 카카오 팝업 -> tid와 토큰값을 승인api요청 -> 결제완료!
      if (items.length > 1) {
        // case 1: 개수가 2개 이상인 경우 /payment/list/ready
        response = await postPaymentBundleReady(items.filter(item => item.selected));

        tid = response.tid;
        sessionStorage.setItem("tid", tid);
        stepUrl = response.nextStepUrl;
      } else if (items.length === 1) {
        // case 2: 개수가 한개인 경우 /payment/ready
        response = await postPaymentReady(items[0]);

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

      const checkPopupClosed = setInterval(() => {
        try {
          if (!popUp || popUp.closed) {
            // alert("결제창이 닫혔습니다. 결제를 완료해주세요.");
            setModalMessage("결제창이 닫혔습니다. 결제를 완료해주세요.");
            setModalIsOpen(true);

            dispatch(setPending());
            clearInterval(checkPopupClosed);
          }
        } catch {
          // alert("결제창이 닫혔습니다. 결제를 완료해주세요.");
          setModalMessage("결제창이 닫혔습니다. 결제를 완료해주세요.");
          setModalIsOpen(true);

          dispatch(setPending());
          clearInterval(checkPopupClosed);
        }
      }, 500);

      /**
       * ** 팝업에서 결제 진행 **
       **/
      /** 결제 성공시 이벤트리스너 (postMessage 받기) **/

      window.addEventListener(
        "message",
        async (event) => {
          // 이벤트 보낸 오리진이 카카오결제창이라 다를 수도 있으니 안되면 삭제하세요 if문
          if (event.data.type === "fail") {
            // 실패창 넘어가기
            dispatch(setFailure());
            navigate(PAGE_PATHS.PAYMENT.RESULT);
            //  TODO 실패요청 백엔드로 보내기
            return;
          } else if (event.data.type === "cancel") {
            // 취소창 넘어가기
            dispatch(setCancelled());
            navigate(PAGE_PATHS.PAYMENT.RESULT);
            // TODO 취소요청 백엔드로 보내기
            return;
          } else {
            const pgToken = event.data.pg_token;
            const tid = sessionStorage.getItem("tid");
            // console.log("pgToken 수신 : ", pgToken);
            // console.log("tid : ", tid);
            if (pgToken && tid) {
              clearInterval(checkPopupClosed);

              const pendingCartIdString = sessionStorage.getItem("itemIds");
              const pendingCartId = pendingCartIdString
                ? JSON.parse(pendingCartIdString)
                : [];
              // console.log("장바구니 아이디:", pendingCartId);

              const pendingLectureIdString =
                sessionStorage.getItem("lectureIds");
              const pendingLectureId = pendingLectureIdString
                ? JSON.parse(pendingLectureIdString)
                : [];

              const cartIdList = pendingCartId.map((id: number) => ({
                cartId: id,
                lectureId: pendingLectureId[pendingCartId.indexOf(id)],
              }));
              // console.log("cartIdList:", cartIdList);
              const paymentResult = await postPaymentApprove({
                token: pgToken,
                tid: tid,
                cartInfos: cartIdList,
              });

              if (paymentResult === "결제가 완료되었습니다.") {
                // alert("결제가 완료되었습니다.");
                setModalMessage("결제가 완료되었습니다.");
                setModalIsOpen(true);

                // 완료창 넘어가기
                dispatch(setSuccess());
                navigate(PAGE_PATHS.PAYMENT.RESULT);
                return;
              } else {
                // alert("결제가 실패하였습니다.");
                setModalMessage("결제가 실패하였습니다.");
                setModalIsOpen(true);

                // 실패창 넘어가기
                dispatch(setFailure());
                //  TODO 실패요청 백엔드로 보내기
                navigate(PAGE_PATHS.PAYMENT.RESULT);
                return;
              }
            }
          }

        },
        false
      ); // 버블링(false)인지 캡처링(true)인지 상관없다. mes sage타입 이벤트는 DOM트리를 거치지 않고 window에 직접 전달되니까!
    } catch {
      // console.error("결제 처리 중 오류가 발생했습니다.", error);
      // alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setModalMessage("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setModalIsOpen(true);

      dispatch(setFailure());
      // sessionStorage.removeItem('itemIds');

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
        }}
        onCancel={function (): void {
          throw new Error("Function not implemented.");
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

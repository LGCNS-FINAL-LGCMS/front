import React, { useEffect, useState } from 'react';
import KakaoPayBox from '../../components/Payment/KakaoPayBox';
import ProductList from '../../components/Payment/ProductList';
import styled, { keyframes, css } from 'styled-components';
import { getCart } from '../../api/Payment/cartAPI';

import { useDispatch, useSelector } from 'react-redux';
import { setCancelled, setLoading, setFailure, setPaymentInfo, setPending, setSuccess } from '../../redux/Payment/paymentSlice';



//api
import {
  postPaymentApprove,
  postPaymentBundleReady,
  postPaymentReady,
  type paymentData,
} from '../../api/Payment/paymentAPI';
import { PAGE_PATHS } from '../../constants/pagePaths';
import { useNavigate } from 'react-router-dom';
// import { postLectureStudent } from '../../api/Lecture/lectureAPI';
import type { RootState } from '../../redux/store';


const PaymentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px; /* 두 컴포넌트 사이의 간격 */
  width: 100%;
  max-width: 1200px; /* 최대 너비 설정 */
  margin: 50px auto; /* 중앙 정렬 */
  padding: 20px;
  
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
    z-index: ${({ theme }) => theme.zIndex.overlay}
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.disable};

    cursor: not-allowed;

      // 스피너를 보여주기 위한 로딩 오버레이 스타일
      &::after {
        content: '';
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
  cartId: number,
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
  const [items, setItems] = useState<LectureItem[]>([]);
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await getCart();
        dispatch(setPending());

        setItems(data.cartResponses.map(item => ({
          ...item,
          selected: true,
        })));

      } catch (error) {
        console.error("장바구니 데이터를 가져오는데 실패했습니다.", error);
      }
    }
    fetchCartData();
  }, [])

  // 결제함수

  const startKakaoAccount = async () => {
    try {

      let tid = '';
      dispatch(setLoading());

      sessionStorage.setItem('itemIds',
        JSON.stringify(items
          .filter(item => item.selected)
          .map(items => items.cartId)
        )
      );
      const selectedItems = items.filter(item => item.selected);
      const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0)

      let response: paymentData;
      let stepUrl = '';

      // 실제 결제 api
      // 처음에 바로 강의등록해놓고 결제실패시 삭제하는 방식으로 만들기
      // selectedItems.map(async (item) => await postLectureStudent(item.lectureId));

      // 준비요청 -> 카카오 팝업 -> tid와 토큰값을 승인api요청 -> 결제완료!
      if (items.length > 1) {
        // case 1: 개수가 2개 이상인 경우 /payment/list/ready

        response = await postPaymentBundleReady(items)

        tid = response.tid;
        sessionStorage.setItem('tid', tid);
        stepUrl = response.nextStepUrl;

      } else if (items.length === 1) {
        // case 2: 개수가 한개인 경우 /payment/ready
        response = await postPaymentReady(items[0])

        tid = response.tid;
        sessionStorage.setItem('tid', tid);
        stepUrl = response.nextStepUrl;
        console.log(response.nextStepUrl);
      } else {
        alert("결제할 항목이 없습니다.");
        dispatch(setPending());
        return;
      }


      dispatch(setPaymentInfo({
        totalAmount: subtotal,
        paymentMethod: "KakaoPay",
        transactionId: tid,
      }))



      const popUp = window.open(stepUrl, "카카오페이 결제", 'width=450,height=700');


      const checkPopupClosed = setInterval(() => {
        if (popUp.closed) {
          clearInterval(checkPopupClosed);
          dispatch(setPending());
        }
      }, 1000);

      /**
       * ** 팝업에서 결제 진행 **
     **/
      /** 결제 성공시 이벤트리스너 (postMessage 받기) **/
      window.addEventListener('message', async (event) => {
        // 이벤트 보낸 오리진이 카카오결제창이라 다를 수도 있으니 안되면 삭제하세요 if문

        clearInterval(checkPopupClosed);
        if (event.data.type === "fail") {
          // 실패창 넘어가기
          console.log('결제 실패 tntls')
          dispatch(setFailure())
          navigate(PAGE_PATHS.PAYMENT.RESULT);

        } else if (event.data.type === "cancel") {
          // 취소창 넘어가기
          dispatch(setCancelled())
          navigate(PAGE_PATHS.PAYMENT.RESULT);

        } else {
          const pgToken = event.data.pg_token
          const tid = sessionStorage.getItem('tid');
          console.log('pgToken 수신 : ', pgToken);
          console.log('tid : ', tid);
          if (pgToken && tid) {

            const pendingCartIdString = sessionStorage.getItem('itemIds');
            const pendingCartId = pendingCartIdString ? JSON.parse(pendingCartIdString) : [];
            console.log('장바구니 아이디:', pendingCartId);

            const paymentResult = await postPaymentApprove({ token: pgToken, tid: tid, cartId: pendingCartId });

            if (paymentResult === "결제가 완료되었습니다.") {
              alert("결제가 완료되었습니다.")
              // 완료창 넘어가기
              dispatch(setSuccess())
              navigate(PAGE_PATHS.PAYMENT.RESULT);

            } else {
              alert("결제가 실패하였습니다.")
              // 실패창 넘어가기
              dispatch(setFailure())
              //  TODO 실패요청 백엔드로 보내기
              navigate(PAGE_PATHS.PAYMENT.RESULT);
            }
          }
        }

      }, false) // 버블링(false)인지 캡처링(true)인지 상관없다. mes sage타입 이벤트는 DOM트리를 거치지 않고 window에 직접 전달되니까!
    } catch (error) {
      console.error("결제 처리 중 오류가 발생했습니다.", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
      dispatch(setFailure());
      // sessionStorage.removeItem('itemIds');

      navigate(PAGE_PATHS.PAYMENT.RESULT);
    }
  }


  return (
    <PaymentContainer>

      <ProductWrapper>
        <ProductList items={items} setItems={setItems} />
      </ProductWrapper>
      <KakaoPayBoxWrapper>
        <KakaoPayBox items={items} startKakaoAccount={startKakaoAccount} />
      </KakaoPayBoxWrapper>

      <Overlay $disabled={
        useSelector((state: RootState) => state.payment.paymentStatus) === 'loading'
      }></Overlay>
    </PaymentContainer>

  );
};

export default PaymentPage;
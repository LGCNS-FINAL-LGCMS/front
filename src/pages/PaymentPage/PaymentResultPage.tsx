import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';

import CheckMarkIcon from '/green-check-mark.svg';
import ErrorMarkIcon from '/error-mark.svg';
import WarningMarkIcon from '/warning-mark.svg';
import Button from '../../components/Common/Button';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from '../../constants/pagePaths';
import type { RootState } from '../../redux/store';

export type PaymentResultStatus = 'success' | 'failure' | 'pending';



function SuccessIcon() {
    return (
        <>
            <img src={CheckMarkIcon} width="80" height="80" aria-hidden />
        </>
    );
}
function CancelIcon() {
    return (
        <>
            <img src={WarningMarkIcon} width="80" height="80" />
        </>
    );
}
function FailIcon() {
    return (
        <>
            <img src={ErrorMarkIcon} width="80" height="80" />
        </>
    );
}



const PaymentResultPage: React.FC = () => {
    const navigate = useNavigate();

    // 세션 제거
    sessionStorage.removeItem('tid');
    sessionStorage.removeItem('itemIds');


    const paymentStatus = useSelector((state: RootState) => state.payment.paymentStatus);
    const totalAmount = useSelector((state: RootState) => state.payment.totalAmount);
    const paymentMethod = useSelector((state: RootState) => state.payment.paymentMethod);

    return (
        <PageWrap>
            <Hero $tone={paymentStatus === 'success' ? 'green' : paymentStatus === 'failure' ? 'red' : 'gray'}>

                <IconWrap>
                    {paymentStatus === 'success' ? <SuccessIcon /> :
                        paymentStatus === 'failure' ? <FailIcon /> :
                            <CancelIcon />}
                    <Title>{paymentStatus === 'success' ? '결제가 완료되었습니다!' :
                        paymentStatus === 'failure' ? '결제에 실패했습니다.' :
                            '결제가 취소되었습니다.'}</Title>
                    <Desc>{paymentStatus === 'success' ? '감사합니다! 결제가 성공적으로 처리되었습니다.' :
                        paymentStatus === 'failure' ? '다시 시도해 주세요.' :
                            '필요하시면 다시 시도해 주세요.'}</Desc>

                </IconWrap>
            </Hero>

            <Section>
                <SectionTitle>추가 정보</SectionTitle>
                {/* 추가 정보 컴포넌트 */}

                <SummaryCard>
                    <SummaryRow>
                        <Label>결제 금액</Label>
                        <Value><Mono>₩ {totalAmount.toLocaleString()}</Mono></Value>
                    </SummaryRow>
                    <SummaryRow>
                        <Label>결제 방법</Label>
                        <Value><Mono>{paymentMethod}</Mono></Value>
                    </SummaryRow>

                </SummaryCard>
            </Section>

            <Actions>
                <Button
                    text="확인"
                    onClick={() => {
                        navigate(PAGE_PATHS.HOME)
                    }}
                    design={2}
                    fontColor={2}
                    fontWeight={400}
                />
            </Actions>

            {/* 나중에 삭제하세요. 테스트용입니다. */}
            {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
                <Button
                    text="결제 성공"
                    onClick={() => {
                        dispatch(setSuccess());
                    }}
                    design={3}
                    fontColor={2}
                    fontWeight={400}
                />
                <Button
                    text="결제 실패"
                    onClick={() => {
                        dispatch(setFailure());
                    }}
                    design={3}
                    fontColor={2}
                    fontWeight={400}
                />
                <Button
                    text="결제 취소"
                    onClick={() => {
                        dispatch(setCancelled());
                    }}
                    design={3}
                    fontColor={2}
                    fontWeight={400}
                />
                <Button
                    text="결제 대기"
                    onClick={() => {
                        dispatch(setPending());
                    }}
                    design={3}
                    fontColor={2}
                    fontWeight={400}
                />
                <Button
                    text="결제 정보 설정"
                    onClick={() => {
                        dispatch(setPaymentInfo({ totalAmount: Math.floor(Math.random() * 90001) + 10000, paymentMethod: "KakaoPay", transactionId: new Date().getTime().toString() }));
                        console.log('결제 정보 설정됨');
                    }}
                    design={3}
                    fontColor={2}
                    fontWeight={400}
                />
            </div> */}

        </PageWrap >
    );
};

export default PaymentResultPage;

const PageWrap = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 0 16px 24px;
`;

const Hero = styled.div<{ $tone: 'green' | 'gray' | 'red' }>`
  display: flex; flex-direction: column; align-items: center; text-align: center;
  height: 280px;
  padding: 22px 16px;
  border-radius: 12px;
  margin-bottom: 14px;
  
  ${({ $tone }) =>
        $tone === 'green' ? css`background: #e8f6ef; border:1px solid #c8ecd8;`
            : $tone === 'gray' ? css`background: #f1f3f5; border:1px solid #e9ecef;`
                : css`background: #fdecec; border:1px solid #fac0c0;`}
`;

const IconWrap = styled.div`
    margin: auto;
`;
const Title = styled.h1`font-size: 20px; color: ${({ theme }) => theme.colors.text_D}; margin: 10px 0 6px; `;
const Desc = styled.p` margin: 0; color: ${({ theme }) => theme.colors.text_D}; `;

const SummaryCard = styled.div`
  background: #fff; border: 1px solid #e9ecef; border-radius: 8px;
  padding: 12px; margin-top: 12px;
`;
const SummaryRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 8px 4px;
  &:not(:last-child){ border-bottom: 1px dashed #e9ecef; }
`;
const Label = styled.span` color: ${({ theme }) => theme.colors.text_D}; `;
const Value = styled.span` font-weight: 800; color: ${({ theme }) => theme.colors.text_D} `;
const Mono = styled.code`
font-family: ${({ theme }) => theme.font.primary};
  color:  ${({ theme }) => theme.colors.text_D};
`;

const Section = styled.div`
    margin-top: 16px;
`;
const SectionTitle = styled.h2`
    font-size: 16px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text_D};
    margin: 0 0 8px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  border-radius:14px;
    `;


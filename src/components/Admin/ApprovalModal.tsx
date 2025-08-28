import React from 'react';
import styled from 'styled-components';
import type { InstructorRequest } from '../../types/InstructorRequest';
import Button from '../Common/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.background_Overlay};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: ${({ theme }) => theme.zIndex.overlay};
`;

const ModalWrapper = styled.div`
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 15px ${({ theme }) => theme.shadow.md};
    padding: 24px;
    width: ${({ theme }) => theme.size.modal};
    max-width: 90%;
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray_L};
    padding-bottom: 16px;
    margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 24px;
    color: ${({ theme }) => theme.colors.background_D};
    font-weight: 700;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize.title.max};
    color: ${({ theme }) => theme.colors.gray_M};
    transition: ${({ theme }) => theme.transition.fast};
    &:hover {
        color: ${({ theme }) => theme.colors.background_D};
    }
`;

const ModalBody = styled.div`
    text-align: center;
    padding: 10px 0;
`;

const ModalText = styled.p`
    font-size: ${({ theme }) => theme.fontSize.modal.max};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_D}
    margin-bottom: 8px;
`;

const ModalSubText = styled.p`
    font-size: ${({ theme }) => theme.fontSize.modal.min};
    color: ${({ theme }) => theme.colors.text_D};
    margin: 0;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
`;

const ApprovalModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <Overlay>
            <ModalWrapper>
                <ModalHeader>
                    <ModalTitle>강사 승인</ModalTitle>
                    <CloseButton onClick={onClose}>
                        &times;
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <ModalText>정말 이 사용자의 신청을 승인하시겠습니까?</ModalText>
                    <ModalSubText>승인 후에는 되돌릴 수 없으니 신중하게 결정해주세요.</ModalSubText>
                </ModalBody>
                <ModalFooter>
                    <Button
                        text="취소"
                        onClick={onClose}
                        type='button'
                        design={3}
                        fontColor={2}
                        fontWeight={400}
                    />
                    <Button
                        text="확인"
                        onClick={() => onConfirm()}
                        type='button'
                        design={3}
                        fontColor={2}
                        fontWeight={400}
                    />
                </ModalFooter>
            </ModalWrapper>
        </Overlay>
    );
};


export default ApprovalModal
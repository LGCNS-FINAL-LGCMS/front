import styled from 'styled-components';
import React from 'react';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 20, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 24px;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  max-width: min(900px, 92vw);
  max-height: min(900px, 92vh);

  background: #ffffff;

  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  overflow: hidden;
`;

const ModalImage = styled.img`
  display: block;

  width: auto;
  height: auto;
  max-width: min(900px, 100vw);
  max-height: min(900px, 100vh);

  object-fit: contain;

  opacity: 1;
  filter: none;
  mix-blend-mode: normal;
  background: transparent;
`;


type ImagePreviewModalProps = {
    src: string;
    alt?: string;
    onClose: () => void;
};

export function ImagePreviewModal({ src, alt = '확대 이미지', onClose }: ImagePreviewModalProps) {
    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <ModalOverlay role="dialog" onClick={onBackdropClick}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalImage src={src} alt={alt} />
            </ModalContent>
        </ModalOverlay>
    );
}
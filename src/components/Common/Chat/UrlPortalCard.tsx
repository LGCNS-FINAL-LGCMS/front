import React from 'react';
import styled from 'styled-components';

interface UrlPortalCardProps {
  description: string;
  url: string;
}

const Card = styled.a`
  width: 180px; 
  height: 190px; 

  display: block;
  background: ${({ theme }) => theme.colors.background_B};
  border: 5px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  
  box-shadow: 0 4px 14px ${({ theme }) => theme.shadow.sm};
  transition: box-shadow .15s ease, transform .06s ease, border-color .15s ease;

  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.border_Dark}; outline-offset: 3px; }

  @keyframes pop {
    0% {  
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  transition: background-color 0.16s ease, transform 0.06s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`;

const ThumbWrap = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: ${({ theme }) => theme.colors.gray_M};

  /* Safari/Fallback */
  @supports not (aspect-ratio: 16 / 9) {
    height: 0;
    padding-top: 56.25%;
  }
`;

const ThumbImg = styled.img`
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
`;

const ThumbFallback = styled.div`
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background_B}; font-size: 28px; font-weight: 800;
  letter-spacing: .5px;
`;

const Content = styled.div`
  padding: 12px 12px 10px;
`;

const Title = styled.div`
  font-size: 15px; font-weight: 700; color: ${({ theme }) => theme.colors.background_D};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 6px;
`;

const Description = styled.div`
  font-size: 13px; color: ${({ theme }) => theme.colors.gray_D}; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px; color: ${({ theme }) => theme.colors.gray_M}; font-size: 12px;
`;

const Favicon = styled.img`
  width: 14px; height: 14px; border-radius: 3px; flex: 0 0 14px;
`;


const UrlPortalCard: React.FC<UrlPortalCardProps> = ({ description, url }) => {
  // URL이 유효한지 확인
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  if (!isValidUrl(url)) {
    // console.warn("유효하지 않은 URL:", url);
    return null; // 유효하지 않은 URL은 렌더링하지 않음
  }

  // URL이 유효하면 카드 형태로 렌더링
  return (
    <Card href={url} target="_blank" rel="noopener noreferrer">
      <ThumbWrap>
        <ThumbImg src={`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`} alt="Thumbnail" />
        <ThumbFallback>LGCMS</ThumbFallback>
      </ThumbWrap>
      <Content>
        <Title>LGCMS</Title>
        <Description>{description}</Description>
        <MetaRow>
          <Favicon src={`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`} alt="Favicon" />
          <span>{new URL(url).hostname}</span>
        </MetaRow>
      </Content>
    </Card>
  );
};




export default UrlPortalCard;
import ReactPlayer from 'react-player';
import styled from 'styled-components';

import type { JSX } from 'react'; // 컴포넌트 호출 땜에 불러오는 것

interface LessionViewerProps {
  url: string;
}

const PlayerWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const LessionViewer = ({ url }: LessionViewerProps): JSX.Element => {
  return (
    <PlayerWrapper>
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        controls
        playing={false}
      /> 
    </PlayerWrapper>
  );
};

export default LessionViewer;

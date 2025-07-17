import React from "react";
import LessionViewer from "../../components/Player/LessonViewer";

const LessionViewerPage = () => {

    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    return (
    <div>
      <LessionViewer url={url} />
    </div>
  );
};


export default LessionViewerPage;
import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment } from "@fortawesome/free-solid-svg-icons";
import type { Qna } from "../../types/qna";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { PAGE_PATHS } from "../../constants/pagePaths";
import {
  deleteQna,
  patchQna,
  postAnswer,
  putAnswer,
} from "../../api/Qna/qnaAPI";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  font-family: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.colors.text_D};
  background-color: ${({ theme }) => theme.colors.background_B};
  min-height: calc(100vh - ${({ theme }) => theme.size.header.height} - 50px);
`;

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const Header = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border_Light};
  padding-bottom: 20px;
  margin-bottom: 30px;
`;
const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text_D};
`;

const Meta = styled.p`
  font-size: ${({ theme }) => theme.fontSize.small.min};
  color: ${({ theme }) => theme.colors.gray_D};
  text-align: right;
  margin-bottom: 12px;
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.title.max};
  font-weight: 700;
  margin-bottom: 12px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 12px;
  outline: none;
  transition: 0.2s all;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
  }
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.body.max};
  line-height: 1.8;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border_Light};
  border-radius: 12px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: 0.2s all;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.body.max};
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.div`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  line-height: 1.8;
  margin-bottom: 50px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  border-radius: 30px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border: 1px solid #e0e0e0;
  margin: 0 auto 50px;
  transition: ${({ theme }) => theme.transition.default};

  &:focus-within {
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const AnswerInput = styled.input`
  flex-grow: 1;
  padding: 14px 20px;
  font-size: 16px;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  color: ${({ theme }) => theme.colors.text_D};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray_M};
  }
`;

const AnswerEditInput = styled.input`
  flex-grow: 1;
  padding: 6px;
  font-size: 16px;
  border: 2px solid ${({ theme }) => theme.colors.gray_M};
  outline: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background_B};
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  color: ${({ theme }) => theme.colors.text_D};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: 0.2s all;

  &:focus {
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray_M};
  }
`;

const SubmitButton = styled.button`
  width: 60px;
  background-color: ${({ theme }) => theme.colors.gray_M};
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray_D};
  }
`;

const AnswerSection = styled.section`
  width: 100%;
`;

const AnswerHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text_D};
`;

const AnswerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AnswerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background-color: ${({ theme }) => theme.colors.border_Light};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: ${({ theme }) => theme.fontSize.body.min};
`;

const NoAnswer = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body.min};
  color: ${({ theme }) => theme.colors.gray_M};
  text-align: center;
  padding: 20px 0;
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.background_Overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ConfirmModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background_B};
  padding: 32px 24px;
  border-radius: 16px;
  width: 420px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const ConfirmTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.subtitle};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_D};
  margin: 0;
`;

const ConfirmMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body.max};
  color: ${({ theme }) => theme.colors.gray_D};
  margin: 0;
  line-height: 1.5;
`;

const ButtonGroupModal = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const qnaInitial: Qna = {
  id: 2,
  title: "React 상태 관리 관련 질문",
  content: "Redux를 써야 할지, Recoil을 써야 할지 고민입니다.",
  answers: [
    {
      answerId: 1,
      content: "작은 프로젝트면 Recoil, 큰 프로젝트면 Redux 추천합니다.",
    },
    {
      answerId: 2,
      content: "작은 프로젝트면 Recoil, 큰 프로젝트면 Redux 추천합니다.",
    },
    {
      answerId: 3,
      content: "작은 프로젝트면 Recoil, 큰 프로젝트면 Redux 추천합니다.",
    },
  ],
};

const QnaDetailPage = () => {
  const navigate = useNavigate();

  const [qna, setQna] = useState<Qna>(qnaInitial);
  const [newAnswer, setNewAnswer] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(qna.title);
  const [editContent, setEditContent] = useState(qna.content);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "edit" | "editAnswer" | null
  >(null);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  const currentLecture = useSelector(
    (state: RootState) => state.currentLecture.lecture
  );
  const currentUserId = useSelector((state: RootState) => state.auth.memberId);
  const isAuthor = currentUserId === qna.id;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewAnswer(e.target.value);

  const handleAddAnswer = async (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!newAnswer.trim() || !currentLecture?.lectureId) return;

    try {
      const addedAnswer = await postAnswer({
        questionId: qna.id,
        lectureId: currentLecture.lectureId,
        content: newAnswer,
      });

      // 로컬 상태에 새 답변 추가
      setQna((prev) => ({
        ...prev,
        answers: [...prev.answers, addedAnswer],
      }));

      setNewAnswer("");
    } catch (error) {
      console.error("답변 등록 실패:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddAnswer(e);
  };

  const handleEditQuestion = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(qna.title);
    setEditContent(qna.content);
  };
  const handleSaveEdit = () => {
    setConfirmAction("edit");
    setShowConfirmModal(true);
  };

  const handleDeleteQuestion = () => {
    setConfirmAction("delete");
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleConfirm = async () => {
    try {
      if (confirmAction === "edit") {
        if (!qna?.id) throw new Error("수정할 질문 ID가 없습니다.");
        await patchQna({
          questionId: qna.id,
          title: editTitle,
          content: editContent,
        });
        setQna((prev) => ({ ...prev, title: editTitle, content: editContent }));
        setIsEditing(false);
      } else if (confirmAction === "delete") {
        if (!qna?.id) throw new Error("삭제할 질문 ID가 없습니다.");
        await deleteQna(qna.id);
        navigate(PAGE_PATHS.HOME);
      } else if (confirmAction === "editAnswer" && editingAnswerId !== null) {
        try {
          if (!currentLecture?.lectureId)
            throw new Error("강의 ID가 없습니다.");

          await putAnswer({
            answerId: editingAnswerId,
            lectureId: currentLecture.lectureId,
            content: editAnswerContent,
          });

          setQna((prev) => ({
            ...prev,
            answers: prev.answers.map((ans) =>
              ans.answerId === editingAnswerId
                ? { ...ans, content: editAnswerContent }
                : ans
            ),
          }));

          setEditingAnswerId(null);
          setEditAnswerContent("");
        } catch (error) {
          console.error("답변 수정 실패:", error);
        }
      }
    } catch (error) {
      console.error("Confirm action error:", error);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          {isEditing ? (
            <>
              <TitleInput
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <ContentTextarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <ButtonGroup>
                <TextButton onClick={handleSaveEdit}>저장</TextButton>
                <TextButton onClick={handleCancelEdit}>취소</TextButton>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Title>{qna.title}</Title>
              <Meta>작성일: 2025.08.19</Meta>
              <Content>{qna.content}</Content>

              {isAuthor && (
                <ButtonGroup>
                  <TextButton onClick={handleEditQuestion}>수정</TextButton>
                  <TextButton onClick={handleDeleteQuestion}>삭제</TextButton>
                </ButtonGroup>
              )}
            </>
          )}
        </Header>

        <InputContainer>
          <AnswerInput
            value={newAnswer}
            onChange={handleInputChange}
            placeholder="답변을 입력하세요"
            onKeyPress={handleKeyPress}
          />
          <SubmitButton onClick={handleAddAnswer}>
            <FontAwesomeIcon icon={faArrowRight} />
          </SubmitButton>
        </InputContainer>

        <AnswerSection>
          <AnswerHeader>
            <FontAwesomeIcon icon={faComment} /> {qna.answers.length}
          </AnswerHeader>
          {qna.answers.length > 0 ? (
            <AnswerList>
              {qna.answers.map((ans) => {
                const isAnswerAuthor = currentUserId === ans.answerId;
                const isEditingThisAnswer = editingAnswerId === ans.answerId;

                return (
                  <AnswerItem key={ans.answerId}>
                    {isEditingThisAnswer ? (
                      <>
                        <AnswerEditInput
                          value={editAnswerContent}
                          onChange={(e) => setEditAnswerContent(e.target.value)}
                        />
                        <ButtonGroup>
                          <TextButton
                            onClick={() => {
                              setConfirmAction("editAnswer");
                              setShowConfirmModal(true);
                            }}
                          >
                            확인
                          </TextButton>
                          <TextButton
                            onClick={() => {
                              setEditingAnswerId(null);
                              setEditAnswerContent("");
                            }}
                          >
                            취소
                          </TextButton>
                        </ButtonGroup>
                      </>
                    ) : (
                      <>
                        {ans.content}
                        {isAnswerAuthor && (
                          <TextButton
                            onClick={() => {
                              setEditingAnswerId(ans.answerId);
                              setEditAnswerContent(ans.content);
                            }}
                          >
                            수정
                          </TextButton>
                        )}
                      </>
                    )}
                  </AnswerItem>
                );
              })}
            </AnswerList>
          ) : (
            <NoAnswer>아직 답변이 없습니다.</NoAnswer>
          )}
        </AnswerSection>
      </Container>
      {showConfirmModal && (
        <ConfirmModal>
          <ConfirmModalContent>
            <ConfirmTitle>
              {confirmAction === "delete"
                ? "삭제하시겠습니까?"
                : "수정하시겠습니까?"}
            </ConfirmTitle>
            <ConfirmMessage>
              {confirmAction === "delete"
                ? "질문을 삭제하면 복구할 수 없습니다."
                : "수정 내용을 저장하시겠습니까?"}
            </ConfirmMessage>
            <ButtonGroupModal>
              <TextButton onClick={handleCancel}>취소</TextButton>
              <TextButton onClick={handleConfirm}>확인</TextButton>
            </ButtonGroupModal>
          </ConfirmModalContent>
        </ConfirmModal>
      )}
    </Wrapper>
  );
};

export default QnaDetailPage;

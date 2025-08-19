import { createSlice } from '@reduxjs/toolkit';

interface GuideBotState {
    status: 'idle' | 'sending' | 'success' | 'error';
}

// 기본적으로 전송상태가 아닙니다.
const initialState: GuideBotState = {
    status: 'idle',
};

const guideBotSlice = createSlice({
    name: 'guideBot',
    initialState,
    reducers: {
        setSending(state) {
            state.status = 'sending';
        },
        setSuccess(state) {
            state.status = 'success';
        },
        setError(state) {
            state.status = 'error';
        },
        setIdle(state) {
            state.status = 'idle';
        },
    },
});

export const { setSending, setSuccess, setError, setIdle } = guideBotSlice.actions;

export default guideBotSlice.reducer;
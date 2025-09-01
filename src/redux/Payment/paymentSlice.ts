import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
    paymentStatus:  'success' | 'pending'  | 'failure' | 'cancelled';
    totalAmount: number;
    paymentMethod: 'KakaoPay' | 'KB국민은행' | '우리은행' | '';
    transactionId: string | null;
}

const initialState: PaymentState = {
    paymentStatus: 'pending',
    totalAmount: 0,
    paymentMethod: '',
    transactionId: null,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPending(state) {
            state.paymentStatus = 'pending';
        },
        setSuccess(state) {
            state.paymentStatus = 'success';
        },
        setFailure(state) {
            state.paymentStatus = 'failure';
        },
        setCancelled(state) {
            state.paymentStatus = 'cancelled';
        },
        setPaymentInfo(state, action: PayloadAction<{ totalAmount: number; paymentMethod: 'KakaoPay' | 'KB국민은행' | '우리은행' | ''; transactionId: string }>) {
            state.totalAmount = action.payload.totalAmount;
            state.paymentMethod = action.payload.paymentMethod;
            state.transactionId = action.payload.transactionId;
        },
    },
});

// 결제페이지에서 총결제금액과 결제방법, 거래ID를 저장함

export const { setPending, setSuccess, setFailure, setCancelled, setPaymentInfo } = paymentSlice.actions;
export default paymentSlice.reducer;
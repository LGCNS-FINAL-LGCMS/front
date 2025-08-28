import React, { useEffect } from 'react';

const PaymentFail: React.FC = () => {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage({ type: 'fail' }, '*');
        }
        window.close();

    }, []);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>결제 처리 실패...</h1>
            <p> 이 창은 잠시 후 자동으로 닫힙니다.</p>
        </div>
    );
};

export default PaymentFail;
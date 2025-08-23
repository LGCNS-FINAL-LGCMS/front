import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';



const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const pgToken = searchParams.get('pg_token');

    useEffect(() => {
        if (pgToken) {
            if (window.opener) {
                window.opener.postMessage({ type: 'paymentSuccess', pg_token: pgToken }, '*');
            }
        }

        // Attempt to close the window
        window.close();

    }, [pgToken]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>결제 처리 중...</h1>
            <p>결제 정보가 전달되고 있습니다. 이 창은 잠시 후 자동으로 닫힙니다.</p>
        </div>
    );
};

export default PaymentSuccess;
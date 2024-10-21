import React, { Suspense, useMemo } from 'react';
const LoginForm = React.lazy(() => import('../component/Login/LoginForm'));

const LoginPage = () => {
    const loginForm = useMemo(() => <LoginForm />, []);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {loginForm}
        </Suspense>
    );
};

export default LoginPage;

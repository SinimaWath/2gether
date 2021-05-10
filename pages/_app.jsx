import '../styles/globals.css';
import 'antd/dist/antd.css';
import { Provider } from 'next-auth/client';
import React from 'react';
import { wrapper } from '../src/features/app/store/store';

function MyApp({ Component, pageProps }) {
    return (
        <Provider session={pageProps.session}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default wrapper.withRedux(MyApp);

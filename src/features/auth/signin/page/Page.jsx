import { getProviders, getSession, signIn } from 'next-auth/client';

import styles from './index.module.css';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

export function SignIn({ providers }) {
    return (
        <div className={styles.layout}>
            <div className={styles.signin}>
                <h1>Sign In</h1>
                {Object.values(providers).map((provider) => (
                    <div key={provider.name} className={provider.name}>
                        <Button
                            onClick={() => signIn(provider.id)}
                            size={'large'}
                            block
                        >
                            <GoogleOutlined />
                            With Google
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

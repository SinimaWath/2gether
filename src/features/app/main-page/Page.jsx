import { CreateListButton } from '../../list/create-list/CreateListButton';
import { useDispatch } from 'react-redux';

export const MainAppPage = ({ lists }) => {
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                <h2>Ваши списки</h2>
                <CreateListButton />
            </div>
        </div>
    );
};

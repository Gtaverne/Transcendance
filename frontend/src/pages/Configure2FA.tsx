import { useEffect } from 'react';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { edit, reset } from '../features/auth/authSlice';

type Props = {};

function Configure2FA({}: Props) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const dispatch = useDispatch();

  //   useEffect(() => {

  //   }, []);

  const onBlock = () => {
    dispatch(reset);
    dispatch(edit({ id: user.id, field: 'doublefa', value: user.doublefa + 1 }));
  };

  return (
    <>
      <div>Configure2FA</div>
      <button className="largeButton" onClick={onBlock}>
        2FA Google
      </button>
    </>
  );
}

export default Configure2FA;

import useInput from '@hooks/useInput';
import React, { useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from './styles';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const Signup = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const onChange = useCallback(
    (e) => {
      const {
        target: { value, name },
      } = e;
      if (name === 'password') {
        setPassword(value);
        setMismatchError(value !== passwordCheck);
      } else if (name === 'passwordCheck') {
        setPasswordCheck(value);
        setMismatchError(value !== password);
      }
    },
    [password, passwordCheck],
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError && nickname) {
        setSignupError(false);
        setSignupSuccess(false);
        axios
          .post('api/users', {
            email,
            nickname,
            password,
          })
          .then((response) => {
            console.log(response);
            setSignupSuccess(true);
          })
          .catch((error) => {
            console.log(error.response);
            setSignupError(true);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck],
  );

  if (data) {
    return <Navigate to="/workspace/channel" />;
  }
  return (
    <div>
      <Header>Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label>
          <span>이메일주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label>
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label>
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChange} />
          </div>
        </Label>
        <Label>
          <span>비밀번호 확인</span>
          <div>
            <Input type="password" id="passwordCheck" name="passwordCheck" value={passwordCheck} onChange={onChange} />
          </div>
        </Label>
        <Error>{mismatchError && '비밀번호가 일치하지 않습니다.'}</Error>
        <Error>{!nickname && '닉네임을 입력해주세요.'}</Error>
        <Error>{signupError && '회원가입 오류입니다.'}</Error>
        <Success>{signupSuccess && '회원가입에 성공하였습니다.'}</Success>
        <Button>회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;<Link to="/login">로그인 하기</Link>
      </LinkContainer>
    </div>
  );
};

export default Signup;

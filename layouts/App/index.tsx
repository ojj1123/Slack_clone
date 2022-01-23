import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router';
import loadable from '@loadable/component';

// 1. page 단위 별로
// 2. 서버사이드렌더링이 필요 없는 컴포넌트 위주로 코드 스플리팅
const Login = loadable(() => import('@pages/Login'));
const Signup = loadable(() => import('@pages/Signup'));
const WorkSpace = loadable(() => import('@layouts/Workspace'));
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/workspace/:workspace" element={<WorkSpace />}>
        <Route path="channel/:channel" element={<Channel />} />
        <Route path="dm/:id" element={<DirectMessage />} />
      </Route>
      <Route path="*" element={<div>Not Found.</div>} />
    </Routes>
  );
};

export default App;

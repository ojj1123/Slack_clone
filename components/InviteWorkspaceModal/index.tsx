import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/Signup/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteMemberModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteMemberModal }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace } = useParams();

  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, { dedupingInterval: 2000 });
  const { data: channelData, mutate: mutateMember } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;

      axios
        .post(`/api/workspaces/${workspace}/members`, { email: newMember })
        .then(() => {
          setNewMember('');
          setShowInviteMemberModal(false);
          mutateMember();
        })
        .catch(() => {
          console.dir(error);
          toast.error(error.response?.data, {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    },
    [workspace, newMember],
  );
  return (
    <>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>이메일</span>
            <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default InviteWorkspaceModal;

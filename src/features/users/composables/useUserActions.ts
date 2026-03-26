import { ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { userStore } from '../user.store';
import type { User } from '../user.type';
import type { UserBody } from '../user.api';

export type UserRecord = User;

interface UseUserActionsOptions {
  store: ReturnType<typeof userStore>;
  fetchUsers: () => Promise<void>;
}

export function useUserActions({ store, fetchUsers }: UseUserActionsOptions) {
  const modalLoading = ref(false);
  const isModalOpen = ref(false);
  const editingUser = ref<User | null>(null);

  const handleAdd = () => {
    editingUser.value = null;
    isModalOpen.value = true;
  };

  const handleModalSubmit = async (values: UserBody) => {
    modalLoading.value = true;

    try {
      let response;
      let finalPayload: UserBody | Omit<UserBody, 'password'> = { ...values };

      if (editingUser.value && !values.password) {
        const { password, ...rest } = values;
        finalPayload = rest;
      }

      if (editingUser.value) {
        response = await store.updateUser(editingUser.value.id, finalPayload as UserBody);
      } else {
        response = await store.createUser(finalPayload as UserBody);
      }

      if (response.success) {
        message.success(response.message || `User ${editingUser.value ? 'updated' : 'created'} successfully`);
        isModalOpen.value = false;
        editingUser.value = null;
        await fetchUsers();
      }
    } catch (error: any) {
      message.error(error.message || `Failed to ${editingUser.value ? 'update' : 'create'} user`);
    } finally {
      modalLoading.value = false;
    }
  };

  const handleModalCancel = () => {
    isModalOpen.value = false;
    editingUser.value = null;
  };

  const handleEdit = (record: UserRecord) => {
    editingUser.value = record;
    isModalOpen.value = true;
  };

  const handleDelete = (record: UserRecord) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: `User "${record.fullName}" will be permanently removed. This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      async onOk() {
        try {
          await store.deleteUser(record.id);
          message.success('User deleted successfully');
          await fetchUsers();
        } catch (error: any) {
          message.error(error.message || 'Failed to delete user');
        }
      },
    });
  };

  return {
    modalLoading,
    isModalOpen,
    editingUser,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  };
}

import { ref } from 'vue';
import type { petStore } from '../pet.store';
import type { Pet } from '../pet.type';
import type { PetBody } from '../pet.api';
import { message, Modal } from 'ant-design-vue';

interface UsePetActionsOptions {
  store: ReturnType<typeof petStore>;
  fetchPets: () => Promise<void>;
}

export function usePetActions({ store, fetchPets }: UsePetActionsOptions) {
  const modalLoading = ref(false);
  const isModalOpen = ref(false);
  const editingPet = ref<Pet | null>(null);

  const handleAdd = () => {
    editingPet.value = null;
    isModalOpen.value = true;
  };

  const handleModalSubmit = async (values: PetBody) => {
    modalLoading.value = true;

    try {
      let response;
      let finalPayload: PetBody = { ...values };

      if (editingPet.value) {
        const { ...rest } = values;
        finalPayload = rest;
      }

      if (editingPet.value) {
        response = await store.updatePet(editingPet.value.id, finalPayload as PetBody);
      } else {
        response = await store.createPet(finalPayload as PetBody);
      }

      if (response?.success) {
        message.success(response.message || `Pet ${editingPet.value ? 'updated' : 'created'} successfully`);
        isModalOpen.value = false;
        editingPet.value = null;
        await fetchPets();
      }
    } catch (error: any) {
      message.error(error.message || `Failed to ${editingPet.value ? 'update' : 'create'} pet`);
    } finally {
      modalLoading.value = false;
    }
  };

  const handleModalCancel = () => {
    isModalOpen.value = false;
    editingPet.value = null;
  };

  const handleEdit = (record: Pet) => {
    editingPet.value = record;
    isModalOpen.value = true;
  };

  const handleDelete = (record: Pet) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this pet?',
      content: `Pet "${record.name}" will be permanently removed. This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      async onOk() {
        try {
          await store.deletePet(record.id);
          message.success('Pet deleted successfully');
          await fetchPets();
        } catch (error: any) {
          message.error(error.message || 'Failed to delete pet');
        }
      },
    });
  };

  return {
    modalLoading,
    isModalOpen,
    editingPet,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  };
}

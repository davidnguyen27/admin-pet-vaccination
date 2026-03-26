import { ref } from 'vue';
import type { vaccineStore } from '../vaccine.store';
import type { Vaccine } from '../vaccine.type';
import { message, Modal } from 'ant-design-vue';
import type { VaccineBody } from '../vaccine.api';

interface UseVaccineActionsOptions {
  store: ReturnType<typeof vaccineStore>;
  fetchVaccines: () => Promise<void>;
}

export function useVaccineActions({ store, fetchVaccines }: UseVaccineActionsOptions) {
  const modalLoading = ref(false);
  const isModalOpen = ref(false);
  const editingVaccine = ref<Vaccine | null>(null);

  const handleAdd = () => {
    editingVaccine.value = null;
    isModalOpen.value = true;
  };

  const handleModalSubmit = async (values: VaccineBody) => {
    modalLoading.value = true;

    try {
      let response;
      let finalPayload: VaccineBody = { ...values };

      if (editingVaccine.value) {
        const { ...rest } = values;
        finalPayload = rest;
      }

      if (editingVaccine.value) {
        response = await store.updateVaccine(editingVaccine.value.id, finalPayload as VaccineBody);
      } else {
        response = await store.createVaccine(finalPayload as VaccineBody);
      }

      if (response?.success) {
        message.success(response.message || `Vaccine ${editingVaccine.value ? 'updated' : 'created'} successfully`);
        isModalOpen.value = false;
        editingVaccine.value = null;
        await fetchVaccines();
      }
    } catch (error: any) {
      message.error(error.message || `Failed to ${editingVaccine.value ? 'update' : 'create'} vaccine`);
    } finally {
      modalLoading.value = false;
    }
  };

  const handleModalCancel = () => {
    isModalOpen.value = false;
    editingVaccine.value = null;
  };

  const handleEdit = (record: Vaccine) => {
    editingVaccine.value = record;
    isModalOpen.value = true;
  };

  const handleDelete = (record: Vaccine) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this vaccine?',
      content: `Vaccine "${record.name}" will be permanently removed. This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      async onOk() {
        try {
          await store.deleteVaccine(record.id);
          message.success('Vaccine deleted successfully');
          await fetchVaccines();
        } catch (error: any) {
          message.error(error.message || 'Failed to delete vaccine');
        }
      },
    });
  };

  return {
    modalLoading,
    isModalOpen,
    editingVaccine,
    handleAdd,
    handleModalSubmit,
    handleModalCancel,
    handleEdit,
    handleDelete,
  };
}

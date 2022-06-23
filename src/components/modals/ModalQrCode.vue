<template>
  <ModalContainer :title="$t('modals.modalQRCode.title')">
    <div class="modal__qrcode">
      <div class="qrcode"><QrCode /></div>
    </div>
  </ModalContainer>
</template>

<script>
import ModalContainer from "@/components/modals/ModalContainer";
import QrCode from "@/components/ui/QrCode";

export default {
  name: "ModalQrCode",
  components: {
    ModalContainer,
    QrCode,
  },
};
</script>

<style lang="scss" scoped>
.modal__qrcode {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  .qrcode {
    width: 300px;
  }
}
</style>

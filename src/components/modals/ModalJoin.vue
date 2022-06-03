<template>
  <transition name="fade">
    <ModalContainer
      :title="$t('setup.modalJoin.title')"
      btnLabel="Ok"
      :btnAction="() => setShowModalJoin(false)"
    >
      <div class="modal__join">
        <p v-html="$t('setup.modalJoin.description')" />
        <div class="connection">
          <div class="connection__code">
            <CopyCode :code="roomId" />
          </div>
          <span>{{ $t("setup.modalJoin.or") }}</span>
          <div class="connection__qrcode">
            <div class="connection__qrcode_inner"><QrCode /></div>
          </div>
        </div>
      </div>
    </ModalContainer>
  </transition>
</template>

<script>
import ModalContainer from "@/components/modals/ModalContainer";
import CopyCode from "@/components/CopyCode";
import QrCode from "@/components/QrCode";

export default {
  name: "ModalJoin",
  components: {
    ModalContainer,
    CopyCode,
    QrCode,
  },
  props: {
    roomId: { type: String, required: true },
    setShowModalJoin: { type: Function },
  },
};
</script>

<style lang="scss" scoped>
.modal__join {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  p {
    max-width: 560px;
    text-align: center;
    font-size: $ft-s-medium;
  }
  .connection {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    .connection__code,
    .connection__qrcode {
      min-width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0px 0px 16px rgba(222, 197, 204, 0.8);
      border-radius: 4px;
      padding: 50px;
      .qrcode_inner {
        width: 100px;
      }
    }
    span {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: $ft-s-small;
      font-weight: $ft-w-bold;
    }
  }
}
</style>

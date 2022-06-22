<template>
  <ModalContainer
    :title="$t('modals.modalJoin.title')"
    :btnLabel="$t('modals.modalJoin.btnLabel')"
  >
    <div class="modal__join">
      <p>
        {{ $t("modals.modalJoin.description1") }}
        <strong>{{ $t("modals.modalJoin.description2") }}</strong>
        {{ $t("modals.modalJoin.description3") }}
        <strong>{{ $t("modals.modalJoin.description4") }}</strong>
        {{ $t("modals.modalJoin.description5") }}
      </p>
      <div class="connection">
        <div class="connection__code">
          <CopyCode :code="roomId" />
        </div>
        <span>{{ $t("modals.modalJoin.or") }}</span>
        <div class="connection__qrcode">
          <div class="connection__qrcode_inner"><QrCode /></div>
        </div>
      </div>
    </div>
  </ModalContainer>
</template>

<script>
import ModalContainer from "@/components/modals/ModalContainer";
import CopyCode from "@/components/ui/CopyCode";
import QrCode from "@/components/ui/QrCode";

export default {
  name: "ModalJoin",
  components: {
    ModalContainer,
    CopyCode,
    QrCode,
  },
  props: {
    roomId: { type: String, required: true },
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
    max-width: 520px;
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
      width: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0px 0px 16px rgba(222, 197, 204, 0.8);
      border-radius: 4px;
      padding: 40px 50px;
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

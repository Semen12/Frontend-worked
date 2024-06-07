import { defineStore } from 'pinia'

export const useMasterPasswordStore = defineStore('masterPassword', {
    state: () => ({
      isVerified: false,
      verifiedAt: null
    }),
    getters: {
      checkMasterPasswordStatus: (state) => {
        if (!state.isVerified || !state.verifiedAt) return false;
        const expirationTime = new Date(state.verifiedAt);
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);
        return new Date() < expirationTime;
      }
    },
    actions: {
      setMasterPassword(status, timestamp) {
        this.isVerified = status;
        this.verifiedAt = timestamp;
      },
      clearMasterPassword() {
        this.isVerified = false;
        this.verifiedAt = null;
      }
    }
  });
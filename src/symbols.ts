import type { InjectionKey, Ref } from 'vue'

export const isOpenSettingsKey: InjectionKey<Ref<boolean>> =
  Symbol('isOpenSettings')

export const setIsOpenSettingsKey: InjectionKey<() => void> =
  Symbol('setIsOpenSettings')

import { atom } from 'jotai'

type ToastState = {
  isOpen: boolean
  title: string
  description: string
  type: 'info' | 'error' | 'warning' | 'success' | null
}

type ToastParams = {
  title: string
  description?: string
  type: 'info' | 'error' | 'warning' | 'success' | null
}

const toastAtom = atom<ToastState>({
  isOpen: false,
  title: '',
  description: '',
  type: null,
})

export { toastAtom }
export type { ToastState, ToastParams }

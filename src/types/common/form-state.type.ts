export type FormState = {
  success: boolean
  message: string
  errors?: Record<string, string[] | undefined>
  avatar?: string
}

export const formInitialState: FormState = {
  success: false,
  message: ''
}

export type WrittenAction =
  | {
      type: 'write'
      path: string
      content?: string
    }
  | {
      type: 'edit'
      path: string
      old_string?: string
      new_string?: string
    }
  | {
      type: 'bash'
      command: string
    }

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useUpdatePassMutate } from '@/hooks/use-user'
import { Eye, EyeOff, Loader, Loader2 } from 'lucide-react'

type UpdatePassForm = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

type Props = {
  updateShowPass: () => void
}

function UpdatePass({ updateShowPass }: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<UpdatePassForm>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { mutate, isPending } = useUpdatePassMutate()

  const [showPass1, setShowPass1] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [showPass3, setShowPass3] = useState(false)

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter((prev) => !prev)

  const onSubmit = (data: UpdatePassForm) => {
    const { oldPassword, newPassword } = data
    mutate(
      { oldPassword, newPassword },
      {
        onSuccess: updateShowPass,
      }
    )
  }

  const newPasswordValue = watch('newPassword')

  const inputClasses =
    'px-4 py-3.5 text-sm text-foreground bg-input border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring'

  const labelClasses = 'mb-2 block text-sm font-medium text-muted-foreground'
  const errorClasses = 'mt-1 text-sm text-destructive'

  return (
    <div className='min-h-[1px]'>
      {/* Current Password */}
      <div className='mb-5'>
        <label className={labelClasses}>Current Password</label>
        <div className='relative'>
          <Controller
            control={control}
            name='oldPassword'
            rules={{ required: 'Current password is required' }}
            render={({ field }) => (
              <input
                type={showPass1 ? 'text' : 'password'}
                className={inputClasses}
                value={field.value}
                onChange={field.onChange}
                placeholder='Enter current password'
              />
            )}
          />
          <button
            type='button'
            onClick={toggle(setShowPass1)}
            className='absolute top-3.5 right-4 text-muted-foreground'>
            {showPass1 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.oldPassword && <p className={errorClasses}>{errors.oldPassword.message}</p>}
      </div>

      {/* New Password */}
      <div className='mb-5'>
        <label className={labelClasses}>New Password</label>
        <div className='relative'>
          <Controller
            control={control}
            name='newPassword'
            rules={{ required: 'New password is required' }}
            render={({ field }) => (
              <input
                type={showPass2 ? 'text' : 'password'}
                className={inputClasses}
                value={field.value}
                onChange={field.onChange}
                placeholder='Enter new password'
              />
            )}
          />
          <button
            type='button'
            onClick={toggle(setShowPass2)}
            className='absolute top-3.5 right-4 text-muted-foreground'>
            {showPass2 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPassword && <p className={errorClasses}>{errors.newPassword.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className='mb-6'>
        <label className={labelClasses}>Confirm Password</label>
        <div className='relative'>
          <Controller
            control={control}
            name='confirmPassword'
            rules={{
              required: 'Confirm password is required',
              validate: (value) => value === newPasswordValue || 'Passwords do not match',
            }}
            render={({ field }) => (
              <input
                type={showPass3 ? 'text' : 'password'}
                className={inputClasses}
                value={field.value}
                onChange={field.onChange}
                placeholder='Re-enter new password'
              />
            )}
          />
          <button
            type='button'
            onClick={toggle(setShowPass3)}
            className='absolute top-3.5 right-4 text-muted-foreground'>
            {showPass3 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && <p className={errorClasses}>{errors.confirmPassword.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className='mt-4 flex items-center justify-end gap-3'>
        <button
          type='button'
          disabled={isPending}
          onClick={updateShowPass}
          className='px-4 py-2 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition border border-border'>
          Cancel
        </button>

        <button
          type='submit'
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
          className='px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center disabled:opacity-50'>
          {isPending && <Loader className='mr-2 h-4 w-4 animate-spin text-primary-foreground' />}
          Update
        </button>
      </div>
    </div>
  )
}

export default UpdatePass

import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Control } from 'react-hook-form'

// interface GitUploadFieldsProps {
//   control: Control<FormValues>
// }

// const GitUploadFields = ({ control }: GitUploadFieldsProps) => (
const GitUploadFields = ({ control }: any) => (
  <>
    <FormField
      control={control}
      name='github_username'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Github Username</FormLabel>
          <FormControl>
            <Input placeholder='username' {...field} />
          </FormControl>
          <FormDescription>The Github username of your Node.js application.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name='github_token'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Github Token</FormLabel>
          <FormControl>
            <Input placeholder='token' {...field} />
          </FormControl>
          <FormDescription>The Github token of your Node.js application.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name='repo_url'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Git Repository URL</FormLabel>
          <FormControl>
            <Input placeholder='https://github.com/username/repo.git' {...field} />
          </FormControl>
          <FormDescription>The Git repository URL of your Node.js application.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
)

export default GitUploadFields

const root = 'https://v3backend.nidum.ai/api'

export async function checkUserInNidum(email: string, password: string) {
  try {
    const response = await fetch(`${root}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const status = response.status
    const data = await response.json()

    return { status, data }
  } catch (error) {
    return { status: 500, data: { message: 'Internal error' } }
  }
}

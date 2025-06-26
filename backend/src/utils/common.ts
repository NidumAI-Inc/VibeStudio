export async function validateEmail(email: string): Promise<boolean> {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailValid = emailRegex.test(email);
  if (!emailValid) {
    console.log("Invalid email:", email);
  }
  return emailValid;
}

export function getStartOfCurrentMonth(date: string): string {
  const inputDate = new Date(date)
  const utcYear = inputDate.getUTCFullYear()
  const utcMonth = inputDate.getUTCMonth()

  const startOfMonthUTC = new Date(Date.UTC(utcYear, utcMonth, 1, 0, 0, 0, 0))

  return startOfMonthUTC.toISOString()
}

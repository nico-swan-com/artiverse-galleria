import { cookies } from 'next/headers'

export async function useIsMobileServer(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<boolean> {
  const userAgent = (await cookieStore).get('user-agent')?.value || ''
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent)
}

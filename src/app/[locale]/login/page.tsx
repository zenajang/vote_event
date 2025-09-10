import LoginClient from './LoginClient'

type Props = { params: Promise<{ locale: string }> } 

export default async function Page({ params }: Props) {
  await params; 
  return <LoginClient />
}

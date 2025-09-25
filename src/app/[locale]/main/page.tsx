import MainClient from "./MainClient";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <MainClient locale={locale} />;
}

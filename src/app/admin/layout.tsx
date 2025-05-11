export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Empty layout without header/footer for admin
  return (
    <>
      {children}
    </>
  )
}

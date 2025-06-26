import Nav from "./nav";

type props = {
  children: React.ReactNode
}
function HomeWrapper({ children }: props) {
  return (
    <div className="min-h-screen pb-8 bg-background">
      <Nav />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>
    </div>
  )
}

export default HomeWrapper
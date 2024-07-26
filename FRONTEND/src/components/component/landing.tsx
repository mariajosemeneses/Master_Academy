"use-client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Landing() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground">
        <div className="flex items-center justify-center">

          <span className="text-xl font-bold ml-2">Master Academy</span>
        </div>
        <p className="ml-4 text-sm text-primary-foreground/80">
          Un sistema de suscripción y creación de cursos en línea.
        </p>

      </header>
      <main className="flex-1">
        <section className="w-full bg-primary py-2">
          <div className="container px-4 md:px-6 text-center text-primary-foreground">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Aprende en línea con Master Academy
              </h1>
              <p className="max-w-[700px] mx-auto text-lg md:text-xl">
                Nuestra plataforma te ofrece una amplia variedad de cursos en línea, impartidos por expertos en sus
                respectivos campos.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="login"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Iniciar Sesion
                </Link>
                <Link
                  href="register"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-primary-foreground bg-primary px-8 text-sm font-medium shadow-sm transition-colors hover:bg-primary-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Suscribirse
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-2">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Lo que dicen nuestros estudiantes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Escucha las experiencias de quienes han confiado en nosotros para su formación.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              <Card className="bg-muted p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">Erick Villacis </p>
                    <p className="text-sm text-muted-foreground">Estudiante</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Master Academy. Los cursos son de alta calidad y los instructores son excelentes.
                </p>
              </Card>
              <Card className="bg-muted p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>LM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">Ivan Zambrano</p>
                    <p className="text-sm text-muted-foreground">Estudiante</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Master Academy los mejores Cursos.. ¡Altamente recomendado!
                </p>
              </Card>
              <Card className="bg-muted p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">Maria Jose Meneses </p>
                    <p className="text-sm text-muted-foreground">Estudiante</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Master Academy al alcance de tu mano y tiempo
                </p>
              </Card>
              <Card className="bg-muted p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">Anthony Macas</p>
                    <p className="text-sm text-muted-foreground">Estudiante</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Master Academy los mejores Cursos.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
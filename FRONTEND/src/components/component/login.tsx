"use client";
import React, { useState, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from 'next/navigation';

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberDevice, setRememberDevice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      email: username,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:8081/api/user/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token } = response.data;
      const jwt = require('jsonwebtoken');
      const decodedToken = jwt.decode(token);
      console.log(decodedToken)
      const rol = decodedToken.roles;
      const email = decodedToken.sub;

      const userResponse = await axios.get(`http://localhost:8081/api/user/search-by-email/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(userResponse.data)
      const { id } = userResponse.data;

      // Guardar en localStorage
      localStorage.setItem('credentials', JSON.stringify({ id, rol, token }));
      const storedUser = localStorage.getItem('credentials');
      console.log('Usuario autenticado:', storedUser);

      // Redirigir según el rol
      const { status } = userResponse.data;
      if (status == "REGISTRADO") {
        if (rol === 'ADMINISTRADOR') {
          router.push('/administrator');
        } else if (rol === 'CREADOR') {
          router.push('/course');
        } else if (rol === 'CONSUMIDOR') {
          router.push('/subscription');
        } else {
          console.error('Rol no reconocido:', rol);
          setError('Rol no reconocido. Intenta de nuevo.');
        }
      }
      else {
        alert("Usuario en espera de verificacion");
      }

    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">

            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>

              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div >
            <CardFooter className="flex items-center justify-between" >
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="underline" prefetch={false}>
            Registrar
          </Link>
        </div>
      </Card>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export function RegisterCourse() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status] = useState<string>("EN CONSTRUCCION");

  useEffect(() => {
    // Check if `localStorage` is available
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('credentials') || '{}');
      setStoredUser(user);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const courseData = {
      userId: storedUser.id,
      name,
      description,
      status,
    };

    try {
      const response = await axios.post('http://localhost:8083/api/course/create', courseData, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity
      });
      console.log(JSON.stringify(response.data));
      // Navigate to the courses page upon successful creation
      router.push("/course");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crear nuevo curso</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de Curso</label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción del curso</label>
            <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <Input type="text" value={status} readOnly />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Crear Curso</Button>
            <Button  type="button" variant="outline" onClick={() => router.push("/course")}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

"use client"

import React, { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import axios from "axios";

export function RegisterSubscription() {
  const [userId, setUserId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [courses, setCourses] = useState([]);
  const [subscriptionDate, setSubscriptionDate] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [storedUser, setStoredUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    // Check if `localStorage` is available
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('credentials') || '{}');
      setStoredUser(user);

      if (user.id) {
        setUserId(user.id);
      }
    }
  }, []);

  useEffect(() => {
    if (storedUser) {
      // Set subscription date
      const now = new Date();
      const isoDateString = now.toISOString();
      const formattedDate = isoDateString.slice(0, 19).replace("T", " ");
      setSubscriptionDate(formattedDate);

      // Fetch courses
      const fetchCourses = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/course/all');
          const activeCourses = response.data.filter((course: any) => course.status === "ACTIVO");
          setCourses(activeCourses);
        } catch (error) {
          console.error("Error fetching courses: ", error);
        }
      };

      fetchCourses();
    }
  }, [storedUser]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('credentials');
    }
    router.push('/login');
  }

  const handleGuardarSubs = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = JSON.stringify({
      userId,
      courseId,
      status: "SUSCRITO",
      subscriptionDate,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8082/api/subscription/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      router.push('/subscription');
    } catch (error: any) {
      console.error(error);
      alert("Error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crear Nueva Suscription</h1>
          <nav className="flex gap-4">
            <Button className="hover:underline" onClick={handleLogout}>Cerrar sesión</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        <form onSubmit={handleGuardarSubs} className="max-w-lg mx-auto space-y-6">

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="courseId">Curso</label>
            <Select value={courseId.toString()} onValueChange={(value) => setCourseId(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione cou" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="subscriptionDate">Fecha de Suscription</label>
            <Input
              id="subscriptionDate"
              type="text"
              value={subscriptionDate}
              readOnly
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/subscription")}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

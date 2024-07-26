"use client"

import { useState, useEffect, useMemo } from "react"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface Course {
  id: number;
  userId: number;
  name: string;
  description: string;
  status: string;
}

// Define possible statuses to avoid typos
const STATUS_ACTIVE = "ACTIVO";
const STATUS_INACTIVE = "INACTIVO";
const STATUS_IN_CONSTRUCTION = "EN CONSTRUCCION";

export function Course() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ key: string; order: string }>({ key: "id", order: "asc" });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Check if `localStorage` is available
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('credentials') || '{}');
      setStoredUser(user);
    }
  }, []);

  useEffect(() => {
    // Fetch user details
    if (storedUser) {

      const fetchUserDetails = async () => {
        try {
          console.log(storedUser.id, "\n", storedUser.token)
          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:8081/api/user/search/${storedUser.id}`,
            headers: {
              'Authorization': `Bearer ${storedUser.token}`
            }
          };

          const response = await axios.request(config);
          console.log(response.data)
          setCreatorName(response.data.name);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }

      fetchUserDetails();
    }
  }, [storedUser]);

  useEffect(() => {
    if (storedUser) {

      const fetchCourses = async () => {
        try {
          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:8080/api/course/searchCourses-by-user/${storedUser.id}`,
            headers: {}
          };

          const response = await axios.request(config);
          setCourses(response.data);
        } catch (error) {
          console.error(error);
        }

      }

      fetchCourses();
    }
  }, [storedUser]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const handleSort = (key: string) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === "asc" ? "desc" : "asc" })
    } else {
      setSort({ key, order: "asc" })
    }
  }

  const handleInputChange = (courseId: number, field: string, value: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === courseId ? { ...course, [field]: value } : course))
    );
  }

  const handleStatusChange = (courseId: number, newStatus: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === courseId ? { ...course, status: newStatus } : course))
    );
  }

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const searchValue = search.toLowerCase()
        return (
          course.id.toString().includes(searchValue) ||
          course.name.toLowerCase().includes(searchValue) ||
          course.description.toLowerCase().includes(searchValue) ||
          course.status.toLowerCase().includes(searchValue)
        )
      })
      .sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key as keyof Course] > b[sort.key as keyof Course] ? 1 : -1
        } else {
          return a[sort.key as keyof Course] < b[sort.key as keyof Course] ? 1 : -1
        }
      })
  }, [courses, search, sort])

  const handleSave = async (course: Course) => {

    const originalStatus = editingCourse?.status || course.status;

    const activeCount = courses.filter(c => c.status === STATUS_ACTIVE).length;
    if (course.status === STATUS_ACTIVE && activeCount > 2) {
      setErrorMessage("No se puede tener más de dos cursos en activo");

      setCourses(prevCourses => prevCourses.map(c => c.id === course.id ? { ...c, status: editingCourse?.status || originalStatus } : c));
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return;
    }

    const data = {
      id: course.id,
      name: course.name,
      description: course.description,
      status: course.status
    };
    console.log(data)

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://localhost:8083/api/course/update',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log('Course updated successfully:', response.data);
      setCourses(prevCourses => prevCourses.map(courseItem =>
        courseItem.id === response.data.id ? response.data : courseItem
      ));
      setEditingCourse(null);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }

  const handleDelete = async (courseId: number) => {
    try {
      await axios.delete(`http://localhost:8083/api/course/delete/${courseId}`, {
        headers: {}
      });
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('credentials');
    }
    router.push('/login');
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de cursos</h1>
          <h2 className="text-xl font-medium">
            {creatorName || "Desconocido"}
          </h2>
          <nav className="flex gap-4">
            <Button className="hover:underline" onClick={() => router.push('/course/register')}>Crear Curso</Button>
          </nav>
          <nav className="flex gap-4">
            <Button className="hover:underline" onClick={handleLogout}>Cerrar sesión</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mb-4 flex justify-between items-center">
          <Input placeholder="Search courses..." className="w-full max-w-md" value={search} onChange={handleSearch} />
          {showMessage && (
            <div className="bg-green-500 mb-4 flex justify-between items-center px-4 py-2 rounded shadow-lg">
              Cambio guardado
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-500 mb-4 flex justify-between items-center px-4 py-2 rounded shadow-lg">
              {errorMessage}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                  ID
                  {sort.key === "id" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  Nombre
                  {sort.key === "name" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  {sort.key === "status" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>

                  <TableCell>
                    <Input
                      value={course.name}
                      onChange={(e) => handleInputChange(course.id, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={course.description}
                      onChange={(e) => handleInputChange(course.id, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={course.status}
                      onValueChange={(newStatus) => handleStatusChange(course.id, newStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue>{course.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={STATUS_ACTIVE}>{STATUS_ACTIVE}</SelectItem>
                        <SelectItem value={STATUS_INACTIVE}>{STATUS_INACTIVE}</SelectItem>
                        <SelectItem value={STATUS_IN_CONSTRUCTION}>{STATUS_IN_CONSTRUCTION}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleSave(course)}>Guardar</Button>
                    <Button onClick={() => handleDelete(course.id)} className="ml-2" variant="destructive">Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

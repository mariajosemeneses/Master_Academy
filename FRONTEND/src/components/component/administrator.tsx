"use client"

import { useEffect, useState, useMemo } from "react"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

// Define a type for User
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export function Administrator() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<any>(null);

  console.log('Usuario autenticado:', storedUser);

  // Initialize state with the correct type
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<{ key: string; order: string }>({ key: "id", order: "asc" })
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  useEffect(() => {
    // Check if `localStorage` is available
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('credentials') || '{}');
      setStoredUser(user);
    }
  }, []);


  // Fetch the list of users on component mount
  useEffect(() => {
    if (storedUser) {

      const fetchUsers = async () => {
        try {
          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:8081/api/user/all',
            headers: {
              'Authorization': `Bearer ${storedUser.token}`
            }
          };

          const response = await axios.request(config);
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      }

      fetchUsers();
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

  const handleInputChange = (userId: number, field: string, value: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, [field]: value } : user))
    );
  }

  const handleStatusChange = (userId: number, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
  }

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const searchValue = search.toLowerCase()
        return (
          user.id.toString().includes(searchValue) ||
          user.name.toLowerCase().includes(searchValue) ||
          user.email.toLowerCase().includes(searchValue) ||
          user.role.toLowerCase().includes(searchValue) ||
          user.status.toLowerCase().includes(searchValue)
        )
      })
      .sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key as keyof User] > b[sort.key as keyof User] ? 1 : -1
        } else {
          return a[sort.key as keyof User] < b[sort.key as keyof User] ? 1 : -1
        }
      })
  }, [users, search, sort])

  const handleSave = async (user: User) => {
    // No need to stringify the user object here
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    console.log(data);

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://localhost:8081/api/user/update',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedUser.token}`
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log('User updated successfully:', response.data);
      // Optionally, you can update the state with the updated user data
      setUsers(prevUsers => prevUsers.map(userItem =>
        userItem.id === response.data.id ? response.data : userItem
      ));
      setEditingUser(null);

      // Show the success message
      setShowMessage(true);

      // Hide the message after 2 seconds
      setTimeout(() => setShowMessage(false), 2000);

    } catch (error) {
      console.error('Error updating user:', error);
    }
  }



  const handleDelete = async (userId: number) => {
    // Logic to handle delete event
    // Example delete request
    try {
      await axios.delete(`http://localhost:8081/api/user/delete/${userId}`, {
        headers: {
          'Authorization': `Bearer ${storedUser.token}`
        }
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
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
          <h1 className="text-2xl font-bold">ADMINISTRADOR</h1>
          <nav className="flex gap-4">
            <Button className="hover:underline" onClick={handleLogout}>Cerrar sesión</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mb-4 flex justify-between items-center">
          <Input placeholder="Buscar usuarios..." className="w-full max-w-md" value={search} onChange={handleSearch} />
          {showMessage && (
            <div className="bg-[#20c551] mb-4 flex justify-between items-center bg-green-500 px-4 py-2 rounded shadow-lg">
              Cambio realizado
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
                <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                  Email
                  {sort.key === "email" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
                  Rol
                  {sort.key === "role" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  {sort.key === "status" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Input
                      value={user.name}
                      onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={user.email}
                      onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleInputChange(user.id, 'role', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMINISTRADOR">ADMINISTRADOR</SelectItem>
                        <SelectItem value="CREADOR">CREADOR</SelectItem>
                        <SelectItem value="CONSUMIDOR">CONSUMIDOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(value) => handleStatusChange(user.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REGISTRADO">REGISTRADO</SelectItem>
                        <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(user)}>
                        GUARDAR
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                        ELIMINAR
                      </Button>
                    </div>
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

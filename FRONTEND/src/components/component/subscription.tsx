"use client"

import { useState, useEffect, useMemo } from "react"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

// Define possible statuses to avoid typos
const STATUS_SUSCRITO = "SUSCRITO";
const STATUS_EN_CURSO = "EN CURSO";
const STATUS_FINALIZADO = "FINALIZADO";
const STATUS_CANCELADO = "CANCELADO";

interface Subscription {
  id: number;
  userId: number;
  courseId: number;
  courseName: string; // Añadido para mostrar courseName visualmente
  status: string;
  subscriptionDate: string;
  creatorId: number; // Añadido como extra
  statusCount: number; // Añadido como extra
}

export function Subscription() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ key: string; order: string }>({ key: "id", order: "asc" });
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
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

      const fetchSubscriptions = async () => {
        try {
          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:8080/api/subscription/search-subscription-with-course-by-user/${storedUser.id}`,
            headers: {}
          };

          const response = await axios.request(config);
          console.log(response.data)
          setSubscriptions(response.data);
          console.log(response.data)
        } catch (error) {
          console.error(error);
        }
      }
      fetchSubscriptions();
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

  const handleInputChange = (subscriptionId: number, field: string, value: string) => {
    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.map((subscription) => (subscription.id === subscriptionId ? { ...subscription, [field]: value } : subscription))
    );
  }

  const handleStatusChange = (subscriptionId: number, newStatus: string) => {
    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.map((subscription) => (subscription.id === subscriptionId ? { ...subscription, status: newStatus } : subscription))
    );
  }

  const filteredSubscriptions = useMemo(() => {
    return subscriptions
      .filter((subscription) => {
        const searchValue = search.toLowerCase()
        return (
          subscription.id.toString().includes(searchValue) ||
          subscription.userId.toString().includes(searchValue) ||
          subscription.courseId.toString().includes(searchValue) ||
          subscription.courseName.toString().includes(searchValue) ||
          subscription.status.toLowerCase().includes(searchValue) ||
          subscription.subscriptionDate.includes(searchValue) ||
          subscription.creatorId.toString().includes(searchValue) ||
          subscription.statusCount.toString().includes(searchValue)
        )
      })
      .sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key as keyof Subscription] > b[sort.key as keyof Subscription] ? 1 : -1
        } else {
          return a[sort.key as keyof Subscription] < b[sort.key as keyof Subscription] ? 1 : -1
        }
      })
  }, [subscriptions, search, sort])

  const handleSave = async (subscription: Subscription) => {
    // Get all courses

    try {
      if (subscription.status === STATUS_EN_CURSO && subscription.statusCount > 1) {
        setErrorMessage("No se puede tener más de una suscripción 'EN CURSO' para el mismo usuario.");
        setSubscriptions(prevSubscriptions => prevSubscriptions.map(s => s.id === subscription.id ? { ...s, status: editingSubscription?.status || STATUS_SUSCRITO } : s));

        setTimeout(() => {
          window.location.reload();
        }, 2000);

        return;
      }

      // Proceed with saving the subscription
      const data = {
        id: subscription.id,
        userId: subscription.userId,
        courseId: subscription.courseId,
        status: subscription.status,
        subscriptionDate: subscription.subscriptionDate
      };
      console.log(data);

      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: 'http://localhost:8082/api/subscription/update',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios.request(config);
      console.log('Subscription updated successfully:', response.data);
      setSubscriptions(prevSubscriptions => prevSubscriptions.map(subscriptionItem =>
        subscriptionItem.id === subscription.id ? { ...subscriptionItem, ...response.data } : subscriptionItem
      ));
      setEditingSubscription(null);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  }


  const handleDelete = async (subscriptionId: number) => {
    try {
      await axios.delete(`http://localhost:8082/api/subscription/delete/${subscriptionId}`, {
        headers: {}
      });
      setSubscriptions(subscriptions.filter(subscription => subscription.id !== subscriptionId));
    } catch (error) {
      console.error('Error deleting subscription:', error);
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
          <h1 className="text-2xl font-bold">Bienvenido Consumidor</h1>
          <h2 className="text-xl font-medium">
            {creatorName || "Desconocido"}
          </h2>
          <nav className="flex gap-4">
            <Button className="hover:underline" onClick={() => router.push('/subscription/register')}>Crear Suscripcion</Button>
          </nav>
          <nav className="flex gap-4">
            <Button className="hover:underline" onClick={handleLogout}>Cerrar sesión</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mb-4 flex justify-between items-center">
          <Input placeholder="Search subscriptions..." className="w-full max-w-md" value={search} onChange={handleSearch} />
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
                <TableHead className="cursor-pointer" onClick={() => handleSort("userId")}>
                  User ID
                  {sort.key === "userId" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("courseId")}>
                  Curso ID
                  {sort.key === "courseId" && (
                    <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  {sort.key === "status" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("subscriptionDate")}>
                  Subscription Date
                  {sort.key === "subscriptionDate" && (
                    <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>{subscription.id}</TableCell>
                  <TableCell>{subscription.userId}</TableCell>
                  <TableCell>{subscription.courseName}</TableCell>
                  <TableCell>
                    <Select
                      value={subscription.status}
                      onValueChange={(newStatus) => handleStatusChange(subscription.id, newStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue>{subscription.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={STATUS_SUSCRITO}>{STATUS_SUSCRITO}</SelectItem>
                        <SelectItem value={STATUS_EN_CURSO}>{STATUS_EN_CURSO}</SelectItem>
                        <SelectItem value={STATUS_FINALIZADO}>{STATUS_FINALIZADO}</SelectItem>
                        <SelectItem value={STATUS_CANCELADO}>{STATUS_CANCELADO}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{subscription.subscriptionDate}</TableCell>
                  <TableCell>
                    <Button className="mr-2" onClick={() => handleSave(subscription)}>Save</Button>
                    <Button variant="destructive" onClick={() => handleDelete(subscription.id)}>Delete</Button>
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

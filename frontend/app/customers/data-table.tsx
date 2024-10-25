"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { MoreHorizontal, Plus, ChevronRight, ChevronLeft } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Customer {
  _id: string
  fullName: string
  loans: string[]
}

export function DataTable() {
  const [data, setData] = React.useState<Customer[]>([])
  const [newCustomerName, setNewCustomerName] = React.useState("")
  const [isDialogOpen, setDialogOpen] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)

  React.useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/customers")
      setData(response.data.data)
    } catch (error) {
      console.error("Failed to fetch customers", error)
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setDialogOpen(true)
  }

  const handleAddCustomer = async () => {
    if (newCustomerName.trim()) {
      try {
        const response = await axios.post("http://localhost:8000/api/customers", { fullName: newCustomerName })
        setData((prev) => [...prev, response.data.data])
        setNewCustomerName("")
        setDialogOpen(false)
      } catch (error) {
        console.error("Failed to add customer", error)
      }
    }
  }

  const handleUpdateCustomer = async () => {
    if (editingCustomer) {
      try {
        const response = await axios.put(`http://localhost:8000/api/customers/${editingCustomer._id}`, {
          fullName: editingCustomer.fullName,
        })
        setData((prev) =>
          prev.map((customer) => (customer._id === editingCustomer._id ? response.data.data : customer))
        )
        setEditingCustomer(null)
        setDialogOpen(false)
      } catch (error) {
        console.error("Failed to update customer", error)
      }
    }
  }

  const resetForm = () => {
    setEditingCustomer(null)
    setNewCustomerName("")
  }

  const handleDeleteCustomer = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/customers/${id}`)
      setData((prev) => prev.filter((customer) => customer._id !== id))
    } catch (error) {
      console.error("Failed to delete customer", error)
    }
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "loans",
      header: "Loans",
      cell: ({ row }) => {
        const loans = row.original.loans
        return loans.length > 0 ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{loans.length} ongoing loans</span>
        ) : (
          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded">No active loans</span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditCustomer(row.original)}>Edit customer information</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`/customers/${row.original._id}/loans`}>View loans</a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <AlertDialog>
                  <AlertDialogTrigger className="text-red-600 w-full text-left">Delete customer</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the customer and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCustomer(row.original._id)} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Customers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Edit Customer Information" : "Add a New Customer"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <Input
                placeholder="Full Name"
                value={editingCustomer?.fullName || newCustomerName}
                onChange={(e) =>
                  editingCustomer
                    ? setEditingCustomer({ ...editingCustomer, fullName: e.target.value })
                    : setNewCustomerName(e.target.value)
                }
              />
              <Button onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
                {editingCustomer ? "Update Customer" : "Add Customer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, Plus, ChevronRight, ChevronLeft } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Product {
  _id: string
  name: string
  productID: string
  available: boolean
  createdAt: string
}

export function DataTable() {
  const [data, setData] = React.useState<Product[]>([])
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({})
  const [isDialogOpen, setDialogOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)
  const [alertDialogOpenId, setAlertDialogOpenId] = React.useState<string | null>(null) // Added state for AlertDialog

  React.useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products")
      setData(response.data.data)
    } catch (error) {
      console.error("Failed to fetch products", error)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.productID) {
      try {
        const response = await axios.post("http://localhost:8000/api/products", {
          ...newProduct,
          available: true, // Default to available
        })
        setData((prev) => [...prev, response.data.data])
        setNewProduct({})
        setDialogOpen(false)
      } catch (error) {
        console.error("Failed to add product", error)
      }
    }
  }

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/products/${editingProduct._id}`,
          editingProduct
        )
        setData((prev) =>
          prev.map((product) =>
            product._id === editingProduct._id ? response.data.data : product
          )
        )
        setEditingProduct(null)
        setDialogOpen(false)
      } catch (error) {
        console.error("Failed to update product", error)
      }
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setNewProduct({})
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`)
      setData((prev) => prev.filter((product) => product._id !== id))
    } catch (error) {
      console.error("Failed to delete product", error)
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "productID",
      header: "Product ID",
    },
    {
      accessorKey: "available",
      header: "Availability",
      cell: ({ row }) => {
        const available = row.getValue("available")
        return (
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {available ? "Available" : "Unavailable"}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu
            open={openDropdownId === row.original._id}
            onOpenChange={(open) => setOpenDropdownId(open ? row.original._id : null)}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => handleEditProduct(row.original)}>
                Edit product information
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setAlertDialogOpenId(row.original._id)
                }}
                className="text-red-600"
              >
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  
          {alertDialogOpenId === row.original._id && (
            <AlertDialog
              open={true}
              onOpenChange={(open) => {
                if (!open) {
                  setAlertDialogOpenId(null)
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setAlertDialogOpenId(null)
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteProduct(row.original._id)
                      setAlertDialogOpenId(null)
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
        <h1 className="text-xl font-bold">Inventory Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product Information" : "Add a New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <Input
                placeholder="Name"
                value={editingProduct?.name || newProduct.name || ""}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, name: e.target.value })
                    : setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Product ID"
                value={editingProduct?.productID || newProduct.productID || ""}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, productID: e.target.value })
                    : setNewProduct({ ...newProduct, productID: e.target.value })
                }
              />
              <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                {editingProduct ? "Update Product" : "Add Product"}
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
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Customer {
  _id: string;
  fullName: string;
}

interface Product {
  _id: string;
  name: string;
  productID: string;
  available: boolean;
}

interface Loan {
  _id: string;
  created: string;
  customers: Customer[];
  products: Product[];
  description: string;
}

export default function LoanView() {
  const [data, setData] = React.useState<Loan[]>([]);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [editingLoan, setEditingLoan] = React.useState<Loan | null>(null);
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(
    null
  );
  const [alertDialogOpenId, setAlertDialogOpenId] = React.useState<
    string | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // State for creating a new loan
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newLoanDescription, setNewLoanDescription] = React.useState("");
  const [selectedCustomerIds, setSelectedCustomerIds] = React.useState<
    string[]
  >([]);
  const [selectedProductIds, setSelectedProductIds] = React.useState<
    string[]
  >([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetchLoans();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://backend:8000/api/loans");
      setData(response.data.data);
      setLoading(false);
    } catch {
      setError("Failed to fetch loans");
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://backend:8000/api/customers");
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://backend:8000/api/products");
      setProducts(response.data.data.filter((p: Product) => p.available));
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleEditLoan = (loan: Loan) => {
    setEditingLoan(loan);
    setDialogOpen(true);
  };

  const handleUpdateLoan = async () => {
    if (editingLoan) {
      try {
        await axios.put(`http://backend:8000/api/loans/${editingLoan._id}`, {
          description: editingLoan.description,
        });
        setData((prev) =>
          prev.map((loan) =>
            loan._id === editingLoan._id ? editingLoan : loan
          )
        );
        setEditingLoan(null);
        setDialogOpen(false);
      } catch (error) {
        console.error("Failed to update loan", error);
      }
    }
  };

  const handleDeleteLoan = async (id: string) => {
    console.log("handleDeleteLoan called with id:", id);
    try {
      await axios.delete(`http://backend:8000/api/loans/${id}`);
      setData((prev) => prev.filter((loan) => loan._id !== id));
    } catch (error) {
      console.error("Failed to delete loan", error);
    }
  };

  const resetForm = () => {
    setEditingLoan(null);
    setNewLoanDescription("");
    setSelectedCustomerIds([]);
    setSelectedProductIds([]);
  };

  const handleCreateLoan = async () => {
    if (
      newLoanDescription.trim() &&
      selectedCustomerIds.length > 0 &&
      selectedProductIds.length > 0
    ) {
      try {
        const response = await axios.post("http://backend:8000/api/loans", {
          description: newLoanDescription,
          customers: selectedCustomerIds,
          products: selectedProductIds,
        });
        setData((prev) => [...prev, response.data.data]);
        setCreateDialogOpen(false);
        resetForm();
        fetchProducts(); // Refresh product availability
      } catch (error) {
        console.error("Failed to create loan", error);
      }
    }
  };

  const columns: ColumnDef<Loan>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "created",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "customers",
      header: "Customers",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.customers.map((customer) => (
            <Badge key={customer._id} variant="secondary">
              {customer.fullName}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.products.map((product) => (
            <Badge key={product._id} variant="secondary">
              {product.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu
            open={openDropdownId === row.original._id}
            onOpenChange={(open) =>
              setOpenDropdownId(open ? row.original._id : null)
            }
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => handleEditLoan(row.original)}>
                Edit loan description
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setAlertDialogOpenId(row.original._id);
                }}
                className="text-red-600 w-full text-left"
              >
                Delete loan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Place the AlertDialog here */}
          {alertDialogOpenId === row.original._id && (
            <AlertDialog
              open={true}
              onOpenChange={(open) => {
                if (!open) {
                  setAlertDialogOpenId(null);
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the loan and update product availability.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setAlertDialogOpenId(null)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteLoan(row.original._id);
                      setAlertDialogOpenId(null);
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
  ];

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
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Loans Management</h1>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Create Loan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Loan</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4 py-4">
              <Input
                placeholder="Description"
                value={newLoanDescription}
                onChange={(e) => setNewLoanDescription(e.target.value)}
              />
              <div>
                <h3 className="font-semibold mb-2">Select Customers:</h3>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {customers.map((customer) => (
                    <div
                      key={customer._id}
                      className="flex items-center mb-2"
                    >
                      <Checkbox
                        id={`customer-${customer._id}`}
                        checked={selectedCustomerIds.includes(customer._id)}
                        onCheckedChange={(checked) => {
                          setSelectedCustomerIds((prev) =>
                            checked
                              ? [...prev, customer._id]
                              : prev.filter((id) => id !== customer._id)
                          );
                        }}
                      />
                      <label
                        htmlFor={`customer-${customer._id}`}
                        className="ml-2"
                      >
                        {customer.fullName}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Select Products:</h3>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center mb-2">
                      <Checkbox
                        id={`product-${product._id}`}
                        checked={selectedProductIds.includes(product._id)}
                        onCheckedChange={(checked) => {
                          setSelectedProductIds((prev) =>
                            checked
                              ? [...prev, product._id]
                              : prev.filter((id) => id !== product._id)
                          );
                        }}
                      />
                      <label
                        htmlFor={`product-${product._id}`}
                        className="ml-2"
                      >
                        {product.name} (ID: {product.productID})
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleCreateLoan}>Create Loan</Button>
            </DialogFooter>
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* Place the AlertDialog here */}
                  {alertDialogOpenId === row.original._id && (
                    <AlertDialog
                      open={true}
                      onOpenChange={(open) => {
                        if (!open) {
                          setAlertDialogOpenId(null);
                        }
                      }}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the loan and update product availability.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setAlertDialogOpenId(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteLoan(row.original._id);
                              setAlertDialogOpenId(null);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={table.getState().pagination.pageSize}
              />
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

      {/* Edit Loan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        {editingLoan && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Loan Description</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4 py-4">
              <Input
                placeholder="Description"
                value={editingLoan.description}
                onChange={(e) =>
                  setEditingLoan({
                    ...editingLoan,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleUpdateLoan}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
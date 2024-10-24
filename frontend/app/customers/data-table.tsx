"use client";

import * as React from "react";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { MoreHorizontal, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Example data for the table
const exampleData = [
    { id: "1", fullName: "John Doe", loans: 3 },
    { id: "2", fullName: "Jane Smith", loans: 0 },
    { id: "3", fullName: "Michael Johnson", loans: 2 },
    { id: "4", fullName: "Emily Davis", loans: 1 },
    { id: "5", fullName: "Daniel Wilson", loans: 4 },
    { id: "6", fullName: "Sophia Martinez", loans: 2 },
    { id: "7", fullName: "James Brown", loans: 0 },
    { id: "8", fullName: "Olivia Garcia", loans: 3 },
];

// Main DataTable component
export function DataTable() {
    const [data, setData] = React.useState(exampleData);
    const [newCustomerName, setNewCustomerName] = React.useState("");
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const [editingCustomer, setEditingCustomer] = React.useState<any>(null);

    const handleEditCustomer = (customer: any) => {
        setEditingCustomer(customer);
        setDialogOpen(true);
    };

    const handleAddCustomer = () => {
        if (newCustomerName.trim()) {
            setData((prev) => [
                ...prev,
                { id: `${prev.length + 1}`, fullName: newCustomerName, loans: 0 },
            ]);
            setNewCustomerName("");
            setDialogOpen(false);
        }
    };

    const handleUpdateCustomer = () => {
        if (editingCustomer) {
            setData((prev) =>
                prev.map((customer) => (customer.id === editingCustomer.id ? { ...customer, fullName: editingCustomer.fullName } : customer))
            );
            setEditingCustomer(null); // Reset after updating
            setDialogOpen(false);
        }
    };

    const resetForm = () => {
        setEditingCustomer(null); // Reset editing state
        setNewCustomerName(""); // Reset new customer name
    };

    // Define the columns
    const columns: ColumnDef<any>[] = [
        {
          accessorKey: "fullName",
          header: "Full Name",
          cell: (info) => <span>{String(info.getValue())}</span>, // Safely cast to string
        },
        {
          accessorKey: "loans",
          header: "Loans",
          cell: ({ row }) => {
            const loans = Number(row.getValue("loans")); // Safely cast to number
            return loans > 0 ? (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{loans} ongoing loans</span>
            ) : (
              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded">No active loans</span>
            );
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
                    <DropdownMenuItem onClick={() => handleEditCustomer(row.original)}>
                      Edit customer information
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`/customers/${row.original.id}/loans`}>View loans</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                pageSize: 10, // Default to 10 rows per page
            },
        },
    });

    return (
        <div className="container mx-auto py-10">
            {/* Title and Add Customer Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Customers</h1>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center"
                            onClick={resetForm} // Reset when adding a new customer
                        >
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

            {/* Data Table */}
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
                {/* Rows per page dropdown */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
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

                {/* Pagination buttons */}
                <div className="flex items-center space-x-4">
                    {/* <div>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div> */}
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
    );
}